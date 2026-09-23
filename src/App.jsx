import React, {useEffect, useMemo, useState} from 'react';
import {Home as HomeIcon,Dumbbell,ChevronRight,Play,CheckCircle2,ArrowLeft,Clock3,History,User,Pause,RotateCcw,Timer,TrendingUp,Save,Search,Filter,Info} from 'lucide-react';
import {programs} from './data/programs';
import {exercises,exerciseGroups} from './data/exercises';
import {useWorkoutStorage} from './hooks/useWorkoutStorage';
import CloudStatus from './components/CloudStatus';

function Header({title,onBack}){return <header className="header">{onBack?<button className="iconBtn" onClick={onBack}><ArrowLeft size={22}/></button>:<div className="logoMark">AT</div>}<h1>{title}</h1><div style={{width:40}}/></header>}

function Home({go,history,profile,cloud}){const last=history[0];return <><Header title="App Treino"/><main className="page"><CloudStatus cloud={cloud}/><section className="hero"><span>SEU TREINO DE HOJE</span><h2>Olá, {profile.name}!</h2><p>Pronto para evoluir? Escolha um programa e registre seu progresso.</p><button className="primary" onClick={()=>go('programs')}>Ver programas <ChevronRight size={20}/></button></section><section><div className="sectionTitle"><h3>Acesso rápido</h3></div><div className="quickGrid"><button onClick={()=>go('programs')}><Dumbbell/><b>Programas</b><small>Escolha seu objetivo</small></button><button onClick={()=>go('library')}><Search/><b>Exercícios</b><small>Consultar biblioteca</small></button><button onClick={()=>go('custom')}><Save/><b>Meus treinos</b><small>Criar treino personalizado</small></button><button onClick={()=>go('history')}><History/><b>Histórico</b><small>{history.length} treino(s) salvo(s)</small></button></div></section>{last&&<section className="lastWorkout"><b>Último treino</b><span>{last.programName} • {new Date(last.date).toLocaleDateString('pt-BR')}</span></section>}</main><BottomNav active="home" go={go}/></>}

function Library({go}){const [query,setQuery]=useState('');const [group,setGroup]=useState('Todos');const filtered=useMemo(()=>exercises.filter(e=>(group==='Todos'||e.group===group)&&e.name.toLowerCase().includes(query.toLowerCase())),[query,group]);return <><Header title="Exercícios" onBack={()=>go('home')}/><main className="page"><div className="searchBox"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar exercício por nome"/></div><div className="filterTitle"><h3>Grupo muscular</h3><Filter size={18}/></div><div className="chips">{exerciseGroups.map(g=><button key={g} className={group===g?'chip active':'chip'} onClick={()=>setGroup(g)}>{g}</button>)}</div><p className="muted">{filtered.length} exercício(s) encontrado(s)</p><div className="cards">{filtered.map(e=><button className="programCard" key={e.id} onClick={()=>go('exercise',e)}><div className="programIcon"><Dumbbell size={22}/></div><div className="cardText"><h3>{e.name}</h3><span>{e.group} • {e.level}</span><p>{e.equipment}</p></div><ChevronRight/></button>)}</div>{filtered.length===0&&<div className="empty"><Search size={34}/><b>Nenhum exercício encontrado</b><span>Tente outro nome ou grupo muscular.</span></div>}</main><BottomNav active="library" go={go}/></>}

function ExerciseDetails({exercise,go}){return <><Header title="Detalhes do exercício" onBack={()=>go('library')}/><main className="page"><section className="exerciseHero"><div className="exerciseHeroIcon"><Dumbbell size={34}/></div><span>{exercise.group}</span><h2>{exercise.name}</h2><p>{exercise.description}</p><div className="exerciseMeta"><b>{exercise.level}</b><b>{exercise.equipment}</b></div></section><section className="detailSection"><h3>Como executar</h3><ol>{exercise.instructions.map((step,i)=><li key={i}>{step}</li>)}</ol></section><section className="detailSection tip"><Info size={19}/><div><b>Dica</b><p>{exercise.tips}</p></div></section><button className="primary full" onClick={()=>go('programs')}>Ver programas</button></main></>}

function CustomWorkouts({go,customWorkouts}){return <><Header title="Meus treinos" onBack={()=>go('home')}/><main className="page"><button className="primary full createWorkoutBtn" onClick={()=>go('builder')}><Dumbbell/> Criar novo treino</button><p className="muted">Seus treinos personalizados ficam salvos no aparelho e, com Firebase configurado, também na nuvem.</p><div className="cards">{customWorkouts.length===0?<div className="empty"><Dumbbell size={34}/><b>Nenhum treino personalizado</b><span>Monte seu primeiro treino escolhendo os exercícios.</span></div>:customWorkouts.map(w=><button className="programCard" key={w.id} onClick={()=>go('customDetails',w)}><div className="programIcon"><Dumbbell size={22}/></div><div className="cardText"><h3>{w.name}</h3><span>{w.exercises.length} exercícios • {w.level||'Personalizado'}</span><p>{w.exercises.reduce((s,e)=>s+e.sets,0)} séries</p></div><ChevronRight/></button>)}</div></main><BottomNav active="custom" go={go}/></>}

function Builder({go,saveCustomWorkout}){
  const [name,setName]=useState('Meu treino');
  const [selected,setSelected]=useState([]);
  const [query,setQuery]=useState('');
  const filtered=exercises.filter(e=>e.name.toLowerCase().includes(query.toLowerCase()));
  const toggle=(exercise)=>setSelected(prev=>prev.some(x=>x.id===exercise.id)
    ? prev.filter(x=>x.id!==exercise.id)
    : [...prev,{...exercise,sets:3,reps:10,rest:60}]);
  const update=(id,key,value)=>setSelected(prev=>prev.map(e=>e.id===id
    ? {...e,[key]:Math.max(1,Number(value)||1)}
    : e));
  const save=async()=>{
    if(!name.trim()||!selected.length)return;
    const workout={
      id:`custom-${Date.now()}`,
      name:name.trim(),
      level:'Personalizado',
      duration:`${Math.max(10,Math.round(selected.length*7))} min`,
      description:'Treino criado por você.',
      exercises:selected,
      createdAt:new Date().toISOString()
    };
    const saved=await saveCustomWorkout(workout);
    go('customDetails',saved);
  };
  return <>
    <Header title="Criar treino" onBack={()=>go('custom')}/>
    <main className="page">
      <label>Nome do treino
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Treino A"/>
      </label>
      <div className="searchBox">
        <Search size={19}/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Adicionar exercício"/>
      </div>
      <h3>Exercícios selecionados ({selected.length})</h3>
      <div className="builderList">
        {selected.map((e,i)=>
          <div className="builderCard" key={e.id}>
            <div className="builderTop">
              <b>{i+1}. {e.name}</b>
              <button className="removeBtn" onClick={()=>toggle(e)}>Remover</button>
            </div>
            <div className="formGrid">
              <label>Séries<input inputMode="numeric" type="number" min="1" value={e.sets} onChange={x=>update(e.id,'sets',x.target.value)}/></label>
              <label>Reps<input inputMode="numeric" type="number" min="1" value={e.reps} onChange={x=>update(e.id,'reps',x.target.value)}/></label>
            </div>
            <label>Descanso (segundos)<input inputMode="numeric" type="number" min="0" value={e.rest} onChange={x=>update(e.id,'rest',x.target.value)}/></label>
          </div>
        )}
      </div>
      {selected.length===0&&<p className="muted">Selecione exercícios abaixo para montar seu treino.</p>}
      <div className="cards builderChoices">
        {filtered.map(e=>
          <button className={selected.some(x=>x.id===e.id)?'programCard selectedExercise':'programCard'} key={e.id} onClick={()=>toggle(e)}>
            <div className="programIcon"><Dumbbell size={20}/></div>
            <div className="cardText"><h3>{e.name}</h3><span>{e.group} • {e.equipment}</span></div>
            <b>{selected.some(x=>x.id===e.id)?'✓':'+'}</b>
          </button>
        )}
      </div>
      <button className="primary full" disabled={!name.trim()||!selected.length} onClick={save}>
        <Save/> Salvar meu treino
      </button>
    </main>
  </>;
}

function CustomDetails({program,go}){
  return <>
    <Header title={program.name} onBack={()=>go('custom')}/>
    <main className="page">
      <section className="summary">
        <span>PERSONALIZADO</span>
        <h2>{program.description}</h2>
        <b>{program.exercises.length} exercícios</b>
      </section>
      <div className="exerciseList">
        {program.exercises.map((e,i)=>
          <div className="exerciseRow" key={e.id}>
            <strong>{i+1}</strong>
            <div><b>{e.name}</b><small>{e.group} • {e.sets} séries × {e.reps} • {e.rest}s descanso</small></div>
          </div>
        )}
      </div>
      <button className="primary full" onClick={()=>go('workout',program)}>
        <Play size={20}/> Iniciar treino
      </button>
    </main>
  </>;
}

function Programs({go}){return <><Header title="Programas" onBack={()=>go('home')}/><main className="page"><p className="muted">Selecione um programa para ver os exercícios.</p><div className="cards">{programs.map(p=><button className="programCard" key={p.id} onClick={()=>go('details',p)}><div className="programIcon"><Dumbbell size={24}/></div><div className="cardText"><h3>{p.name}</h3><span>{p.level} • {p.duration}</span><p>{p.description}</p></div><ChevronRight/></button>)}</div></main><BottomNav active="programs" go={go}/></>}

function Details({program,go}){return <><Header title={program.name} onBack={()=>go('programs')}/><main className="page"><section className="summary"><span>{program.level}</span><h2>{program.description}</h2><b>{program.exercises.length} exercícios • {program.duration}</b></section><h3>Exercícios</h3><div className="exerciseList">{program.exercises.map((e,i)=><div className="exerciseRow" key={e.id}><strong>{i+1}</strong><div><b>{e.name}</b><small>{e.muscle} • {e.sets} séries × {e.reps}</small></div></div>)}</div><button className="primary full" onClick={()=>go('workout',program)}><Play size={20}/> Começar treino</button></main></>}

function RestTimer({seconds}){const [remaining,setRemaining]=useState(seconds);const [running,setRunning]=useState(false);useEffect(()=>{if(!running)return;const id=setInterval(()=>setRemaining(v=>{if(v<=1){setRunning(false);return 0}return v-1}),1000);return()=>clearInterval(id)},[running]);useEffect(()=>{setRemaining(seconds);setRunning(false)},[seconds]);return <div className="timerBox"><div><Timer size={18}/><b>{String(Math.floor(remaining/60)).padStart(2,'0')}:{String(remaining%60).padStart(2,'0')}</b></div><button onClick={()=>setRunning(v=>!v)}>{running?<Pause size={17}/>:<Play size={17}/>}</button><button onClick={()=>{setRunning(false);setRemaining(seconds)}}><RotateCcw size={17}/></button></div>}

function Workout({program,go,saveWorkout}){const [index,setIndex]=useState(0);const [series,setSeries]=useState({});const [current,setCurrent]=useState({weight:'',reps:''});const ex=program.exercises[index];const completed=series[ex.id]||0;const last=index===program.exercises.length-1;const progress=Math.round(((index+completed/ex.sets)/program.exercises.length)*100);const finish=()=>{saveWorkout({id:Date.now(),date:new Date().toISOString(),programId:program.id,programName:program.name,minutes:parseInt(program.duration),exercises:Object.entries(series).map(([exerciseId,sets])=>({exerciseId,sets}))});go('done',program)};const addSet=()=>{if(completed>=ex.sets)return;setSeries(s=>({...s,[ex.id]:completed+1}));setCurrent({weight:'',reps:''});};return <><Header title="Treino" onBack={()=>go('details',program)}/><main className="page"><div className="progressLabel"><span>Exercício {index+1} de {program.exercises.length}</span><b>{Math.min(progress,100)}%</b></div><div className="progress"><div style={{width:Math.min(progress,100)+'%'}}/></div><section className="workoutCard"><span>{ex.muscle}</span><h2>{ex.name}</h2><div className="stats"><div><b>{ex.sets}</b><small>Séries</small></div><div><b>{ex.reps}</b><small>Repetições</small></div><div><b>{ex.rest}s</b><small>Descanso</small></div></div></section><div className="setPanel"><h3>Registrar série {completed+1} de {ex.sets}</h3><div className="formGrid"><label>Carga (kg)<input inputMode="decimal" value={current.weight} onChange={e=>setCurrent({...current,weight:e.target.value})} placeholder="Ex.: 20"/></label><label>Reps<input inputMode="numeric" value={current.reps} onChange={e=>setCurrent({...current,reps:e.target.value})} placeholder={String(ex.reps)}/></label></div><button className="primary full" onClick={addSet}><Save size={18}/> Salvar série</button><div className="setDots">{Array.from({length:ex.sets},(_,i)=><span className={i<completed?'done':''} key={i}>{i+1}</span>)}</div></div><RestTimer seconds={ex.rest}/><button className="secondary full" disabled={completed<ex.sets} onClick={()=>last?finish():setIndex(index+1)}>{last?'Finalizar treino':'Próximo exercício'} <ChevronRight/></button></main></>}

function Done({program,go}){return <main className="page done"><div className="doneIcon"><CheckCircle2 size={58}/></div><h1>Treino concluído!</h1><p>Você terminou o programa <b>{program.name}</b>.</p><div className="result"><div><b>{program.exercises.length}</b><span>Exercícios</span></div><div><b>{program.duration}</b><span>Duração</span></div></div><button className="primary full" onClick={()=>go('home')}>Voltar para Home</button><button className="secondary full" onClick={()=>go('history')}>Ver histórico</button></main>}

function HistoryScreen({history,go}){return <><Header title="Histórico" onBack={()=>go('home')}/><main className="page"><section className="metricGrid"><div><b>{history.length}</b><span>Treinos</span></div><div><b>{history.reduce((s,h)=>s+h.minutes,0)}</b><span>Minutos</span></div></section><div className="cards">{history.length===0?<div className="empty"><History size={36}/><b>Nenhum treino registrado</b><span>Conclua seu primeiro treino para ver aqui.</span></div>:history.map(h=><div className="historyCard" key={h.id}><div><b>{h.programName}</b><span>{new Date(h.date).toLocaleString('pt-BR')}</span></div><strong>{h.minutes} min</strong></div>)}</div><button className="secondary full" onClick={()=>go('evolution')}><TrendingUp/> Ver evolução</button></main></>}

function Evolution({history,go}){const totalSets=history.reduce((s,h)=>s+h.exercises.reduce((a,e)=>a+e.sets,0),0);return <><Header title="Evolução" onBack={()=>go('history')}/><main className="page"><section className="metricGrid"><div><b>{history.length}</b><span>Treinos</span></div><div><b>{totalSets}</b><span>Séries</span></div></section><div className="evolutionCard"><TrendingUp size={28}/><h2>Continue consistente</h2><p>Cada treino salvo aumenta sua base de evolução. O gráfico de cargas poderá ser conectado ao Firebase na próxima etapa.</p></div></main></>}

function Profile({profile,setProfile,go}){const [draft,setDraft]=useState(profile);const save=()=>{setProfile(draft);go('home')};return <><Header title="Perfil" onBack={()=>go('home')}/><main className="page"><div className="profileIcon"><User size={34}/></div><label>Nome<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Objetivo<select value={draft.goal} onChange={e=>setDraft({...draft,goal:e.target.value})}><option>Hipertrofia</option><option>Emagrecimento</option><option>Força</option><option>Condicionamento</option></select></label><label>Nível<select value={draft.level} onChange={e=>setDraft({...draft,level:e.target.value})}><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></label><button className="primary full" onClick={save}><Save/> Salvar perfil</button></main></>}

function BottomNav({active,go}){return <nav className="bottom"><button className={active==='home'?'active':''} onClick={()=>go('home')}><HomeIcon/><span>Home</span></button><button className={active==='programs'?'active':''} onClick={()=>go('programs')}><Dumbbell/><span>Programas</span></button><button className={active==='library'?'active':''} onClick={()=>go('library')}><Search/><span>Exercícios</span></button><button className={active==='custom'?'active':''} onClick={()=>go('custom')}><Save/><span>Meus treinos</span></button><button className={active==='profile'?'active':''} onClick={()=>go('profile')}><User/><span>Perfil</span></button></nav>

export default function App(){const [screen,setScreen]=useState('home');const [selected,setSelected]=useState(programs[0]);const {history,profile,setProfile,saveWorkout,customWorkouts,saveCustomWorkout,cloud}=useWorkoutStorage();const go=(next,data)=>{if(data)setSelected(data);setScreen(next)};if(screen==='home')return <Home go={go} history={history} profile={profile} cloud={cloud}/>;if(screen==='programs')return <Programs go={go}/>;if(screen==='library')return <Library go={go}/>;if(screen==='custom')return <CustomWorkouts go={go} customWorkouts={customWorkouts}/>;if(screen==='builder')return <Builder go={go} saveCustomWorkout={saveCustomWorkout}/>;if(screen==='customDetails')return <CustomDetails program={selected} go={go}/>;if(screen==='exercise')return <ExerciseDetails exercise={selected} go={go}/>;if(screen==='details')return <Details program={selected} go={go}/>;if(screen==='workout')return <Workout program={selected} go={go} saveWorkout={saveWorkout}/>;if(screen==='done')return <Done program={selected} go={go}/>;if(screen==='history')return <HistoryScreen history={history} go={go}/>;if(screen==='evolution')return <Evolution history={history} go={go}/>;return <Profile profile={profile} setProfile={setProfile} go={go}/>;}