import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, db, firebaseConfigured } from './firebase';

export type CloudSetLog={exerciseId:string;exercise:string;set:number;weight:number;reps:number;notes:string};
export type CloudWorkout={id:string;date:string;plan:string;sets:CloudSetLog[]};

export function watchAuth(callback:(user:User|null)=>void){
  if(!firebaseConfigured||!auth) return ()=>{};
  return onAuthStateChanged(auth,callback);
}
export async function login(email:string,password:string){
  if(!auth) throw new Error('Firebase ainda não foi configurado.');
  return signInWithEmailAndPassword(auth,email,password);
}
export async function register(email:string,password:string){
  if(!auth) throw new Error('Firebase ainda não foi configurado.');
  return createUserWithEmailAndPassword(auth,email,password);
}
export async function logout(){if(auth) await signOut(auth);}
export async function saveWorkout(userId:string,workout:CloudWorkout){
  if(!db) return;
  await setDoc(doc(db,'users',userId,'workouts',workout.id),workout);
}
export function watchHistory(userId:string,callback:(items:CloudWorkout[])=>void){
  if(!db) return ()=>{};
  const q=query(collection(db,'users',userId,'workouts'),orderBy('date','desc'));
  return onSnapshot(q,s=>callback(s.docs.map(d=>d.data() as CloudWorkout)));
}
