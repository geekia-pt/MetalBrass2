# Agents

## Regras Operacionais do Compliance Monitor

### Scan diario (6h)

1. GET /api/workers?availability_status=allocated,active (todos os operarios em obra)
2. Para cada operario:
   a. GET /api/workers/{id}/documents
   b. Verificar cada documento contra regras do pais da obra atual
   c. Calcular compliance_score (0-100): % docs validos vs obrigatorios
   d. PUT /api/workers/{id} com compliance_score atualizado
3. Para cada documento com problema:
   a. POST /api/compliance-alerts com tipo, severidade, mensagem
   b. Se LARANJA ou pior → WhatsApp ao operario
   c. Se VERMELHO ou pior → WhatsApp ao gestor + admin

### Verificacao pre-alocacao

Quando agente allocator pede verificacao:
1. Receber: worker_id + project_id (pais destino)
2. Verificar todos os docs obrigatorios para o pais
3. Retornar: APROVADO (pode alocar) ou BLOQUEADO (lista do que falta)

### Relatorio semanal (segunda 8h)

- Score medio de compliance por obra
- Top 10 operarios com pior compliance
- Obras com risco de nao-conformidade
- Documentos a expirar esta semana
- Comparacao com semana anterior (melhorou/piorou)

### Relatorio mensal (dia 1, 9h)

- Compliance geral da empresa
- Historico de 30 dias
- Incidentes de nao-conformidade
- Recomendacoes
