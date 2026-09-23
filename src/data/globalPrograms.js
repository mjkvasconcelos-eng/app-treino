export const globalPrograms = [
  {id:'global-fullbody',name:'Full Body 3x/semana',goal:'Força + hipertrofia',level:'Iniciante',frequency:'3 dias/semana',duration:'35 min',source:'ACSM 2026',description:'Treino de corpo inteiro com frequência simples e sustentável.',exercises:[
    {id:'agachamento',name:'Agachamento livre',muscle:'Pernas',sets:3,reps:8,rest:90},
    {id:'supino',name:'Supino reto',muscle:'Peito',sets:3,reps:8,rest:90},
    {id:'remada',name:'Remada',muscle:'Costas',sets:3,reps:10,rest:90},
    {id:'desenvolvimento',name:'Desenvolvimento',muscle:'Ombros',sets:2,reps:10,rest:60}
  ]},
  {id:'global-hypertrophy',name:'Hipertrofia 4x/semana',goal:'Hipertrofia',level:'Intermediário',frequency:'4 dias/semana',duration:'50 min',source:'ACSM 2026',description:'Divisão para distribuir o volume e facilitar a progressão.',exercises:[
    {id:'agachamento',name:'Agachamento livre',muscle:'Pernas',sets:4,reps:8,rest:120},
    {id:'supinoinclinado',name:'Supino inclinado',muscle:'Peito',sets:3,reps:10,rest:90},
    {id:'puxada',name:'Puxada frontal',muscle:'Costas',sets:3,reps:10,rest:90},
    {id:'rosca',name:'Rosca direta',muscle:'Bíceps',sets:3,reps:12,rest:60},
    {id:'triceps',name:'Tríceps na polia',muscle:'Tríceps',sets:3,reps:12,rest:60}
  ]},
  {id:'global-strength',name:'Força 3x/semana',goal:'Força',level:'Intermediário',frequency:'3 dias/semana',duration:'40 min',source:'ACSM 2026',description:'Movimentos principais com foco em carga e execução consistente.',exercises:[
    {id:'agachamento',name:'Agachamento livre',muscle:'Pernas',sets:3,reps:5,rest:150},
    {id:'supino',name:'Supino reto',muscle:'Peito',sets:3,reps:5,rest:150},
    {id:'remada',name:'Remada',muscle:'Costas',sets:3,reps:6,rest:120},
    {id:'desenvolvimento',name:'Desenvolvimento',muscle:'Ombros',sets:2,reps:6,rest:120}
  ]},
  {id:'global-home',name:'Treino em casa',goal:'Condicionamento',level:'Iniciante',frequency:'3 dias/semana',duration:'25 min',source:'ACSM 2026',description:'Rotina prática usando principalmente peso corporal.',exercises:[
    {id:'agachamento',name:'Agachamento livre',muscle:'Pernas',sets:3,reps:12,rest:60},
    {id:'abdominal',name:'Abdominal curto',muscle:'Abdômen',sets:3,reps:12,rest:45},
    {id:'elevacao',name:'Elevação lateral',muscle:'Ombros',sets:3,reps:12,rest:60}
  ]}
];