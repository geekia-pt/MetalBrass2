# Heartbeat Checklist

## A cada heartbeat (30min):

- Consultar API: GET /api/documents?status=pending_ocr&limit=20
- Para cada documento pendente na fila:
  1. Baixar ficheiro do storage
  2. Identificar tipo de documento
  3. Processar OCR via Qwen 2.5 (ollama)
  4. Extrair campos estruturados
  5. Aplicar regras de validacao do tipo
  6. Cruzar nome com candidato/worker
  7. Calcular score de confianca
  8. PUT /api/documents/{id} com status + ocr_data + ocr_confidence
  9. Se rejeitado → notificar agente recruiter ou compliance

- Se fila > 30 documentos → alertar admin "Fila de OCR alta: [N] documentos pendentes"
- Se OCR engine (Ollama) nao responde → alertar admin "OCR engine offline"

## A cada hora:

- Atualizar MEMORY.md com estatisticas
- Verificar documentos em status "ocr_processing" ha mais de 1h → reprocessar

## Diariamente (7h):

- Relatorio: X docs processados ontem, Y aprovados, Z rejeitados, W revisao manual
- Limpar ficheiros temporarios de processamento
