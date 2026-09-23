function avg(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}

export function buildAthleteAnalysis(history,profile){
  const now=Date.now();
  const recent=history.filter(h=>now-new Date(h.date).getTime()<=30*86400000);
  const weekStart=now-7*86400000;
  const week=history.filter(h=>now-new Date(h.date).getTime()<=7*86400000);
  const previousWeek=history.filter(h=>{
    const age=now-new Date(h.date).getTime();
    return age>7*86400000&&age<=14*86400000;
  });

  const targetDays=Math.min(7,Math.max(2,Number(profile?.days)||3));
  const adherence=Math.min(100,Math.round((week.length/targetDays)*100));
  const previousAdherence=Math.min(100,Math.round((previousWeek.length/targetDays)*100));

  const exerciseMap={};
  history.forEach(workout=>(workout.exercises||[]).forEach(entry=>{
    const details=entry.details||[];
    if(!details.length)return;
    const date=new Date(workout.date).getTime();
    const maxWeight=Math.max(...details.map(x=>Number(x.weight)||0),0);
    const reps=avg(details.map(x=>Number(x.reps)||0));
    const rpe=avg(details.map(x=>Number(x.rpe)||7));
    if(!exerciseMap[entry.exerciseId])exerciseMap[entry.exerciseId]=[];
    exerciseMap[entry.exerciseId].push({date,maxWeight,reps,rpe,sets:details.length});
  }));

  const exercises=Object.entries(exerciseMap).map(([id,list])=>{
    const ordered=[...list].sort((a,b)=>a.date-b.date);
    const latest=ordered[ordered.length-1];
    const previous=ordered[ordered.length-2];
    const firstWeighted=ordered.find(x=>x.maxWeight>0);
    const change=previous&&latest.maxWeight>0&&previous.maxWeight>0
      ?((latest.maxWeight-previous.maxWeight)/previous.maxWeight)*100:0;
    const longChange=firstWeighted&&latest.maxWeight>0&&firstWeighted.maxWeight>0
      ?((latest.maxWeight-firstWeighted.maxWeight)/firstWeighted.maxWeight)*100:0;
    const stalled=ordered.length>=3&&Math.abs(longChange)<2;
    return {id,ordered,latest,previous,change:Number(change.toFixed(1)),longChange:Number(longChange.toFixed(1)),stalled};
  });

  const strong=[...exercises]
    .filter(x=>x.change>0||x.longChange>=5)
    .sort((a,b)=>Math.max(b.change,b.longChange)-Math.max(a.change,a.longChange))
    .slice(0,3);

  const stalled=[...exercises]
    .filter(x=>x.stalled)
    .sort((a,b)=>b.ordered.length-a.ordered.length)
    .slice(0,3);

  const totalSets=week.reduce((sum,w)=>sum+(w.exercises||[]).reduce((s,e)=>s+(e.sets||0),0),0);
  const avgRpe=avg(week.flatMap(w=>(w.exercises||[]).flatMap(e=>(e.details||[]).map(x=>Number(x.rpe)||0))));
  const volumeTrend=previousWeek.length?Math.round(((week.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0)-previousWeek.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0))/Math.max(1,previousWeek.reduce((s,w)=>s+(w.exercises||[]).reduce((x,e)=>x+(e.sets||0),0),0))*100):0;

  const recommendations=[];
  if(week.length<targetDays) recommendations.push({title:'Aumente a consistência',text:`Você registrou ${week.length} de ${targetDays} sessões. Planeje os dias da próxima semana antes de aumentar volume.`});
  else recommendations.push({title:'Mantenha a frequência',text:`Você completou ${week.length} de ${targetDays} sessões planejadas. Mantenha esse ritmo na próxima semana.`});
  if(avgRpe>=8.5) recommendations.push({title:'Controle a dificuldade',text:'A dificuldade média recente está alta. Na próxima semana, priorize técnica e evite aumentar carga automaticamente nas sessões mais difíceis.'});
  else if(avgRpe>0&&avgRpe<=7) recommendations.push({title:'Progrida gradualmente',text:'A dificuldade média ficou moderada. Quando completar todas as séries com boa técnica, use as sugestões de progressão do app.'});
  if(stalled.length) recommendations.push({title:'Quebre a estagnação',text:`${stalled.length} exercício(s) estão sem evolução clara de carga. Revise execução, amplitude, descanso e tente progredir primeiro nas repetições antes de subir a carga.`});
  if(volumeTrend>20) recommendations.push({title:'Evite saltos de volume',text:'O volume semanal aumentou bastante em relação à semana anterior. Prefira progressão gradual e observe a recuperação.'});
  if(!week.length) recommendations.push({title:'Comece pela regularidade',text:'Ainda não há sessões registradas nos últimos 7 dias. Faça o próximo treino e registre as séries para ativar recomendações mais precisas.'});

  return {recent,week,previousWeek,targetDays,adherence,previousAdherence,totalSets,avgRpe:Number(avgRpe.toFixed(1)),volumeTrend,strong,stalled,exercises,recommendations};
}
