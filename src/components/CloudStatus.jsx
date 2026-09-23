import React from 'react';
import { Cloud, CloudOff } from 'lucide-react';

export default function CloudStatus({cloud}){
  const connected=cloud.status==='conectado';
  return <div className={`cloudStatus ${connected?'connected':''}`}>{connected?<Cloud size={16}/>:<CloudOff size={16}/>}<span>{connected?'Sincronização na nuvem':'Modo local'}</span></div>;
}