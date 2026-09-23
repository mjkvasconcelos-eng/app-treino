type Props={exerciseId:string};

type Pose={start:string[];end:string[];accent:string;muscles:string[]};

const poses:Record<string,Pose>={
  agachamento:{start:['M40 35 L40 68 L27 92','M40 68 L60 68 L73 92','M40 45 L25 30','M40 45 L55 30'],end:['M40 35 L35 60 L24 88','M35 60 L58 60 L76 82','M40 45 L25 32','M40 45 L55 32'],accent:'Pernas',muscles:['Quadríceps','Glúteos','Posterior']},
  supino:{start:['M25 72 L55 62 L82 72','M55 62 L55 40','M55 40 L42 28','M55 40 L68 28'],end:['M25 72 L55 72 L82 72','M55 72 L55 45','M55 45 L40 32','M55 45 L70 32'],accent:'Peito',muscles:['Peitoral','Tríceps','Ombros']},
  remada:{start:['M32 48 L62 62 L76 88','M62 62 L42 82','M45 38 L25 60','M45 38 L68 48'],end:['M38 42 L58 58 L75 88','M58 58 L38 82','M43 34 L22 52','M43 34 L62 42'],accent:'Costas',muscles:['Dorsais','Romboides','Bíceps']},
  desenvolvimento:{start:['M45 38 L45 75 L30 92','M45 75 L62 92','M45 48 L28 28','M45 48 L62 28'],end:['M45 38 L45 75 L30 92','M45 75 L62 92','M45 48 L25 18','M45 48 L65 18'],accent:'Ombros',muscles:['Deltoides','Tríceps','Trapézio']},
  puxada:{start:['M42 38 L42 72 L30 92','M42 72 L58 92','M42 48 L25 65','M42 48 L60 65'],end:['M42 38 L42 72 L30 92','M42 72 L58 92','M42 48 L34 55','M42 48 L50 55'],accent:'Costas',muscles:['Dorsais','Bíceps','Romboides']},
  stiff:{start:['M42 38 L55 62 L75 88','M55 62 L35 88','M42 48 L24 60','M42 48 L60 58'],end:['M42 38 L48 60 L70 88','M48 60 L30 88','M42 48 L24 58','M42 48 L58 54'],accent:'Posterior',muscles:['Posterior de coxa','Glúteos','Lombar']},
  'leg-press':{start:['M38 42 L58 58 L38 76','M58 58 L78 72','M38 76 L28 90','M38 76 L58 90'],end:['M38 42 L58 58 L40 76','M58 58 L88 52','M40 76 L28 90','M40 76 L58 90'],accent:'Pernas',muscles:['Quadríceps','Glúteos','Posterior']},
  'cadeira-extensora':{start:['M38 40 L38 68 L58 70','M38 68 L22 88','M58 70 L76 84','M38 50 L22 42'],end:['M38 40 L38 68 L60 68','M38 68 L22 88','M60 68 L86 62','M38 50 L22 42'],accent:'Quadríceps',muscles:['Quadríceps']},
  'mesa-flexora':{start:['M25 58 L58 58 L75 72','M58 58 L40 82','M40 82 L28 92','M40 82 L55 92'],end:['M25 58 L58 58 L75 72','M58 58 L45 76','M45 76 L30 90','M45 76 L58 84'],accent:'Posterior',muscles:['Posterior de coxa','Panturrilhas','Glúteos']},
  'barra-fixa':{start:['M45 38 L45 68 L28 90','M45 68 L62 90','M45 48 L27 60','M45 48 L64 60'],end:['M45 38 L45 55 L28 78','M45 55 L62 78','M45 45 L30 52','M45 45 L60 52'],accent:'Costas',muscles:['Dorsais','Bíceps','Antebraços']},
  'rosca-direta':{start:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L27 66','M45 48 L63 66'],end:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L38 58','M45 48 L52 58'],accent:'Bíceps',muscles:['Bíceps','Braquiorradial']},
  'triceps-pulley':{start:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L30 62','M45 48 L60 62'],end:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L30 78','M45 48 L60 78'],accent:'Tríceps',muscles:['Tríceps','Peitoral']},
  'elevacao-lateral':{start:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L38 62','M45 48 L52 62'],end:['M45 38 L45 70 L30 92','M45 70 L60 92','M45 48 L20 42','M45 48 L70 42'],accent:'Ombros',muscles:['Deltoide lateral','Trapézio']},
  'abdominal-crunch':{start:['M45 45 L60 58 L72 82','M60 58 L35 80','M35 80 L25 92','M35 80 L50 92'],end:['M45 45 L52 58 L70 82','M52 58 L35 80','M35 80 L25 92','M35 80 L50 92'],accent:'Abdômen',muscles:['Reto abdominal','Oblíquos']}
};

export function ExerciseFigure({exerciseId}:Props){
 const p=poses[exerciseId]??poses.agachamento;
 const line=(d:string,i:number)=><path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>;
 const figure=(paths:string[],label:string,step:string)=><div className="figure-step"><div className="figure-step-label"><span>{step}</span><small>{label}</small></div><svg viewBox="0 0 100 110" aria-label={label}><circle cx="45" cy="24" r="9" fill="currentColor"/>{paths.map(line)}</svg></div>;
 return <div className="exercise-figure">
   <div className="figure-title"><div><span className="figure-kicker">GUIA VISUAL</span><b>Como fazer</b></div><span className="figure-muscle-tag">{p.accent}</span></div>
   <div className="figure-steps">{figure(p.start,'Posição inicial','01')}<div className="figure-arrow">→</div>{figure(p.end,'Movimento','02')}</div>
   <div className="muscles-worked"><span className="muscles-label">MÚSCULOS TRABALHADOS</span><div>{p.muscles.map((m,i)=><span key={m} className={i===0?'primary-muscle':''}>{m}</span>)}</div></div>
   <p>Movimento controlado, postura estável e amplitude confortável.</p>
 </div>;
}
