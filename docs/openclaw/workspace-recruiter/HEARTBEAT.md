# Heartbeat Checklist

## A cada heartbeat (15min):

- Verificar mensagens WhatsApp nao respondidas de candidatos
  - Se candidato enviou mensagem ha mais de 5min sem resposta → responder agora
  - Se candidato enviou documento → confirmar rececao e processar
  - Se candidato esta em conversa ativa → continuar o fluxo de recolha

- Verificar status de documentos processados pelo doc-validator
  - Se documento foi aprovado → informar candidato "✅ [tipo] recebido e validado"
  - Se documento foi rejeitado → informar motivo e pedir novo envio

## A cada hora:

- Verificar candidatos com documentos incompletos ha mais de 24h
  - Enviar lembrete gentil: "Ola [nome]! So faltam [X] documentos para completar a sua candidatura: [lista]. Pode envia-los quando puder?"
  - Maximo 1 lembrete por dia por candidato

- Verificar candidatos que completaram todos os docs
  - Atualizar status para "data_received" na DB
  - Notificar equipa interna via WhatsApp admin

## Diariamente (9h):

- Gerar resumo diario:
  - Novos candidatos ontem: X
  - Candidaturas completas: X
  - Pendentes (docs incompletos): X
  - Abandonos: X
- Enviar resumo no WhatsApp para admin
- Atualizar MEMORY.md com estatisticas

## Semanalmente (segunda 9h):

- Relatorio semanal de recrutamento
- Top nacionalidades dos candidatos
- Funcoes mais procuradas
- Problemas recorrentes identificados
