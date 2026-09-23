import {useMemo,useState} from 'react';
import {Dumbbell,Home,CalendarDays,BarChart3,User,Play,Clock3,ChevronRight,Flame} from 'lucide-react';
import {exercises,plans} from './data';
type Tab='home'|'treino'|'progresso'|'perfil';
export default function App(){
 const [tab,setTab]=useState<Tab>('home'); const [active,setActive]=useState(false);
 const plan=useMemo(()=>plans[0],[ ]);
 return <div className="app">
  <header><div><span className="eyebrow">APP TREINO</span><h1>Seu treino, sua evolução.</h1></div><div className="avatar">M</div></header>
  {tab==='home'&&<main>
   <section className="hero"><div><span>Treino de hoje</span><h2>{plan.name}</h2><p>{plan.frequency} • {plan.duration}</p></div><button onClick={()=>setTab('treino')}><Play size={18} fill="currentColor"/> Começar</button></section>
   <div className="stats"><div><Flame/><b>0</b><small>dias seguidos</small></div><div><Dumbbell/><b>{exercises.length}</b><small>exercícios</small></div><div><BarChart3/><b>0 kg</b><small>volume registrado</small></div></div>
   <section><div className="section-title"><h3>Seu plano</h3><span>V1</span></div><div className="card"><h3>{plan.name}</h3><p>Programa de corpo inteiro para quem quer construir força e consistência.</p><div className="chips"><span>3x semana</span><span>Iniciante</span><span>Força + hipertrofia</span></div></div></section>
   <section><div className="section-title"><h3>Próximos exercícios</h3><span>Ver todos</span></div>{exercises.slice(0,4).map(e=><div className="exercise" key={e.id}><div className="exercise-icon"><Dumbbell size={20}/></div><div><b>{e.name}</b><small>{e.muscle} • {e.sets} séries × {e.reps}</small></div><ChevronRight size={18}/></div>)}</section>
  </main>}
  {tab==='treino'&&<main><section className="workout-head"><span>Treino A</span><h2>{plan.name}</h2><p><Clock3 size={16}/> {plan.duration}</p></section>{exercises.map(e=><div className="card exercise-card" key={e.id}><div><h3>{e.name}</h3><p>{e.muscle}</p></div><div className="sets">{e.sets} × {e.reps}</div></div>)}<button className="primary full" onClick={()=>setActive(!active)}>{active?'Treino em andamento':'Iniciar treino'}</button></main>}
  {tab==='progresso'&&<main><section className="empty"><BarChart3 size={44}/><h2>Sua evolução</h2><p>Registre cargas e repetições durante os treinos para acompanhar seu progresso.</p><button className="primary" onClick={()=>setTab('treino')}>Registrar primeiro treino</button></section></main>}
  {tab==='perfil'&&<main><div className="profile"><div className="big-avatar">M</div><h2>Meu perfil</h2><p>Configure seu objetivo, nível e frequência semanal.</p></div><div className="card"><b>Objetivo</b><p>Força + hipertrofia</p><hr/><b>Nível</b><p>Iniciante</p><hr/><b>Frequência</b><p>3 dias por semana</p></div></main>}
  <nav>{[['home','Início',Home],['treino','Treino',CalendarDays],['progresso','Progresso',BarChart3],['perfil','Perfil',User]].map(([id,label,Icon])=><button key={id as string} className={tab===id?'active':''} onClick={()=>setTab(id as Tab)}><Icon size={21}/><span>{label}</span></button>)}</nav>
 </div>
}