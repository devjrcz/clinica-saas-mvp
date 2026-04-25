# SaaS Agenda de Clínicas

MVP para gerenciamento de clínicas pequenas no Brasil.

## Problemas Resolvidos

- Agenda manual (papel/WhatsApp)
- Falta de retorno de pacientes
- Controle financeiro básico
- Baixa organização

## Funcionalidades

- **Agenda Inteligente**: Visualização, cadastro de pacientes, marcação de consultas, status (pendente, confirmado, cancelado)
- **Confirmação via WhatsApp**: Simulação de envio automático
- **Cadastro de Pacientes**: Nome, telefone, histórico
- **Dashboard**: Métricas básicas

## Tecnologias

- Frontend: Next.js com TypeScript e Tailwind CSS
- Backend: Firebase (Auth, Firestore)

## Setup

1. Crie um projeto no Firebase Console.
2. Habilite Authentication e Firestore.
3. Atualize `src/lib/firebase.ts` com suas credenciais.
4. `npm install`
5. `npm run dev`

## Modelo de Negócio

- Plano mensal: R$49-99
- Teste grátis: 7 dias
- Multi-clínicas: Cada usuário tem seus dados isolados

## MVP Prioridades

- Agenda
- Confirmação automática (simulada)
- Cadastro de pacientes

## Próximos Passos

- Integração real com WhatsApp API
- Lembrete de retorno
- Controle financeiro
- Relatórios avançados
