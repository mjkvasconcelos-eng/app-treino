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


export const preWorkoutQuestions=[
  {id:'sleep',title:'Como foi seu sono?',options:[
    {value:1,label:'Muito ruim',effect:'Reduzir carga e volume; priorizar técnica e recuperação.'},
    {value:2,label:'Ruim',effect:'Reduzir levemente a carga e manter mais descanso entre séries.'},
    {value:3,label:'Regular',effect:'Manter a sessão, sem progressão agressiva de carga.'},
    {value:4,label:'Bom',effect:'Manter o plano previsto.'},
    {value:5,label:'Muito bom',effect:'Sessão normal; progressão só se a execução e o esforço permitirem.'}
  ]},
  {id:'energy',title:'Como está sua energia agora?',options:[
    {value:1,label:'Muito baixa',effect:'Reduzir volume e carga; sessão mais curta.'},
    {value:2,label:'Baixa',effect:'Reduzir um pouco a carga e evitar progressão hoje.'},
    {value:3,label:'Normal',effect:'Seguir a sessão planejada.'},
    {value:4,label:'Boa',effect:'Seguir o plano e progredir apenas onde houver margem.'},
    {value:5,label:'Muito boa',effect:'Sessão normal; progressão gradual pode ser considerada.'}
  ]},
  {id:'soreness',title:'Como está a dor muscular pós-treino?',options:[
    {value:1,label:'Nenhuma',effect:'Sem ajuste por este fator.'},
    {value:2,label:'Leve',effect:'Manter a sessão; faça aquecimento e observe a resposta do corpo.'},
    {value:3,label:'Moderada',effect:'Reduzir volume e evitar aumentar carga no grupo muscular afetado.'},
    {value:4,label:'Forte',effect:'Reduzir bastante o estímulo ou priorizar recuperação; não forçar a região.'},
    {value:5,label:'Muito forte',effect:'Não insistir no treino da região; priorizar recuperação e avaliação se persistir.'}
  ]},
  {id:'recovery',title:'Como você avalia sua recuperação geral?',options:[
    {value:1,label:'Muito ruim',effect:'Sessão de recuperação: menor carga/volume e mais descanso.'},
    {value:2,label:'Ruim',effect:'Reduzir carga e volume e aumentar os intervalos.'},
    {value:3,label:'Regular',effect:'Manter o treino sem progressão agressiva.'},
    {value:4,label:'Boa',effect:'Seguir o planejamento.'},
    {value:5,label:'Excelente',effect:'Seguir o planejamento; progressão gradual somente com boa técnica.'}
  ]},
  {id:'pain',title:'Você sente dor aguda ou incomum durante algum movimento?',options:[
    {value:0,label:'Não',effect:'Sem bloqueio de segurança por dor.'},
    {value:1,label:'Leve',effect:'Não forçar o movimento; reduzir carga/amplitude e observar a resposta.'},
    {value:2,label:'Moderada',effect:'Não executar o movimento doloroso; considerar substituição e orientação profissional.'},
    {value:3,label:'Forte',effect:'Interromper a sessão e procurar avaliação profissional, especialmente se a dor for intensa ou preocupante.'}
  ]}
];

export function buildPreWorkoutAdjustment(answers={},session){
  const sleep=Number(answers.sleep)||3;
  const energy=Number(answers.energy)||3;
  const soreness=Number(answers.soreness)||1;
  const recovery=Number(answers.recovery)||3;
  const pain=Number(answers.pain)||0;
  if(pain>=3)return {status:'pausar',score:0,loadMultiplier:0,setsMultiplier:0,restMultiplier:1,title:'Treino pausado por segurança',summary:'A resposta indica dor forte ou preocupante. O app não tenta diagnosticar a causa; interrompa a sessão e procure avaliação profissional.',session:null,details:{pain:preWorkoutQuestions[4].options[3].effect}};
  const score=Math.round(((sleep/5)*20)+((energy/5)*30)+(((6-soreness)/5)*20)+((recovery/5)*30));
  let loadMultiplier=1,setsMultiplier=1,restMultiplier=1,status='normal',title='Pronto para treinar',summary='Mantenha a sessão planejada e ajuste apenas se a execução ou o esforço indicarem necessidade.';
  if(pain===2||score<55){status='recuperacao';loadMultiplier=.85;setsMultiplier=.75;restMultiplier=1.3;title='Sessão de recuperação';summary='Hoje o coach reduz o estímulo para controlar fadiga e preservar a qualidade do treino.'}
  else if(pain===1||score<70){status='moderado';loadMultiplier=.95;setsMultiplier=.85;restMultiplier=1.2;title='Treino com autorregulação';summary='O coach reduz levemente o estímulo e aumenta o descanso. Evite progressão de carga hoje.'}
  else if(score<82){status='controlado';loadMultiplier=.98;setsMultiplier=1;restMultiplier=1.1;title='Treino controlado';summary='A sessão segue o plano, mas com margem extra de recuperação e sem progressão agressiva.'}
  const session=Array.isArray(session?.exercises)?{...session,exercises:session.exercises.map(e=>{const baseWeight=Number(e.weight)||0;const sets=Math.max(1,Math.round((Number(e.sets)||1)*setsMultiplier));const weight=baseWeight?roundWeight(baseWeight*loadMultiplier):0;const rest=Math.round((Number(e.rest)||60)*restMultiplier);return {...e,sets,weight,rest,action:status==='normal'?e.action:'reduzir'}})}:null;
  return {status,score,loadMultiplier,setsMultiplier,restMultiplier,title,summary,session,details:{
    sleep:preWorkoutQuestions[0].options.find(x=>x.value===sleep)?.effect,
    energy:preWorkoutQuestions[1].options.find(x=>x.value===energy)?.effect,
    soreness:preWorkoutQuestions[2].options.find(x=>x.value===soreness)?.effect,
    recovery:preWorkoutQuestions[3].options.find(x=>x.value===recovery)?.effect,
    pain:preWorkoutQuestions[4].options.find(x=>x.value===pain)?.effect
  }};
}
