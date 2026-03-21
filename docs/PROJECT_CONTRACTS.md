# PROJECT_CONTRACTS.md - CONTRATOS E DECISÕES IMUTÁVEIS
> STATUS: base historica. Alguns contratos abaixo refletem fases antigas.
> Referencia atual da stack e operacao: `docs/PROJECT_HANDOFF.md`.
## 🔒 DECISÕES DE ARQUITETURA
| ID | Data | Decisão | Motivo | Impacto | Autor |
|----|------|---------|---------|---------|--------|
| A001 | 14/09/2025 14:59 | Next.js 14 com App Router | Melhor DX e performance | Todo o projeto | GP |
| A002 | 14/09/2025 14:59 | TypeScript obrigatório | Type safety e manutenibilidade | Todo código | GP |
| A003 | 14/09/2025 14:59 | Tailwind CSS v3 (NÃO v4) | Estabilidade | Todos os estilos | GP |
| A004 | 14/09/2025 14:59 | Supabase para backend | All-in-one solution | Database + Auth | GP |
| A005 | 14/09/2025 14:59 | Mobile First obrigatório | 90% acesso mobile | Todo desenvolvimento | Product Owner |
| A006 | 14/09/2025 14:59 | Vercel para deploy | Integração com Next.js | Hosting | GP |
| A007 | 15/09/2025 11:30 | Remoção vercel.json | Conflito com dashboard | Deploy config | DevOps Engineer |

## 🔒 DECISÕES DE NEGÓCIO
| ID | Data | Decisão | Motivo | Impacto | Autor |
|----|------|---------|---------|---------|--------|
| B001 | 14/09/2025 14:59 | R$ 49,90 basic / R$ 99,90 premium | Precificação competitiva | Modelo de receita | Product Owner |
| B002 | 14/09/2025 14:59 | 5 cupons basic / 10 premium | Limitar uso | Sistema de cupons | Product Owner |
| B003 | 14/09/2025 14:59 | PIX manual na fase 1 | Simplicidade | Processo de pagamento | Product Owner |
| B004 | 14/09/2025 14:59 | Sem dados pessoais visíveis | Privacidade | Todo o sistema | Product Owner |
| B005 | 14/09/2025 14:59 | WhatsApp obrigatório | Canal principal | Comunicação | Product Owner |
| B006 | 14/09/2025 14:59 | Free para consumidor final | Adoção | Modelo de negócio | Product Owner |

## 🔒 PADRÕES DE CÓDIGO E DESIGN
| ID | Data | Decisão | Motivo | Impacto | Autor |
|----|------|---------|--------|---------|-------|
| P001 | 14/09/2025 | Mobile first sempre | `className="w-full md:w-1/2"` | Todos componentes | GP |
| P002 | 14/09/2025 | Componentes funcionais | `export default function Component()` | Todos componentes | GP |
| P003 | 14/09/2025 | Types explícitos | `interface Props { name: string }` | Todo código | GP |
| P004 | 14/09/2025 | Soft delete | `deleted_at timestamp` | Todas tabelas | GP |
| P005 | 14/09/2025 | Validação obrigatória | Gerente valida 1 por 1 todas entregas | Todas tarefas | GP |
| P006 | 14/09/2025 | Checklist numerado | Especialista segue lista exata | Todas implementações | GP |
| P007 | 14/09/2025 | Design obrigatório antes de código | Evitar retrabalho e erros de UI | Todo desenvolvimento visual | Product Owner + GP |
| P008 | 14/09/2025 | Gates de Qualidade em 3 fases | Garantir qualidade em cada etapa | Todo o processo | Product Owner + GP |
| P009 | 14/09/2025 | Workflow multifuncional | Reduzir erros com validação cruzada | Toda a equipe | Product Owner + GP |
| P010 | 14/09/2025 | Verde ajustado para #7CB342 | Conformidade WCAG AA (contraste 3.02:1) | Todos os componentes | Accessibility Specialist |
| P011 | 15/09/2025 | Padronizar efeito `hover` de elevação em 2px para todos os cards. | Manter consistência com o `Card.tsx` e evitar variações. | Todos os componentes de card | GP |
| D001 | 15/09/2025 | Criar conjunto de ícones personalizados para categorias. | Fortalecer a identidade visual e profissionalismo. | Design System, Home | UX/UI DESIGNER |
| P012 | 15/09/2025 | Implementar contadores animados como componente reutilizável. | Padronizar a funcionalidade e economizar tempo futuro (DRY). | `HeroSection.tsx`, Dashboards | DESIGN SYSTEM ARCHITECT|
| P013 | 15/09/2025 | Criar componente reutilizável `<Badge />` para status. | Padronizar a exibição de status e fortalecer o Design System. | Home, Dashboard, Admin | DESIGN SYSTEM ARCHITECT |
| P014 | 15/09/2025 | Usar tag `<article>` para cards de conteúdo autossuficiente. | Melhorar a semântica do HTML e a acessibilidade. | Todos os componentes de card | ACCESSIBILITY SPECIALIST |
| P015 | 15/09/2025 | "Pre-flight Check": Verificar `props` de um componente antes de sugerir modificações. | Evitar sugestões de código inválidas e erros de tipo. | Validação do Design System | GP |
| P016 | 15/09/2025 | Modificar arquivos de código aplicando um "patch", preservando código não relacionado. | Evitar a remoção acidental de código existente. | Toda a edição de código | GP |
| P017 | 15/09/2025 | "Pre-flight Check" obrigatório para uso de componentes. | Forçar a IA a verificar a API do componente antes de usá-lo. | Todo desenvolvimento | GP |
| P018 | 15/09/2025 | Criar componente reutilizável `<Input />` para formulários. | Padronizar a aparência e comportamento de todos os campos de formulário. | Formulários (Modal, Cadastro) | DESIGN SYSTEM ARCHITECT |
| P019 | 15/09/2025 | Foco automático no primeiro campo de formulário ao abrir um modal. | Melhorar a usabilidade e acessibilidade para navegação via teclado. | Todos os modais com formulários | ACCESSIBILITY SPECIALIST |
| D002 | 15/09/2025 | Carrosséis devem incluir autoplay com controles de usuário. | Melhorar a usabilidade e garantir conformidade com WCAG. | Componente `Carousel.tsx` | UX/UI DESIGNER |
| P020 | 15/09/2025 | "Verificação de Árvore de Arquivos" obrigatória antes de comandos com caminhos. | Evitar erros recorrentes de `pathspec` no Git. | Todos os comandos de terminal | GP |

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

## 🔒 INFRAESTRUTURA DEFINIDA
| ID | Data | Decisão | Detalhes | Status |
|----|------|---------|----------|---------|
| I001 | 15/09/2025 11:20 | GitHub Repository | https://github.com/lstanquini/guia-marajoara | ✅ Ativo |
| I002 | 15/09/2025 11:25 | Supabase Project | tkeotwqkgprhjtnsdmtw.supabase.co | ✅ Configurado |
| I003 | 15/09/2025 11:45 | Vercel Deploy | https://guia-marajoara.vercel.app | ✅ Online |
