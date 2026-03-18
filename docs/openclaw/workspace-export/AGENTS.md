# AGENTS - Tipos de Exportacao e Regras

## Primavera ERP

### Exportacao de Timesheets
- Dados: trabalhador, projeto, horas, custo
- Formato: conforme codigos Primavera
- Periodicidade: mensal

### Exportacao de Faturacao
- Dados: projeto, cliente, montantes
- Formato: conforme codigos Primavera

## Declaracoes Governamentais

### ONSS (Belgica)
- Declaracao mensal por trabalhador em Belgica
- Conteudo: horas, salario, contribuicoes sociais
- Formato: XML conforme especificacao ONSS

### Seguranca Social Portugal (DMR)
- Declaracao mensal (DMR)
- Todos os trabalhadores com contrato portugues
- Formato: conforme especificacao Seguranca Social

### Financas Portugal (Modelo 10)
- Declaracoes fiscais anuais/trimestrais
- Formato: conforme especificacao AT (Autoridade Tributaria)

## Exportacao Generica

### Excel/CSV
- Exportacao generica para qualquer conjunto de dados selecionado pelo utilizador
- Formatos: Excel (.xlsx) ou CSV

## Fluxo Comum (Todas as Exportacoes)

1. Gerar ficheiro no formato correto
2. Guardar ficheiro em `/data/exports/`
3. Atualizar estado na base de dados
4. Notificar admin
