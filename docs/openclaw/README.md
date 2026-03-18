# MetalBrass OS - OpenClaw Agents

## Visao Geral

7 agentes autonomos OpenClaw para automatizar toda a operacao da MetalBrass.
Cada agente tem workspace isolado com identidade, memoria e heartbeat proprios.

## Agentes

| # | Agente | Workspace | Heartbeat | Canal | Funcao |
|---|--------|-----------|-----------|-------|--------|
| 1 | Recrutador | workspace-recruiter | 15min | WhatsApp | Conversa com candidatos, recolhe docs |
| 2 | Validador Docs | workspace-doc-validator | 30min | Interno | OCR + validacao automatica |
| 3 | Compliance | workspace-compliance | 1h | WhatsApp (alertas) | Monitoriza validades |
| 4 | Alocador | workspace-allocator | 1h | Interno | Matching AI operarios↔obras |
| 5 | Onboarding | workspace-onboarding | 30min | WhatsApp | Guia novo operario ate 1o dia |
| 6 | Timesheet | workspace-timesheet | 30min | WhatsApp (lembretes) | Horas, GPS, overtime |
| 7 | Export | workspace-export | 2h | Interno | Primavera, ONSS, SS, Financas |

## Ficheiros por Agente

Cada workspace contem 6 ficheiros:

| Ficheiro | Funcao |
|----------|--------|
| SOUL.md | Personalidade, missao, valores, limites |
| IDENTITY.md | Nome, emoji, apresentacao, tom |
| USER.md | Info empresa, infraestrutura, contactos |
| AGENTS.md | Regras operacionais, fluxos, decisoes |
| MEMORY.md | Memoria persistente (atualizada pelo agente) |
| HEARTBEAT.md | Checklist autonoma executada periodicamente |

## Cron Jobs

| Job | Agente | Schedule | Descricao |
|-----|--------|----------|-----------|
| compliance-daily | compliance | 0 6 * * * | Scan diario 6h |
| recruiter-followup | recruiter | 0 9 * * * | Followup candidatos 9h |
| timesheet-reminder | timesheet | 0 20 * * 1-5 | Lembrete horas 20h |
| timesheet-weekly | timesheet | 0 18 * * 5 | Resumo semanal sexta |
| compliance-weekly | compliance | 0 8 * * 1 | Relatorio segunda |
| export-monthly | export | 0 8 1 * * | Exportacoes mensais |

## Deploy na VPS

1. Copiar workspaces para `~/.openclaw/`
2. Copiar `openclaw.json` para `~/.openclaw/openclaw.json`
3. Configurar WhatsApp: `openclaw setup whatsapp` → scan QR code
4. Configurar modelo: Kimi K2.5 via Moonshot API ou Ollama local
5. Iniciar: `openclaw start`
6. Verificar: `openclaw agents list`

## Fluxo entre Agentes

```
CANDIDATO (WhatsApp)
      |
      v
[1] RECRUTADOR ──doc──> [2] VALIDADOR DOCS
      |                        |
      | (candidato completo)   | (doc validado)
      v                        v
[3] COMPLIANCE <──────── DB (documentos)
      |
      | (compliance OK)
      v
[4] ALOCADOR ──match──> Gestor aprova
      |
      | (alocacao confirmada)
      v
[5] ONBOARDING ──────> Operario (WhatsApp)
      |
      | (em obra)
      v
[6] TIMESHEET ──────> Operario (lembretes)
      |
      | (fim do mes)
      v
[7] EXPORT ──────> Primavera / ONSS / SS / Financas
```
