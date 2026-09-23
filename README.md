# App Treino

Aplicativo mobile-first para organizar treinos de academia, registrar exercícios e acompanhar evolução.

## V1
- Treino do dia
- Planos de treino
- Exercícios por grupo muscular
- Registro preparado para séries/repetições/carga
- Progresso
- Perfil
- Estrutura preparada para evolução com Firebase

## Executar
```bash
npm install
npm run dev
```

## V2 já implementada
- Cronômetro de descanso
- Registro de carga e repetições
- Séries concluídas
- Histórico e evolução
- Perfil
- Persistência local

## V3 - sincronização Firebase
- Sincronização opcional com Firestore
- Autenticação anônima para identificar o dispositivo/usuário
- Perfil e histórico salvos na nuvem quando Firebase estiver configurado
- O app continua funcionando em modo local quando as variáveis Firebase não estão configuradas

### Configurar Firebase
1. Crie um projeto no Firebase.
2. Ative Authentication > Sign-in method > Anonymous.
3. Crie/ative o Firestore Database.
4. Copie `.env.example` para `.env.local`.
5. Preencha as variáveis `VITE_FIREBASE_*` com a configuração do seu app Web.
6. Execute `npm install` e `npm run dev`.

Nunca coloque credenciais administrativas ou chaves privadas no frontend. As variáveis `VITE_*` são configurações públicas do app Web; a segurança dos dados deve ser feita pelas regras do Firestore.

## V4 - biblioteca de exercícios
- Biblioteca com exercícios organizados por grupo muscular
- Busca por nome
- Filtros por grupo muscular
- Tela de detalhes com equipamento, nível, descrição, execução e dicas

## V5 - montador de treino personalizado
- Criar treinos próprios
- Adicionar e remover exercícios da biblioteca
- Definir séries, repetições e descanso por exercício
- Salvar treinos personalizados localmente e, com Firebase configurado, na nuvem
- Abrir o treino salvo e iniciar o mesmo fluxo de registro de séries da V2

## V6 - experiência mais profissional
- Calculadora de IMC no perfil, com altura e peso salvos
- Biblioteca de treinos globais por objetivo, frequência e nível
- Curadoria baseada nas recomendações de treinamento de resistência da ACSM 2026
- Avisos de que IMC é uma medida de triagem e não diagnóstico
- Tela de descoberta de treinos e detalhes da estrutura

## Próximas versões
Autenticação por e-mail/Google, biblioteca de exercícios com vídeos, planos por objetivo, gráficos de carga e publicação mobile.