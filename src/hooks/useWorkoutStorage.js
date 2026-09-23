import { useEffect, useState } from 'react';

const HISTORY_KEY = 'app-treino-history-v2';
const PROFILE_KEY = 'app-treino-profile-v2';

function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}}

export function useWorkoutStorage(){
  const [history,setHistory]=useState(()=>read(HISTORY_KEY,[]));
  const [profile,setProfile]=useState(()=>read(PROFILE_KEY,{name:'Atleta',goal:'Hipertrofia',level:'Iniciante'}));
  useEffect(()=>localStorage.setItem(HISTORY_KEY,JSON.stringify(history)),[history]);
  useEffect(()=>localStorage.setItem(PROFILE_KEY,JSON.stringify(profile)),[profile]);
  const saveWorkout=(workout)=>setHistory(prev=>[workout,...prev]);
  return {history,profile,setProfile,saveWorkout};
}

export { HISTORY_KEY, PROFILE_KEY };