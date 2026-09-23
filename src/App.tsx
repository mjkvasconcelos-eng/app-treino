import {useEffect,useMemo,useState} from 'react';
import {Dumbbell,Home,CalendarDays,BarChart3,User,Play,Clock3,ChevronRight,Flame,Pause,RotateCcw,Volume2,Check,Plus,Minus} from 'lucide-react';
import {exercises,plans} from './data';
type Tab='home'|'treino'|'progresso'|'perfil';
const REST_KEY='app-treino-rest-seconds';
export default function App(){
 const [tab,setTab]=useState<Tab>('home'); const [active,setActive]=useState(false);
 const [rest,setRest]=useState(()=>Number(localStorage.getItem(REST_KEY))||60);
 const [remaining,setRemaining]=useState(0); const [running,setRunning]=useState(false); const [finished,setFinished]=useState(false);
 const [currentExercise,setCurrentExercise]=useState(0); const [currentSet,setCurrentSet]=useState(1); const [seriesDone,setSeriesDone]=useState(false);
 const plan=useMemo(()=>plans[0],[]);
 useEffect(()=>{if(!running||remaining<=0)return; const id=window.setInterval(()=>setRemaining(v=>Math.max(0,v-1)),1000); return()=>window.clearInterval(id)},[running,remaining]);
 useEffect(()=>{if(running&&remaining===0){setRunning(false);setFinished(true); try{navigator.vibrate?.([200,100,200]); const C=window.AudioContext||(window as any).webkitAudioContext; if(C){const c=new C();const o=c.createOscillator();const g=c.createGain();o.frequency.value=880;g.gain.setValueAtTime(.08,c.currentTime);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.35)}}catch{}}},[remaining,running]);
 useEffect(()=>{if(finished){const id=window.setTimeout(()=>setFinished(false),3500);return()=>window.clearTimeout(id)}},[finished]);
 const startRest=()=>{setFinished(false);setRemaining(rest);setRunning(true)};
 const pauseRest=()=>setRunning(false); const resetRest=()=>{setRunning(false);setFinished(false);setRemaining(rest)};
 const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
 const saveRest=(v:number)=>{const n=Math.min(300,Math.max(10,v));setRest(n);localStorage.setItem(REST_KEY,String(n));if(!running)setRemaining(n)};
 const changeRest=(delta:number)=>saveRest(rest+delta);
 const completeSet=()=>{setSeriesDone(true);if(currentSet<exercises[currentExercise].sets){setCurrentSet(v=>v+1);setFinished(false);setRemaining(rest);setRunning(true)}else if(currentExercise<exercises.length-1){setCurrentExercise(v=>v+1);setCurrentSet(1);setFinished(false);setRemaining(rest);setRunning(true)}else{setActive(false);setSeriesDone(false);setFinished(true)}};
 const startWorkout=()=>{setActive(true);setCurrentExercise(0);setCurrentSet(1);setSeriesDone(false);setFinished(false);setRunning(false);setRemaining(rest)};
 const current=exercises[currentExercise];
 return <div className="app">
  <header><div><span className="eyebrow">APP TREINO</span><h1>Seu treino, sua evolução.</h1></div><div className="avatar">M</div></header>
  {tab==='home'&&<main><section className="hero"><div><span>Treino de hoje</span><h2>{plan.name}</h2><p>{plan.frequency} • {plan.duration}</p></div><button onClick={()=>setTab('treino')}><Play size={18} fill="currentColor"/> Começar</button></section>
   <div className="stats"><div><Flame/><b>0</b><small>dias seguidos</small></div><div><Dumbbell/><b>{exercises.length}</b><small>exercícios</small></div><div><BarChart3/><b>0 kg</b><small>volume registrado</small></div></div>
   <section><div className="section-title"><h3>Seu plano</h3><span>V1</span></div><div className="card"><h3>{plan.name}</h3><p>Programa de corpo inteiro para quem quer construir força e consistência.</p><div className="chips"><span>3x semana</span><span>Iniciante</span><span>Força + hipertrofia</span></div></div></section>
   <section><div className="section-title"><h3>Próximos exercícios</h3><span>Ver todos</span></div>{exercises.slice(0,4).map(e=><div className="exercise" key={e.id}><div className="exercise-icon"><Dumbbell size={20}/></div><div><b>{e.name}</b><small>{e.muscle} • {e.sets} séries × {e.reps}</small></div><ChevronRight size={18}/></div>)}</section>
  </main>}
  {tab==='treino'&&<main><section className="workout-head"><span>Treino A</span><h2>{plan.name}</h2><p><Clock3 size={16}/> {plan.duration}</p></section>
   {!active&&<section className="rest-panel setup"><div className="rest-title"><div><span>AJUSTE ANTES DE COMEÇAR</span><h2>{fmt(rest)}</h2></div><Volume2 size={20}/></div><p>Escolha o descanso que será iniciado automaticamente após cada série.</p><div className="time-adjust"><button onClick={()=>changeRest(-5)}><Minus size={18}/></button><strong>{rest}s</strong><button onClick={()=>changeRest(5)}><Plus size={18}/></button></div><input type="range" min="10" max="300" step="5" value={rest} onChange={e=>saveRest(Number(e.target.value))}/><button className="primary full" onClick={startWorkout}><Play size={18} fill="currentColor"/> Começar treino</button></section>}
   {active&&<section className="rest-panel"><div className="series-status"><span>EXERCÍCIO {currentExercise+1} DE {exercises.length}</span><b>Série {currentSet} de {current.sets}</b></div><div className="rest-title"><div><span>DESCANSO</span><h2>{fmt(remaining||rest)}</h2></div><Volume2 size={20}/></div><div className="rest-progress"><div style={{width:`${Math.max(0,Math.min(100,(remaining/(rest||1))*100))}%`}}/></div><div className="rest-controls"><button onClick={running?pauseRest:startRest}>{running?<Pause size={18}/>:<Play size={18} fill="currentColor"/>}{running?'Pausar':remaining>0&&remaining<rest?'Continuar':'Iniciar'}</button><button onClick={resetRest}><RotateCcw size={18}/> Reiniciar</button></div><div className="series-action"><button className="primary full" onClick={completeSet}><Check size={18}/> Concluir série</button></div>{finished&&<div className="rest-done"><Check size={18}/> Descanso encerrado! Próxima série.</div>}<label>Tempo: <strong>{rest}s</strong><input type="range" min="10" max="300" step="5" value={rest} onChange={e=>saveRest(Number(e.target.value))}/></label></section>}
   {exercises.map((e,i)=><div className={`card exercise-card ${i===currentExercise&&active?'current-exercise':''}`} key={e.id}><div><h3>{e.name}</h3><p>{e.muscle}</p></div><div className="sets">{e.sets} × {e.reps}</div></div>)}
  </main>}
  {tab==='progresso'&&<main><section className="empty"><BarChart3 size={44}/><h2>Sua evolução</h2><p>Registre cargas e repetições durante os treinos para acompanhar seu progresso.</p><button className="primary" onClick={()=>setTab('treino')}>Registrar primeiro treino</button></section></main>}
  {tab==='perfil'&&<main><div className="profile"><div className="big-avatar">M</div><h2>Meu perfil</h2><p>Configure seu objetivo, nível e frequência semanal.</p></div><div className="card"><b>Objetivo</b><p>Força + hipertrofia</p><hr/><b>Nível</b><p>Iniciante</p><hr/><b>Frequência</b><p>3 dias por semana</p></div></main>}
  <nav>{[['home','Início',Home],['treino','Treino',CalendarDays],['progresso','Progresso',BarChart3],['perfil','Perfil',User]].map(([id,label,Icon])=><button key={id as string} className={tab===id?'active':''} onClick={()=>setTab(id as Tab)}><Icon size={21}/><span>{label}</span></button>)}</nav>
 </div>
}