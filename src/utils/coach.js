import {exercises} from '../data/exercises';
import {buildAthleteAnalysis} from './athleteAnalysis';

function avg(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function roundWeight(v){return Number((Math.round(v*2)/2).toFixed(1))}

export function buildCoachPlan(history,profile){
  const analysis=buildAthleteAnalysis(history,profile);
  const goal=profile?.goal||'Hipertrofia';
  const level=profile?.level||'Iniciante';
  const days=Math.min(6,Math.max(2,Number(profile?.days)||3));
  const sourceExercises=analysis.exercises;
  const byId=Object.fromEntries(sourceExercises.map(x=>[x.id,x]));

  const templates=days<=3
    ?[['legs','chest','back','shoulders'],['legs','chest','back','core'],['legs','chest','back','shoulders']]
    :[['chest','shoulders','arms'],['legs','core'],['back','arms','shoulders'],['legs','chest','core'],['back','legs','arms'],['chest','back','legs','shoulders']];
  const groups={
    legs:['agachamento','legpress'],
    chest:['supino','supinoinclinado'],
    back:['remada','puxada'],
    shoulders:['desenvolvimento','elevacao'],
    arms:['rosca','triceps'],
    core:['abdominal']
  };
  const daysLabel=days===2?['Full Body A','Full Body B']:days===3?['Full Body A','Full Body B','Full Body C']:days===4?['Superior A','Inferior A','Superior B','Inferior B']:days===5?['Push','Pull','Legs','Upper','Lower']:['Push','Pull','Legs','Upper','Lower','Full Body'];

  const setsBase=level==='Iniciante'?2:level==='Intermediário'?3:4;
  const repsBase=goal==='Força'?(level==='Iniciante'?6:5):goal==='Hipertrofia'?10:goal==='Emagrecimento'?12:12;
  const restBase=goal==='Força'?150:goal==='Hipertrofia'?90:60;
  const highFatigue=analysis.avgRpe>=8.5;
  const volumeJump=analysis.volumeTrend>20;

  const used=new Set();
  const nextWeek=daysLabel.map((title,dayIndex)=>{
    const template=templates[dayIndex%templates.length];
    const items=[];
    template.forEach(group=>{
      const id=groups[group].find(x=>byId[x])||groups[group][0];
      if(used.has(id)&&group!=='core')return;
      used.add(id);
      const hist=byId[id];
      const base={id,name:exercises.find(x=>x.id===id)?.name||id,muscle:exercises.find(x=>x.id===id)?.group||'',sets:setsBase,reps:repsBase,rest:restBase,action:'manter',reason:'Sem histórico suficiente para justificar uma mudança.'};
      if(!hist){
        items.push({...base,reason:'Sem histórico deste exercício; começo conservador para criar uma linha de base.'});
        return;
      }
      const latest=hist.latest;
      const rpe=latest.rpe;
      const stalled=analysis.stalled.some(x=>x.id===id);
      let sets=base.sets;
      let reps=base.reps;
      let weight=latest.maxWeight||0;
      let action='manter';
      let reason='Desempenho recente estável; mantenha a carga e busque repetir a execução.';
      if(highFatigue||rpe>=9){
        action='reduzir';
        weight=weight?roundWeight(weight*0.95):0;
        sets=Math.max(2,sets-1);
        reason='RPE recente muito alto; reduzo levemente a carga/volume para controlar a fadiga e priorizar técnica.';
      }else if(stalled){
        action='manter';
        reps=Math.min(reps+1,15);
        reason='O exercício está estagnado; mantenho a carga e aumento a meta de repetições antes de subir o peso.';
      }else if(latest.reps>=repsBase&&latest.rpe<=7&&latest.sets>=setsBase){
        action='aumentar';
        weight=weight?roundWeight(weight*1.025):0;
        reason=weight?'Todas as séries recentes foram concluídas com RPE moderado; aumento a carga de forma gradual.':'As séries foram concluídas com RPE moderado; aumente gradualmente as repetições.';
      }else if(latest.reps<repsBase){
        action='manter';
        reason='A meta de repetições ainda não foi atingida; mantenha a carga até completar as séries com boa técnica.';
      }
      if(volumeJump&&action==='aumentar'){
        action='manter';
        weight=latest.maxWeight||0;
        reason='O volume da semana anterior subiu bastante; mantenho a carga para evitar aumentar duas variáveis ao mesmo tempo.';
      }
      items.push({...base,sets,reps,weight,action,reason});
    });
    return {day:dayIndex+1,title,exercises:items,duration:goal==='Força'?'40–55 min':goal==='Hipertrofia'?'45–60 min':'30–45 min'};
  });

  return {
    name:'Coach IA • Próxima semana',
    goal,level,days,nextWeek,
    summary:highFatigue?'O coach priorizou recuperação porque a dificuldade recente ficou alta.':volumeJump?'O coach segurou progressões porque o volume aumentou bastante na semana anterior.':'O coach combinou histórico de desempenho, RPE, consistência e estagnação para definir progressões graduais.',
    analysis
  };
}
