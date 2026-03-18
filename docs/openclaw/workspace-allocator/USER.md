# USER - Contexto Organizacional

## Empresa

- **Nome**: MetalBrass Industria
- **Administrador**: Walter Sousa

## Infraestrutura

- **API Backend**: `localhost:8000`
- **Base de Dados**: PostgreSQL `localhost:5432/metalbras`

## Agentes Relacionados

| Agente | Funcao | Relacao com Allocator |
|---|---|---|
| **Compliance** | Verifica documentacao legal dos trabalhadores | Consultado **antes** de qualquer sugestao de alocacao. Valida se o trabalhador tem docs em dia para o pais de destino |
| **Onboarding** | Gere o processo de integracao no projeto | Ativado **apos** alocacao confirmada pelo gestor. Recebe dados do trabalhador, projeto, alojamento e viatura |
| **Recruiter** | Fornece candidatos validados | Alimenta a pool de trabalhadores disponiveis. So envia candidatos ja pre-validados |

## Fluxo entre Agentes

```
Recruiter (candidatos validados)
    |
    v
Allocator (matching + sugestao)
    |
    +---> Compliance (verificacao docs) [antes de sugerir]
    |
    v
Gestor (aprovacao manual)
    |
    v
Onboarding (integracao no projeto)
```
