# PROJECT_CONTRACTS.md - CONTRATOS E DECISÕES IMUTÁVEIS
<!-- APPEND ONLY - NUNCA EDITAR OU DELETAR LINHAS ANTERIORES -->

## 🔒 DECISÕES DE ARQUITETURA
| ID | Data | Decisão | Motivo | Impacto | Autor |
|----|------|---------|---------|---------|--------|
| A001 | 14/09/2025 14:59 | Next.js 14 com App Router | Melhor DX e performance | Todo o projeto | GP |
| A002 | 14/09/2025 14:59 | TypeScript obrigatório | Type safety e manutenibilidade | Todo código | GP |
| A003 | 14/09/2025 14:59 | Tailwind CSS v3 (NÃO v4) | Estabilidade | Todos os estilos | GP |
| A004 | 14/09/2025 14:59 | Supabase para backend | All-in-one solution | Database + Auth | GP |
| A005 | 14/09/2025 14:59 | Mobile First obrigatório | 90% acesso mobile | Todo desenvolvimento | Product Owner |
| A006 | 14/09/2025 14:59 | Vercel para deploy | Integração com Next.js | Hosting | GP |

## 🔒 DECISÕES DE NEGÓCIO
| ID | Data | Decisão | Motivo | Impacto | Autor |
|----|------|---------|---------|---------|--------|
| B001 | 14/09/2025 14:59 | R$ 49,90 basic / R$ 99,90 premium | Precificação competitiva | Modelo de receita | Product Owner |
| B002 | 14/09/2025 14:59 | 5 cupons basic / 10 premium | Limitar uso | Sistema de cupons | Product Owner |
| B003 | 14/09/2025 14:59 | PIX manual na fase 1 | Simplicidade | Processo de pagamento | Product Owner |
| B004 | 14/09/2025 14:59 | Sem dados pessoais visíveis | Privacidade | Todo o sistema | Product Owner |
| B005 | 14/09/2025 14:59 | WhatsApp obrigatório | Canal principal | Comunicação | Product Owner |
| B006 | 14/09/2025 14:59 | Free para consumidor final | Adoção | Modelo de negócio | Product Owner |

## 🔒 PADRÕES DE CÓDIGO FIXOS
| ID | Padrão | Exemplo | Aplicar Em |
|----|---------|---------|------------|
| P001 | Mobile first sempre | `className="w-full md:w-1/2"` | Todos componentes |
| P002 | Componentes funcionais | `export default function Component()` | Todos componentes |
| P003 | Types explícitos | `interface Props { name: string }` | Todo código |
| P004 | Soft delete | `deleted_at timestamp` | Todas tabelas |
| P005 | Validação obrigatória | Gerente valida 1 por 1 todas entregas | Todas tarefas |
| P006 | Checklist numerado | Especialista segue lista exata | Todas implementações |
| P007 | 14/09/2025 17:00 | Design obrigatório antes de código | Evitar retrabalho e erros de UI | Todo desenvolvimento visual | Product Owner + GP |
| P008 | 14/09/2025 17:00 | Gates de Qualidade em 3 fases | Garantir qualidade em cada etapa | Todo o processo | Product Owner + GP |
| P009 | 14/09/2025 17:00 | Workflow multifuncional | Reduzir erros com validação cruzada | Toda a equipe | Product Owner + GP |
| P010 | 14/09/2025 17:35 | Verde ajustado para #7CB342 | Conformidade WCAG AA (contraste 3.02:1) | Todos os componentes | Accessibility Specialist |

## 🔒 CORES E DESIGN SYSTEM
| Elemento | Nome | Hex | Nunca Mudar |
|----------|------|-----|-------------|
| Cor Primária | Rosa FMAD | #C2227A | ✅ |
| Cor Secundária | Verde Cupom | #7CB342 | ✅ |
| Cor Terciária | Ciano Destaque | #00BCD4 | ✅ |
| Background | Cinza Claro | #F8F9FA | ✅ |
| Texto Principal | Preto Suave | #1A1A1A | ✅ |
| Texto Secundário | Cinza | #6B7280 | ✅ |

## 🔒 VERSÕES CONGELADAS
| Componente | Versão | Hash | Razão do Freeze |
|------------|---------|------|------------------|
| Button.tsx | v1.0.0 | btn-001 | Aprovado com todos variants |
| Card.tsx | v1.0.0 | crd-001 | Aprovado com 3 tipos |
| Loading.tsx | v1.0.0 | lod-001 | Aprovado com spinner e skeleton |
| Modal.tsx | v1.0.0 | mdl-001 | Aprovado responsivo |
| SearchBar.tsx | v1.0.1 | srch-002 | Corrigido bug X duplicado |
| Toast.tsx | v1.0.0 | tst-001 | Aprovado com 3 variants |
| Navbar.tsx | v1.0.1 | nav-002 | Corrigido sticky e z-index |
| globals.css | v1.0.0 | css-001 | Estilos base definidos |