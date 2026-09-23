import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled, getAnonymousUser } from '../services/firebase';

const HISTORY_KEY = 'app-treino-history-v2';
const PROFILE_KEY = 'app-treino-profile-v2';
const CUSTOM_KEY = 'app-treino-custom-workouts-v5';

function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}}

export function useWorkoutStorage(){
  const [history,setHistory]=useState(()=>read(HISTORY_KEY,[]));
  const [customWorkouts,setCustomWorkouts]=useState(()=>read(CUSTOM_KEY,[]));
  const [profile,setProfile]=useState(()=>read(PROFILE_KEY,{name:'Atleta',goal:'Hipertrofia',level:'Iniciante'}));
  const [cloud,setCloud]=useState({enabled:firebaseEnabled,status:firebaseEnabled?'conectando':'local'});
  
  useEffect(()=>{localStorage.setItem(HISTORY_KEY,JSON.stringify(history))},[history]);
  useEffect(()=>{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))},[profile]);
  useEffect(()=>{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customWorkouts))},[customWorkouts]);

  useEffect(()=>{
    let cancelled=false;
    async function sync(){
      if(!firebaseEnabled||!db){return;}
      try{
        const user=await getAnonymousUser();
        if(!user||cancelled)return;
        const q=query(collection(db,'users',user.uid,'workouts'),orderBy('date','desc'),limit(50));
        const snapshot=await getDocs(q);
        if(cancelled)return;
        const remote=snapshot.docs.map(item=>({id:item.id,...item.data()}));
        if(remote.length)setHistory(remote);
        const customSnapshot=await getDocs(query(collection(db,'users',user.uid,'customWorkouts'),orderBy('createdAt','desc'),limit(50)));
        const remoteCustom=customSnapshot.docs.map(item=>({id:item.id,...item.data()}));
        if(remoteCustom.length)setCustomWorkouts(remoteCustom);
        const profileDoc=await getDocs(query(collection(db,'users',user.uid,'profile'),limit(1)));
        if(!cancelled&&!profileDoc.empty)setProfile(profileDoc.docs[0].data());
        setCloud({enabled:true,status:'conectado'});
      }catch(error){
        console.warn('Firebase indisponível; mantendo dados locais.',error);
        if(!cancelled)setCloud({enabled:true,status:'local'});
      }
    }
    sync();
    return()=>{cancelled=true};
  },[]);

  const saveWorkout=async(workout)=>{
    setHistory(prev=>[workout,...prev]);
    if(firebaseEnabled&&db){
      try{
        const user=await getAnonymousUser();
        if(user)await addDoc(collection(db,'users',user.uid,'workouts'),workout);
      }catch(error){console.warn('Não foi possível sincronizar o treino.',error);}
    }
  };

  const saveCustomWorkout=async(workout)=>{
    const item={...workout,id:workout.id||`custom-${Date.now()}`,createdAt:workout.createdAt||new Date().toISOString()};
    setCustomWorkouts(prev=>[item,...prev.filter(w=>w.id!==item.id)]);
    if(firebaseEnabled&&db){try{const user=await getAnonymousUser();if(user)await setDoc(doc(db,'users',user.uid,'customWorkouts',String(item.id)),item,{merge:true});}catch(error){console.warn('Não foi possível sincronizar o treino personalizado.',error);}}
    return item;
  };

  const updateProfile=async(nextProfile)=>{
    setProfile(nextProfile);
    if(firebaseEnabled&&db){
      try{
        const user=await getAnonymousUser();
        if(user)await setDoc(doc(db,'users',user.uid,'profile','main'),nextProfile,{merge:true});
      }catch(error){console.warn('Não foi possível sincronizar o perfil.',error);}
    }
  };

  return {history,profile,setProfile:updateProfile,saveWorkout,customWorkouts,saveCustomWorkout,cloud};
}