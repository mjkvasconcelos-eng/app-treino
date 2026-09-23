import React, { useState } from 'react';
import { Home as HomeIcon, Dumbbell, ChevronRight, Play, CheckCircle2, ArrowLeft, Clock3 } from 'lucide-react';

const programs = [
  { id:'iniciante', name:'Comece Agora', level:'Iniciante', duration:'30 min', description:'Treino de corpo inteiro para começar com segurança.', exercises:[
    {name:'Agachamento livre', muscle:'Pernas', sets:3, reps:'12'},
    {name:'Supino', muscle:'Peito', sets:3, reps:'10'},
    {name:'Remada', muscle:'Costas', sets:3, reps:'12'},
    {name:'Desenvolvimento', muscle:'Ombros', sets:3, reps:'10'}
  ]},
  { id:'hipertrofia', name:'Hipertrofia', level:'Intermediário', duration:'45 min', description:'Rotina focada em volume e progressão de carga.', exercises:[
    {name:'Leg press', muscle:'Pernas', sets:4, reps:'10'},
    {name:'Supino inclinado', muscle:'Peito', sets:4, reps:'10'},
    {name:'Puxada frontal', muscle:'Costas', sets:4, reps:'10'},
    {name:'Rosca direta', muscle:'Bíceps', sets:3, reps:'12'}
  ]}
];

function Header({title,onBack}){return <header className="header">{onBack?<button className="iconBtn" onClick={onBack}><ArrowLeft size={22}/></button>:<div className="logoMark">AT</div>}<h1>{title}</h1><div style={{width:40}}/></header>}

function Home({go}){return <><Header title="App Treino"/><main className="page"><section className="hero"><span>SEU TREINO DE HOJE</span><h2>Pronto para evoluir?</h2><p>Escolha um programa e comece seu treino.</p><button className="primary" onClick={()=>go('programs')}>Ver programas <ChevronRight size={20}/></button></section><section><div className="sectionTitle"><h3>Acesso rápido</h3></div><div className="quickGrid"><button onClick={()=>go('programs')}><Dumbbell/><b>Programas</b><small>Escolha seu objetivo</small></button><button onClick={()=>go('programs')}><Clock3/><b>Treino do dia</b><small>Começar agora</small></button></div></section></main><BottomNav active="home" go={go}/></>}

function Programs({go}){return <><Header title="Programas" onBack={()=>go('home')}/><main className="page"><p className="muted">Selecione um programa para ver os exercícios.</p><div className="cards">{programs.map(p=><button className="programCard" key={p.id} onClick={()=>go('details',p)}><div className="programIcon"><Dumbbell size={24}/></div><div className="cardText"><h3>{p.name}</h3><span>{p.level} • {p.duration}</span><p>{p.description}</p></div><ChevronRight/></button>)}</div></main><BottomNav active="programs" go={go}/></>}

function Details({program,go}){return <><Header title={program.name} onBack={()=>go('programs')}/><main className="page"><section className="summary"><span>{program.level}</span><h2>{program.description}</h2><b>{program.exercises.length} exercícios • {program.duration}</b></section><h3>Exercícios</h3><div className="exerciseList">{program.exercises.map((e,i)=><div className="exerciseRow" key={e.name}><strong>{i+1}</strong><div><b>{e.name}</b><small>{e.muscle} • {e.sets} séries × {e.reps}</small></div></div>)}</div><button className="primary full" onClick={()=>go('workout',program)}><Play size={20}/> Começar treino</button></main></>}

function Workout({program,go}){const [index,setIndex]=useState(0); const ex=program.exercises[index]; const last=index===program.exercises.length-1; return <><Header title="Treino" onBack={()=>go('details',program)}/><main className="page"><div className="progressLabel"><span>Exercício {index+1} de {program.exercises.length}</span><b>{Math.round(((index+1)/program.exercises.length)*100)}%</b></div><div className="progress"><div style={{width:((index+1)/program.exercises.length)*100+'%'}}/></div><section className="workoutCard"><span>{ex.muscle}</span><h2>{ex.name}</h2><div className="stats"><div><b>{ex.sets}</b><small>Séries</small></div><div><b>{ex.reps}</b><small>Repetições</small></div><div><b>60s</b><small>Descanso</small></div></div></section><button className="primary full" onClick={()=>last?go('done',program):setIndex(index+1)}>{last?<><CheckCircle2/> Finalizar treino</>:<>Concluir exercício <ChevronRight/></>}</button></main></>}

function Done({program,go}){return <main className="page done"><div className="doneIcon"><CheckCircle2 size={58}/></div><h1>Treino concluído!</h1><p>Você terminou o programa <b>{program.name}</b>.</p><div className="result"><div><b>{program.exercises.length}</b><span>Exercícios</span></div><div><b>{program.duration}</b><span>Duração</span></div></div><button className="primary full" onClick={()=>go('home')}>Voltar para Home</button><button className="secondary full" onClick={()=>go('programs')}>Escolher outro programa</button></main>}

function BottomNav({active,go}){return <nav className="bottom"><button className={active==='home'?'active':''} onClick={()=>go('home')}><HomeIcon/><span>Home</span></button><button className={active==='programs'?'active':''} onClick={()=>go('programs')}><Dumbbell/><span>Programas</span></button></nav>}

export default function App(){const [screen,setScreen]=useState('home'); const [selected,setSelected]=useState(programs[0]); const go=(next,data)=>{if(data)setSelected(data);setScreen(next)}; if(screen==='home')return <Home go={go}/>; if(screen==='programs')return <Programs go={go}/>; if(screen==='details')return <Details program={selected} go={go}/>; if(screen==='workout')return <Workout program={selected} go={go}/>; return <Done program={selected} go={go}/>;}