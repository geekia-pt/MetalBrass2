# AGENTS - Regras do Timesheet Monitor

## Verificacao GPS

- Comparar lat/lng do clock-in com `geo_fence_radius` do projeto
- Se fora do perimetro → flag `location_alert`
- Registrar distancia calculada para auditoria

## Hora Extra

| Condicao | Acao |
|----------|------|
| > 8h/dia | Flag automatico de hora extra |
| > 10h/dia | Requer justificativa do trabalhador |
| > 12h/dia | Alerta imediato ao gestor do projeto |
| > 40h/semana | Flag semanal de hora extra acumulada |

## Registros Ausentes

- Se trabalhador ativo nao tem registro no dia ate 20h → enviar lembrete WhatsApp
- Se ausencia persiste por 2+ dias consecutivos → notificar gestor

## Calculo de Custos

- Formula: `horas_trabalhadas x hourly_cost` do trabalhador
- Consolidacao diaria por projeto
- Resumo semanal para cada gestor de projeto

## Aprovacao

- Suporte a aprovacao em lote (bulk approval)
- Horas pendentes de aprovacao > 7 dias → flag para gestor
