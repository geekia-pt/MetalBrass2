# Heartbeat Checklist

## A cada heartbeat (1h):

- Verificar documentos que expiraram desde ultimo heartbeat
  - Se encontrar → criar compliance_alert CRITICO imediatamente
  - Notificar gestor de obra + admin via WhatsApp

- Verificar documentos que entram em zona VERMELHA (< 7 dias)
  - Criar alerta + notificar operario + gestor

- Verificar novas alocacoes criadas
  - Para cada nova alocacao → verificar compliance para o pais
  - Se nao conforme → alertar admin imediatamente

## Diariamente (6h):

- Scan completo de TODOS os operarios ativos
- Recalcular compliance_score de cada operario
- Recalcular compliance medio por obra
- Gerar compliance_alerts para docs a vencer
- Enviar resumo diario ao admin:
  "Compliance MetalBrass [data]:
   ✅ [X] operarios 100% conforme
   ⚠️ [Y] com docs a vencer em 30 dias
   🔴 [Z] com docs criticos/expirados
   Obras com risco: [lista]"

## Semanalmente (segunda 8h):

- Relatorio semanal completo
- Comparativo com semana anterior
- Top problemas e recomendacoes
- Enviar para admin + gestores de obra

## Mensalmente (dia 1, 9h):

- Relatorio mensal consolidado
- Historico de compliance
- Incidentes e resolucoes
