import {exercises} from '../data/exercises';

const DAY=86400000;
function avg(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}

function metrics(workouts,plannedDays){
  const details=workouts.flatMap(w=>(w.exercises||[]).flatMap(e=>(e.details||[]).map(d=>({...d,exerciseId:e.exerciseId}))));
  const sessions=workouts.length;
  const sets=workouts.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0);
  const volume=details.reduce((s,d)=>s+(Number(d.weight)||0)*(Number(d.reps)||0),0);
  const rpe=avg(details.map(d=>Number(d.rpe)||0));
  const load=details.length?Math.max(...details.map(d=>Number(d.weight)||0),0):0;
  const adherence=Math.min(100,Math.round((sessions/Math.max(1,plannedDays))*100));
  const exerciseMap={};
  details.forEach(d=>{if(!exerciseMap[d.exerciseId])exerciseMap[d.exerciseId]=[];exerciseMap[d.exerciseId].push(d)});
  const exercisePerformance=Object.entries(exerciseMap).map(([id,list])=>({id,name:exercises.find(x=>x.id===id)?.name||id,maxLoad:Math.max(...list.map(x=>Number(x.weight)||0),0),avgReps:Number(avg(list.map(x=>Number(x.reps)||0)).toFixed(1)),sets:list.length,volume:list.reduce((s,x)=>s+(Number(x.weight)||0)*(Number(x.reps)||0),0)}));
  return {sessions,sets,volume,rpe:Number(rpe.toFixed(1)),load,adherence,exercisePerformance};
}

export function buildReportTimeline(history,profile,range=12){
  const now=new Date();
  const plannedDays=Math.min(7,Math.max(2,Number(profile?.days)||3));
  const weeks=[];
  const count=Math.min(52,Math.max(4,Number(range)||12));
  for(let i=count-1;i>=0;i--){
    const end=new Date(now.getTime()-i*7*DAY);
    end.setHours(23,59,59,999);
    const start=new Date(end.getTime()-6*DAY);
    start.setHours(0,0,0,0);
    const previousStart=new Date(start.getTime()-7*DAY);
    const previousEnd=new Date(start.getTime()-1);
    const current=history.filter(w=>{const d=new Date(w.date);return d>=start&&d<=end});
    const previous=history.filter(w=>{const d=new Date(w.date);return d>=previousStart&&d<=previousEnd});
    const m=metrics(current,plannedDays);
    const p=metrics(previous,plannedDays);
    const improved=m.volume>p.volume||m.load>p.load||m.adherence>p.adherence;
    const highlights=[];
    if(m.adherence>p.adherence)highlights.push(`aderência +${m.adherence-p.adherence} pts`);
    if(m.volume>p.volume&&p.volume)highlights.push(`volume +${Math.round(((m.volume-p.volume)/p.volume)*100)}%`);
    if(m.load>p.load&&p.load)highlights.push(`carga máxima +${Math.round(((m.load-p.load)/p.load)*100)}%`);
    if(m.rpe&&p.rpe&&m.rpe<p.rpe)highlights.push('RPE médio menor');
    const performance=m.exercisePerformance.map(e=>{const old=p.exercisePerformance.find(x=>x.id===e.id);const loadDelta=old&&old.maxLoad?((e.maxLoad-old.maxLoad)/old.maxLoad)*100:0;const repsDelta=old&&old.avgReps?((e.avgReps-old.avgReps)/old.avgReps)*100:0;let status='estável';if(loadDelta>2||repsDelta>5)status='melhorou';else if(loadDelta<-2||repsDelta<-5)status='piorou';return {...e,loadDelta:Number(loadDelta.toFixed(1)),repsDelta:Number(repsDelta.toFixed(1)),status}});
    weeks.push({key:start.toISOString().slice(0,10),label:start.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}),start:start.toISOString(),end:end.toISOString(),metrics:m,previous:p,performance,highlights,improved});
  }
  const overall=weeks.filter(w=>w.metrics.sessions>0);
  const first=overall[0]?.metrics;
  const last=overall[overall.length-1]?.metrics;
  const evolution={
    adherence:first&&last?last.adherence-first.adherence:0,
    volume:first&&first.volume?Math.round(((last.volume-first.volume)/first.volume)*100):0,
    load:first&&first.load?Math.round(((last.load-first.load)/first.load)*100):0,
    rpe:first&&first.rpe?Number((last.rpe-first.rpe).toFixed(1)):0
  };
  const exerciseMap={};
  overall.flatMap(w=>w.performance).forEach(e=>{if(!exerciseMap[e.id])exerciseMap[e.id]=[];exerciseMap[e.id].push(e)});
  const highlights=Object.values(exerciseMap).map(list=>{const first=list[0],last=list[list.length-1];const delta=first.maxLoad?((last.maxLoad-first.maxLoad)/first.maxLoad)*100:0;return {id:first.id,name:first.name,delta:Number(delta.toFixed(1)),latest:last.maxLoad,status:delta>2?'melhorou':delta<-2?'piorou':'estável'}}).sort((a,b)=>b.delta-a.delta).slice(0,5);
  return {weeks,evolution,highlights,plannedDays};
}
