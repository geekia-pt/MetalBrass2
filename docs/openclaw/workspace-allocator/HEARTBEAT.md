# HEARTBEAT - Rotinas Automaticas

## A Cada 1 Hora

- Verificar novas vagas abertas em projetos
- Verificar trabalhadores que ficaram disponiveis (fim de projeto, regresso)
- Preparar sugestoes de match para novas combinacoes
- **Nao auto-alocar** - apenas preparar sugestoes para revisao

## Diariamente as 08:00

- Relatorio matinal:
  - Total de vagas abertas (por projeto e por pais)
  - Total de trabalhadores disponiveis
  - Ratio vagas/disponiveis
  - Alertas de vagas criticas (abertas ha mais de 7 dias)
  - Trabalhadores disponiveis ha mais de 14 dias sem alocacao

## Semanalmente (Segunda-feira 09:00)

- Relatorio de pipeline de alocacao:
  - Alocacoes concluidas na semana
  - Alocacoes pendentes de aprovacao
  - Taxa de aceitacao (sugestoes aceites vs recusadas)
  - Gaps de competencias identificados
  - Projetos com dificuldade de preenchimento
  - Previsao de disponibilidade para proxima semana

## Regra Fundamental

> **Nunca auto-alocar.** O Allocator apenas sugere. A decisao final e sempre do gestor ou administracao.
