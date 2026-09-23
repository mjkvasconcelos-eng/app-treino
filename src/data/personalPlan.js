const baseExercises={
  legs:[{id:'agachamento',name:'Agachamento livre',muscle:'Pernas'},{id:'legpress',name:'Leg press',muscle:'Pernas'}],
  chest:[{id:'supino',name:'Supino reto',muscle:'Peito'},{id:'supinoinclinado',name:'Supino inclinado',muscle:'Peito'}],
  back:[{id:'remada',name:'Remada',muscle:'Costas'},{id:'puxada',name:'Puxada frontal',muscle:'Costas'}],
  shoulders:[{id:'desenvolvimento',name:'Desenvolvimento',muscle:'Ombros'},{id:'elevacao',name:'Elevação lateral',muscle:'Ombros'}],
  arms:[{id:'rosca',name:'Rosca direta',muscle:'Bíceps'},{id:'triceps',name:'Tríceps na polia',muscle:'Tríceps'}],
  core:[{id:'abdominal',name:'Abdominal curto',muscle:'Abdômen'}]
};
const homeFallback={legs:baseExercises.legs[0],chest:baseExercises.chest[0],back:baseExercises.back[0],shoulders:baseExercises.shoulders[1],arms:baseExercises.arms[0],core:baseExercises.core[0]};
function allowed(item,equipment){const list=equipment||[];if(list.includes('Academia'))return true;const e=list.map(x=>x.toLowerCase());const id=item.id;if(e.includes('peso corporal'))return id==='abdominal';if(e.includes('halteres'))return ['desenvolvimento','elevacao','rosca','remada','supinoinclinado'].includes(id);if(e.includes('barra'))return ['agachamento','supino','rosca'].includes(id);if(e.includes('cabos'))return ['puxada','triceps'].includes(id);if(e.includes('máquinas'))return id==='legpress';return false;}
function pick(group,equipment){const found=baseExercises[group].find(x=>allowed(x,equipment));return found||homeFallback[group]||baseExercises[group][0]}
function makeExercise(group,equipment,sets,reps,rest){const x=pick(group,equipment);return {...x,sets,reps,rest}}
export function buildPersonalPlan(input){
  const goal=input.goal||'Hipertrofia'; const level=input.level||'Iniciante'; const days=Math.min(6,Math.max(2,Number(input.days)||3)); const age=Number(input.age)||30; const imc=Number(input.imc)||0;
  let sets=level==='Iniciante'?2:level==='Intermediário'?3:4;
  let reps=goal==='Força'?(level==='Iniciante'?6:5):goal==='Hipertrofia'?10:goal==='Emagrecimento'?12:12;
  let rest=goal==='Força'?150:goal==='Hipertrofia'?90:60;
  if(age>=60){sets=Math.max(2,sets-1);rest+=30}
  const labels=days===2?['Full Body A','Full Body B']:days===3?['Full Body A','Full Body B','Full Body C']:days===4?['Superior A','Inferior A','Superior B','Inferior B']:days===5?['Push','Pull','Legs','Upper','Lower']:['Push','Pull','Legs','Upper','Lower','Full Body'];
  const templates=days<=3?[['legs','chest','back','shoulders'],['legs','chest','back','core'],['legs','chest','back','shoulders']]:[['chest','shoulders','arms'],['legs','core'],['back','arms','shoulders'],['legs','chest','core'],['back','legs','arms'],['chest','back','legs','shoulders']];
  const week=labels.map((title,i)=>{const groups=templates[i%templates.length];const exercises=groups.map((g,j)=>makeExercise(g,input.equipment,sets-(j>1&&level==='Iniciante'?1:0),reps,rest));return {day:i+1,title,duration:goal==='Força'?'40–55 min':goal==='Hipertrofia'?'45–60 min':'30–45 min',exercises}});
  const imcNote=imc>=30?'volume inicial moderado para facilitar adaptação e consistência':imc>0&&imc<18.5?'volume conservador, priorizando recuperação e progressão': 'volume ajustado ao nível informado';
  return {name:'Plano '+goal,goal,level,days,summary:`Rotina gerada para ${days} dias/semana, com ${imcNote}. Idade e equipamentos entram como ajustes de segurança e disponibilidade.`,week};
}