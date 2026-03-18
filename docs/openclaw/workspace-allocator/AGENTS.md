# AGENTS - Regras Operacionais

## Modos de Operacao

### Modo 1: Por Projeto

> O projeto tem vagas abertas, encontrar trabalhadores compativeis.

1. Receber requisitos do projeto (competencias, pais, budget, datas)
2. Filtrar pool de trabalhadores disponiveis por competencias requeridas
3. Para cada candidato, chamar agente de **compliance** para verificar documentacao do pais de destino
4. Calcular score de match (competencias + custo + proximidade + historico)
5. Ordenar por score e apresentar **Top 5** ao gestor
6. Incluir para cada candidato: score, justificacao, alertas, alojamento sugerido, viatura

### Modo 2: Por Trabalhador

> Trabalhador disponivel, encontrar projetos compativeis.

1. Receber perfil do trabalhador (competencias, custo/hora, preferencias)
2. Filtrar projetos ativos com vagas abertas compativeis
3. Para cada projeto, chamar agente de **compliance** para verificar documentacao do pais
4. Calcular score de compatibilidade
5. Ordenar por score e apresentar **Top 5 projetos** ao gestor
6. Incluir para cada projeto: score, funcao sugerida, gap de competencias (se houver)

## Algoritmo de Matching

```
score = (skills_match * 0.40) + (cost_fit * 0.20) + (proximity * 0.15) + (history * 0.15) + (preference * 0.10)

Se compliance != 100%: candidato EXCLUIDO (bloqueante)
Se custo > budget + 10%: candidato EXCLUIDO
```

### Detalhes dos Componentes

- **skills_match**: % de competencias requeridas que o trabalhador possui. Competencias extra dao bonus de 5%
- **cost_fit**: Quao perto o custo/hora esta do budget. 100% = dentro do budget, decresce linearmente ate budget+10%
- **proximity**: Distancia do trabalhador ao projeto. Bonus se ja tem alojamento na zona
- **history**: Projetos similares anteriores + avaliacoes de desempenho
- **preference**: Preferencias declaradas do trabalhador (pais, tipo projeto, duracao)

## Pos-Aprovacao

Quando o gestor aprova uma alocacao:

1. **Atualizar status** do trabalhador para `allocated`
2. **Atribuir alojamento** - selecionar alojamento disponivel na zona do projeto
3. **Atribuir viatura** - se necessario (projeto isolado ou sem transportes)
4. **Trigger onboarding** - enviar dados ao agente de onboarding:
   - Trabalhador (ID, nome, contacto)
   - Projeto (ID, localizacao, datas)
   - Alojamento (endereco, check-in)
   - Viatura (matricula, tipo)
5. **Registar alocacao** na base de dados com timestamp e score

## Regras de Negocio

- Trabalhador so pode estar alocado a **1 projeto de cada vez**
- Alocacao minima: **2 semanas**
- Se trabalhador recusar, marcar como `declined` e sugerir proximo candidato do ranking
- Manter historico de todas as sugestoes (aceites e recusadas) para aprendizagem
