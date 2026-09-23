import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

type State = { hasError: boolean; message: string };

class AppErrorBoundary extends Component<{children: ReactNode}, State> {
  state: State = { hasError: false, message: '' };
  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : 'Erro inesperado ao carregar o aplicativo.' };
  }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('App Treino render error:', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,fontFamily:'system-ui'}}>
        <section style={{maxWidth:520,width:'100%',padding:24,borderRadius:20,background:'#171a1f',color:'#fff'}}>
          <p style={{fontWeight:700,letterSpacing:1}}>APP TREINO</p>
          <h1>Não foi possível carregar o aplicativo.</h1>
          <p style={{opacity:.8}}>Atualize a página. Se o erro continuar, envie esta mensagem para diagnóstico:</p>
          <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-word',fontSize:13,background:'#0d0f12',padding:12,borderRadius:12}}>{this.state.message}</pre>
          <button onClick={()=>window.location.reload()} style={{marginTop:16,padding:'12px 18px',border:0,borderRadius:12,fontWeight:700,cursor:'pointer'}}>Tentar novamente</button>
        </section>
      </main>
    );
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado.');
createRoot(root).render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>);
