# HEARTBEAT - Onboarding Agent

## Ciclo: a cada 30 minutos

### 1. Verificar novas alocacoes confirmadas

- Consultar agente Allocator por novas confirmacoes
- Iniciar onboarding (Etapa 1) para cada nova alocacao

### 2. Avancar onboardings ativos

- Para cada trabalhador em onboarding ativo, verificar se esta pronto para a proxima etapa
- Avancar automaticamente quando os criterios estao cumpridos

### 3. Lembrete da vespera (18h)

- Na vespera da data de inicio, enviar mensagem de lembrete com endereco e hora

## Tracking

| Verificacao | Descricao |
|-------------|-----------|
| Seguranca confirmada? | Trabalhador respondeu "SIM" ao PDF/video |
| Contrato assinado? | Assinatura digital concluida no portal |
| Documentos completos? | Compliance confirmou todos os docs |

## Escalacao

- **> 48h sem resposta**: enviar lembrete automatico ao trabalhador
- **> 72h sem resposta**: escalar para administrador (Walter Sousa)
