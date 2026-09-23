import {exercises} from '../data/exercises';
import {buildAthleteAnalysis} from './athleteAnalysis';

function avg(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}
function pct(a,b){return b?Math.round((a/b)*100):0}

export function buildWeeklyReport(history,profile){
  const now=Date.now();
  const week=history.filter(h=>{const age=now-new Date(h.date).getTime();return age>=0&&age<=7*86400000});
  const previous=history.filter(h=>{const age=now-new Date(h.date).getTime();return age>7*86400000&&age<=14*86400000});
  const analysis=buildAthleteAnalysis(history,profile);
  const targetDays=Math.min(7,Math.max(2,Number(profile?.days)||3));
  const plannedSets=analysis.targetDays*4*(profile?.level==='Avançado'?4:profile?.level==='Intermediário'?3:2);
  const actualSets=week.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0);
  const previousSets=previous.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0);
  const details=week.flatMap(w=>(w.exercises||[]).flatMap(e=>(e.details||[]).map(d=>({...d,exerciseId:e.exerciseId,date:w.date}))));
  const previousDetails=previous.flatMap(w=>(w.exercises||[]).flatMap(e=>(e.details||[]).map(d=>({...d,exerciseId:e.exerciseId,date:w.date}))));
  const avgRpe=avg(details.map(x=>Number(x.rpe)||0));
  const prevRpe=avg(previousDetails.map(x=>Number(x.rpe)||0));
  const volume=details.reduce((s,x)=>(s+(Number(x.weight)||0)*(Number(x.reps)||0)),0);
  const prevVolume=previousDetails.reduce((s,x)=>(s+(Number(x.weight)||0)*(Number(x.reps)||0)),0);

  const ids=[...new Set(details.map(x=>x.exerciseId))];
  const exerciseResults=ids.map(id=>{
    const cur=details.filter(x=>x.exerciseId===id);
    const old=previousDetails.filter(x=>x.exerciseId===id);
    const currentMax=Math.max(...cur.map(x=>Number(x.weight)||0),0);
    const oldMax=Math.max(...old.map(x=>Number(x.weight)||0),0);
    const currentReps=avg(cur.map(x=>Number(x.reps)||0));
    const oldReps=avg(old.map(x=>Number(x.reps)||0));
    const name=exercises.find(x=>x.id===id)?.name||id;
    const delta=oldMax>0?((currentMax-oldMax)/oldMax)*100:0;
    const repDelta=oldReps>0?((currentReps-oldReps)/oldReps)*100:0;
    let status='estável';
    if(delta>2||repDelta>5)status='melhorou';
    else if(delta<-2||repDelta<-5)status='piorou';
    return {id,name,currentMax,oldMax,currentReps,oldReps,delta:Number(delta.toFixed(1)),repDelta:Number(repDelta.toFixed(1)),status};
  });

  const improved=exerciseResults.filter(x=>x.status==='melhorou').sort((a,b)=>b.delta-a.delta).slice(0,5);
  const worsened=exerciseResults.filter(x=>x.status==='piorou').sort((a,b)=>a.delta-b.delta).slice(0,5);
  const stalled=analysis.stalled.map(x=>({...x,name:exercises.find(e=>e.id===x.id)?.name||x.id}));
  const adherence=Math.min(100,Math.round((week.length/targetDays)*100));
  const volumeChange=prevVolume?Math.round(((volume-prevVolume)/prevVolume)*100):0;
  const recommendations=[];
  if(adherence<100)recommendations.push('Priorize cumprir os dias planejados antes de aumentar o volume.');
  else recommendations.push('Mantenha a frequência alcançada e progrida apenas quando a execução estiver consistente.');
  if(avgRpe>=8.5)recommendations.push('Mantenha ou reduza levemente cargas nos exercícios mais difíceis; evite aumentar carga com RPE alto.');
  else if(avgRpe>0&&avgRpe<=7)recommendations.push('Nos exercícios em que todas as séries foram concluídas, use progressão pequena de carga ou repetições.');
  if(volumeChange>20)recommendations.push('Segure novos aumentos de volume nesta semana para evitar elevar muitas variáveis ao mesmo tempo.');
  if(stalled.length)recommendations.push('Nos exercícios estagnados, mantenha a carga e tente aumentar repetições antes de subir o peso.');
  if(worsened.length)recommendations.push('Revise técnica, descanso e recuperação nos exercícios que pioraram antes de aumentar a carga.');
  if(!recommendations.length)recommendations.push('Continue registrando todos os treinos para melhorar a precisão do relatório.');

  return {week,previous,targetDays,plannedSessions:targetDays,completedSessions:week.length,adherence,plannedSets,actualSets,setAdherence:pct(actualSets,plannedSets),previousSets,volume,previousVolume:prevVolume,volumeChange,avgRpe:Number(avgRpe.toFixed(1)),prevRpe:Number(prevRpe.toFixed(1)),rpeChange:Number((avgRpe-prevRpe).toFixed(1)),improved,worsened,stalled,recommendations,analysis,generatedAt:new Date().toISOString()};
}
