export type WorkoutExercise={exerciseId:string;sets:number;reps:string;rest:number};
export type WorkoutDay={id:string;name:string;focus:string;exercises:WorkoutExercise[]};

export const exercises=[
{id:'agachamento',name:'Agachamento livre',muscle:'Pernas',sets:3,reps:'8–12',equipment:'Barra',level:'Iniciante',goal:'Força + hipertrofia',instructions:'Mantenha o peito aberto, desça com controle e empurre o chão para subir.'},
{id:'supino',name:'Supino reto',muscle:'Peito',sets:3,reps:'8–12',equipment:'Barra + banco',level:'Iniciante',goal:'Hipertrofia',instructions:'Escápulas apoiadas, pés firmes e barra descendo de forma controlada até o peito.'},
{id:'remada',name:'Remada baixa',muscle:'Costas',sets:3,reps:'8–12',equipment:'Cabo',level:'Iniciante',goal:'Hipertrofia',instructions:'Puxe o cabo em direção ao abdômen sem balançar o tronco e controle a volta.'},
{id:'desenvolvimento',name:'Desenvolvimento',muscle:'Ombros',sets:3,reps:'8–12',equipment:'Halteres',level:'Iniciante',goal:'Hipertrofia',instructions:'Mantenha o abdômen firme e empurre os halteres acima da cabeça sem exagerar na extensão.'},
{id:'puxada',name:'Puxada frontal',muscle:'Costas',sets:3,reps:'8–12',equipment:'Cabo',level:'Iniciante',goal:'Hipertrofia',instructions:'Puxe a barra em direção à parte superior do peito mantendo os ombros baixos.'},
{id:'stiff',name:'Stiff',muscle:'Posterior',sets:3,reps:'8–12',equipment:'Barra',level:'Intermediário',goal:'Força + hipertrofia',instructions:'Leve o quadril para trás, mantenha a coluna neutra e desça até sentir o posterior alongar.'},
{id:'leg-press',name:'Leg press 45°',muscle:'Pernas',sets:3,reps:'10–15',equipment:'Máquina',level:'Iniciante',goal:'Hipertrofia',instructions:'Desça com controle sem tirar o quadril do banco e empurre pela plataforma.'},
{id:'cadeira-extensora',name:'Cadeira extensora',muscle:'Quadríceps',sets:3,reps:'10–15',equipment:'Máquina',level:'Iniciante',goal:'Hipertrofia',instructions:'Estenda os joelhos de forma controlada e evite movimentos bruscos.'},
{id:'mesa-flexora',name:'Mesa flexora',muscle:'Posterior',sets:3,reps:'10–15',equipment:'Máquina',level:'Iniciante',goal:'Hipertrofia',instructions:'Flexione os joelhos controlando toda a amplitude e mantenha o quadril estável.'},
{id:'barra-fixa',name:'Barra fixa',muscle:'Costas',sets:3,reps:'6–10',equipment:'Barra fixa',level:'Intermediário',goal:'Força',instructions:'Inicie com o corpo estável e puxe até aproximar o peito da barra.'},
{id:'rosca-direta',name:'Rosca direta',muscle:'Bíceps',sets:3,reps:'8–12',equipment:'Barra',level:'Iniciante',goal:'Hipertrofia',instructions:'Mantenha os cotovelos próximos ao corpo e evite balançar o tronco.'},
{id:'triceps-pulley',name:'Tríceps na polia',muscle:'Tríceps',sets:3,reps:'10–15',equipment:'Cabo',level:'Iniciante',goal:'Hipertrofia',instructions:'Mantenha os cotovelos fixos e estenda os braços controlando o retorno.'},
{id:'elevacao-lateral',name:'Elevação lateral',muscle:'Ombros',sets:3,reps:'12–15',equipment:'Halteres',level:'Iniciante',goal:'Hipertrofia',instructions:'Eleve os braços lateralmente com controle, sem usar impulso do tronco.'},
{id:'abdominal-crunch',name:'Abdominal crunch',muscle:'Abdômen',sets:3,reps:'12–20',equipment:'Peso corporal',level:'Iniciante',goal:'Condicionamento',instructions:'Contraia o abdômen e eleve o tronco sem puxar a cabeça com as mãos.'}
];

export const plans=[
{id:'full-a',name:'Full Body A',frequency:'3x por semana',duration:'45–60 min',level:'Iniciante',goal:'Força + hipertrofia',days:[{id:'a',name:'Treino A',focus:'Corpo inteiro',exercises:[['agachamento',3,'8–12',120],['supino',3,'8–12',90],['remada',3,'8–12',90],['desenvolvimento',3,'8–12',75],['puxada',3,'8–12',75],['stiff',3,'8–12',120]]}]},
{id:'full-b',name:'Full Body B',frequency:'3x por semana',duration:'45–60 min',level:'Iniciante',goal:'Força + hipertrofia',days:[{id:'b',name:'Treino B',focus:'Corpo inteiro',exercises:[['leg-press',3,'10–15',120],['supino',3,'8–12',90],['puxada',3,'8–12',90],['mesa-flexora',3,'10–15',90],['elevacao-lateral',3,'12–15',60],['abdominal-crunch',3,'12–20',60]]}]},
{id:'abc',name:'ABC Hipertrofia',frequency:'3x por semana',duration:'50–70 min',level:'Intermediário',goal:'Hipertrofia',days:[
{id:'a',name:'A — Peito, Ombros e Tríceps',focus:'Push',exercises:[['supino',4,'6–10',120],['desenvolvimento',3,'8–12',90],['elevacao-lateral',3,'12–15',60],['triceps-pulley',3,'10–15',60]]},
{id:'b',name:'B — Costas e Bíceps',focus:'Pull',exercises:[['barra-fixa',3,'6–10',120],['remada',4,'8–12',90],['puxada',3,'8–12',90],['rosca-direta',3,'8–12',60]]},
{id:'c',name:'C — Pernas e Abdômen',focus:'Legs',exercises:[['agachamento',4,'6–10',120],['leg-press',3,'10–15',120],['stiff',3,'8–12',120],['cadeira-extensora',3,'10–15',60],['mesa-flexora',3,'10–15',60],['abdominal-crunch',3,'12–20',60]]}
]},
{id:'ppl',name:'Push / Pull / Legs',frequency:'3–6x por semana',duration:'50–75 min',level:'Intermediário',goal:'Hipertrofia + força',days:[
{id:'push',name:'Push — Empurrar',focus:'Peito, ombros e tríceps',exercises:[['supino',4,'6–10',120],['desenvolvimento',3,'8–12',90],['elevacao-lateral',3,'12–15',60],['triceps-pulley',3,'10–15',60]]},
{id:'pull',name:'Pull — Puxar',focus:'Costas e bíceps',exercises:[['barra-fixa',3,'6–10',120],['remada',4,'8–12',90],['puxada',3,'8–12',90],['rosca-direta',3,'8–12',60]]},
{id:'legs',name:'Legs — Pernas',focus:'Quadríceps, posterior e glúteos',exercises:[['agachamento',4,'6–10',120],['leg-press',3,'10–15',120],['stiff',3,'8–12',120],['cadeira-extensora',3,'10–15',60],['mesa-flexora',3,'10–15',60],['abdominal-crunch',3,'12–20',60]]}
]},
{id:'upper-lower',name:'Upper / Lower',frequency:'4x por semana',duration:'50–70 min',level:'Intermediário',goal:'Força + hipertrofia',days:[
{id:'upper-a',name:'Upper A',focus:'Parte superior',exercises:[['supino',4,'6–10',120],['remada',4,'8–12',90],['desenvolvimento',3,'8–12',90],['puxada',3,'8–12',90],['rosca-direta',3,'8–12',60],['triceps-pulley',3,'10–15',60]]},
{id:'lower-a',name:'Lower A',focus:'Pernas',exercises:[['agachamento',4,'6–10',120],['stiff',3,'8–12',120],['leg-press',3,'10–15',120],['mesa-flexora',3,'10–15',60],['abdominal-crunch',3,'12–20',60]]},
{id:'upper-b',name:'Upper B',focus:'Parte superior',exercises:[['barra-fixa',3,'6–10',120],['supino',3,'8–12',90],['remada',3,'8–12',90],['elevacao-lateral',3,'12–15',60],['rosca-direta',3,'8–12',60],['triceps-pulley',3,'10–15',60]]},
{id:'lower-b',name:'Lower B',focus:'Pernas',exercises:[['leg-press',4,'10–15',120],['agachamento',3,'8–12',120],['stiff',3,'8–12',120],['cadeira-extensora',3,'10–15',60],['mesa-flexora',3,'10–15',60],['abdominal-crunch',3,'12–20',60]]}
]}
];

export const workoutDays=(plan:any)=>plan.days.map(day=>({...day,exercises:day.exercises.map(([exerciseId,sets,reps,rest])=>({exerciseId,sets,reps,rest}))}));
