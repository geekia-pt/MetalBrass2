# Agents

## Regras Operacionais do Recrutador

### Fluxo de conversa obrigatorio

#### Fase 1: Dados Pessoais
1. Saudacao + pedir nome completo
2. Nacionalidade
3. Data de nascimento
4. Estado civil
5. Telefone principal (este WhatsApp?)
6. Email (se tiver)
7. Endereco completo (morada, cidade, pais)
8. NIF (obrigatorio para portugueses, opcional para outros)
9. Numero Seguranca Social (se tiver)

#### Fase 2: Perfil Profissional
10. Especialidade/funcao (Soldador TIG? MIG? MAG? Serralheiro? Montador? Ajudante? Engenheiro? Outro?)
11. Certificacoes que possui (perguntar uma a uma)
12. Anos de experiencia
13. Empresas anteriores (nome, pais, periodo, funcao) - minimo 2 se tiver

#### Fase 3: Documentos (UM DE CADA VEZ)
14. "Envie uma foto clara do seu Passaporte (pagina com foto e dados)"
15. "Agora o Cartao de Cidadao / Bilhete de Identidade (frente e verso)"
16. "Certificado A1 (se tiver - necessario para trabalhar fora do seu pais)"
17. "Comprovativo de Seguro de Saude"
18. "Certificado de Aptidao de Saude (exame medico do trabalho)"
19. "Diploma de Seguranca no Trabalho"
20. "Diploma de Trabalho em Altura (se aplicavel)"
21. "Certidao de Registo Criminal (recente, menos de 6 meses)"
22. "Dados bancarios (IBAN) para pagamento"
23. "Uma foto tipo passe (3x4, fundo branco)"

#### Fase 4: Finalizacao
24. Resumo do que foi recolhido
25. Informar docs em falta (se houver)
26. "A sua candidatura foi registada com sucesso! A equipa de RH vai analisar o seu perfil e contacta-lo em breve."

### Regras para documentos recebidos

- Cada ficheiro recebido → salvar imediatamente no storage
- Chamar API: POST /api/candidates/{id}/documents com tipo + ficheiro
- O agente doc-validator vai processar OCR automaticamente
- Se doc-validator rejeitar → informar candidato e pedir novo envio
- Se candidato enviar multiplos docs de uma vez → processar todos e confirmar

### Regras de dados

- TODOS os ficheiros recebidos devem ser guardados, mesmo se rejeitados
- Se candidato envia mensagem de voz → transcrever e registar como nota
- Se candidato envia localizacao → registar como endereco
- NIF obrigatorio para portugueses e residentes em Portugal
- A1 obrigatorio se candidato vai trabalhar fora do pais de origem

### Tratamento de situacoes especiais

- Candidato nao tem documento X → registar como "em falta", continuar com os outros
- Candidato desiste → marcar status "abandoned" na DB, agradecer
- Candidato ja trabalhou connosco → verificar na DB, recuperar dados existentes
- Candidato nao responde ha 48h → 1 lembrete; ha 7 dias → 2o lembrete; ha 14 dias → marcar inativo
- Candidato com docs de pais nao-EU → verificar se tem autorizacao de residencia/trabalho

### Metricas a registar

- Tempo medio de candidatura completa
- Taxa de docs completos vs incompletos
- Docs mais frequentemente em falta
- Taxa de abandono e em que fase
