# Agents

## Regras de Validacao por Tipo de Documento

### Passaporte
- Formato: ISO/ICAO com MRZ (Machine Readable Zone)
- Campos obrigatorios: nome completo, nacionalidade, numero, data nascimento, validade
- Regra validade: expiracao > 6 meses a partir de hoje
- Verificacao: foto visivel, MRZ legivel, dados consistentes
- Paises comuns: PT, BR, UA, RO, FR, ES, PL

### Cartao Cidadao / BI
- Campos: nome, NIF, numero CC, validade, foto
- Regra: validade nao expirada
- Nota: so aplicavel a portugueses ou residentes

### Certificado A1
- Campos: nome trabalhador, numero, pais emissor, pais destino, periodo validade
- Regra CRITICA: pais emissor deve ser o pais de origem do trabalhador
- Regra CRITICA: pais destino deve corresponder ao pais da obra atribuida
- Regra: periodo deve cobrir a data de inicio prevista da alocacao
- Formato varia por pais emissor - aceitar variantes

### Seguro de Saude
- Campos: nome, numero apolice, seguradora, validade
- Regra: validade nao expirada
- Aceitar: seguro privado, CESD (Cartao Europeu Seguro Doenca), ou equivalente

### Certificado Aptidao Saude
- Campos: nome, resultado (apto/inapto), data exame, medico, entidade
- Regra: data do exame < 12 meses
- Rejeitar se resultado = "inapto" ou "condicionado"

### Diploma Seguranca Trabalho
- Campos: nome, formacao, entidade formadora, data, carga horaria
- Regra: validade nao expirada (geralmente 5 anos)
- Aceitar equivalentes internacionais

### Diploma Trabalho em Altura
- Campos: nome, certificacao, entidade, validade
- Regra: validade nao expirada
- Obrigatorio apenas para funcoes que envolvam trabalho em altura

### Certidao Criminal
- Campos: nome, resultado, data emissao, entidade
- Regra: data emissao < 6 meses
- Rejeitar se registo criminal relevante (crimes violentos, fraude)

### IBAN / Dados Bancarios
- Campos: titular, IBAN, banco
- Regra: titular deve corresponder ao nome do candidato
- Formato IBAN valido (verificar checksum)

### Foto 3x4
- Regra: rosto visivel, fundo neutro, qualidade minima aceitavel
- Nao e necessario OCR - apenas verificacao visual basica

## Fluxo de processamento

1. Receber documento (via API webhook ou heartbeat scan)
2. Identificar tipo de documento automaticamente
3. Executar OCR (Qwen 2.5)
4. Extrair campos relevantes
5. Aplicar regras de validacao do tipo
6. Cruzar nome com dados do candidato/worker
7. Calcular score de confianca
8. Decisao: aprovar / rejeitar / revisao manual
9. Atualizar DB via API
10. Notificar agente relevante (recruiter ou compliance)
