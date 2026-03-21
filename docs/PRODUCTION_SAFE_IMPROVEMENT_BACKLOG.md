# MarajoaraON - Backlog Mestre de Melhorias Sem Regressao

Status: `ativo`  
Ultima atualizacao: `2026-03-21`  
Fonte de verdade: este arquivo

## 1) Objetivo
Executar melhorias tecnicas profundas no projeto sem alterar o comportamento percebido pelo usuario final.

## 2) Regra de ouro (obrigatoria)
- Nao mudar fluxo funcional existente.
- Nao mudar regras de negocio existentes.
- Nao quebrar rotas, SEO, analytics, login, dashboard, busca ou detalhe.
- Mudancas visiveis so quando forem neutras ou melhores e sem friccao para o usuario.
- Toda alteracao deve passar por Preview da Vercel antes de merge.

## 3) Processo de execucao seguro
1. Criar branch por tema (`codex/<tema>`).
2. Fazer PR pequeno (1 tema por PR).
3. Rodar validacoes locais:
   - `npm run build`
   - `npx tsc --noEmit`
4. Validar Preview da Vercel.
5. Executar checklist funcional rapido (secao 7).
6. Merge apenas com checklist aprovado.
7. Se regressao aparecer, rollback imediato no Vercel.

## 4) Backlog por fase (com checklist)

## Fase 1 - Qualidade de build e gates (critico)
- [x] Remover bypass de erros no build em `next.config.ts`
  Arquivo: `next.config.ts`
- [x] Corrigir configuracao do ESLint que hoje falha
  Arquivo: `eslint.config.mjs`
- [x] Adicionar script de `typecheck` e gate de qualidade
  Arquivo: `package.json`
- [x] Corrigir erro de tipos em componente legado de login (ou remover do caminho de build)
  Arquivo: `src/components/auth/LoginForm.tsx`
- [x] Corrigir tipo de `banner_mobile_url` no contrato de busca
  Arquivo: `src/lib/services/search.ts`
- [x] Ajustar uso tipado de banner no card
  Arquivo: `src/components/BusinessCard.tsx`

## Fase 2 - Modernizacao Next 16 + Supabase (sem mudar UX)
- [x] Migrar convencao de `middleware` para o padrao atual do Next 16 (proxy)
  Arquivos: `src/middleware.ts`, `src/proxy.ts`
- [x] Consolidar helper Supabase com `@supabase/ssr`
  Arquivo: `src/lib/supabase.ts`
- [x] Migrar contexto de auth para helper consolidado
  Arquivo: `src/contexts/auth-context.tsx`
- [x] Migrar hooks de autorizacao/admin
  Arquivos: `src/hooks/useAdmin.ts`, `src/hooks/usePartner.ts`
- [x] Remover `as any` na pagina de detalhe da empresa
  Arquivo: `src/app/empresas/[slug]/page.tsx`

## Fase 3 - Navegacao sem reload (transparente ao usuario)
- [x] Trocar `window.location.href` por navegacao do Next na home
  Arquivo: `src/app/page.tsx`
- [x] Trocar `window.location.href` no card de empresa
  Arquivo: `src/components/BusinessCard.tsx`
- [x] Trocar navegacao por `window.location` no menu mobile
  Arquivo: `src/components/layout/MobileMenu.tsx`
- [x] Ajustar redirecionamentos diretos em admin
  Arquivo: `src/app/admin/page.tsx`

## Fase 4 - Higiene tecnica (sem impacto funcional)
- [x] Reduzir `console.log` de debug em upload de imagens
  Arquivo: `src/app/dashboard/imagens/page.tsx`
- [x] Remover logs de debug de login
  Arquivo: `src/app/login/page.tsx`
- [x] Sanitizar logs em providers de email
  Arquivo: `src/lib/email/providers/index.ts`
- [x] Limpar logs verbosos em mapa simples
  Arquivo: `src/components/GoogleMapSimple.tsx`
- [x] Limpar logs/debug verbosos em aprovacao admin API
  Arquivo: `src/app/api/admin/approve-business/route.ts`
- [x] Substituir `alert` por feedback padronizado progressivamente
  Arquivos:
  `src/app/admin/mari/page.tsx`,
  `src/app/admin/categorias/page.tsx`,
  `src/app/admin/destaques/page.tsx`,
  `src/app/admin/planos/page.tsx`,
  `src/app/admin/page.tsx`,
  `src/app/empresas/perfil/page.tsx`,
  `src/components/dashboard/EditCouponForm.tsx`
- [x] Reduzir usos de `any` nos pontos mapeados
  Arquivos:
  `src/app/esqueci-senha/page.tsx`,
  `src/app/redefinir-senha/page.tsx`,
  `src/app/test-db/page.tsx`,
  `src/app/admin/destaques/page.tsx`,
  `src/app/admin/page.tsx`

## Fase 5 - Limpeza de legado e contratos
- [x] Remover arquivo legado nao utilizado
  Arquivo: `src/components/ClientProviders.tsx.old`
- [x] Remover arquivo desativado legado
  Arquivo: `src/middleware.ts.disabled`
- [x] Regenerar tipos do Supabase de forma completa
  Arquivo: `src/types/supabase.ts`

## Fase 6 - Documentacao consolidada e atual
- [x] Manter `PROJECT_HANDOFF.md` como referencia principal operacional
  Arquivo: `docs/PROJECT_HANDOFF.md`
- [x] Atualizar ou arquivar `PROJECT_BRAIN.md` (evitar conflito de verdade)
  Arquivo: `docs/PROJECT_BRAIN.md`
- [x] Atualizar contratos para stack real atual
  Arquivo: `docs/PROJECT_CONTRACTS.md`
- [x] Atualizar roadmap para estado atual (tirar status antigo)
  Arquivo: `docs/PROJECT_ROADMAP.md`
- [x] Marcar historico como historico legado
  Arquivo: `docs/PROJECTS_HISTORY.md`
- [x] Apontar README para documentacao oficial atual
  Arquivo: `README.md`

## 5) Ordem recomendada de execucao
1. Fase 1
2. Fase 3
3. Fase 2
4. Fase 4
5. Fase 5
6. Fase 6

Motivo: primeiro garantimos gates de qualidade e seguranca de entrega, depois modernizamos stack com risco controlado.

## 6) Template de atualizacao por item
Quando concluir um item, atualizar assim:
- [x] Item concluido
  - Data: `YYYY-MM-DD`
  - PR: `#numero`
  - Branch: `codex/...`
  - Validacao: `build ok`, `typecheck ok`, `preview ok`, `checklist funcional ok`
  - Observacoes: `curto e objetivo`

## 7) Checklist funcional rapido (obrigatorio em todo PR)
- [ ] Home abre e navega sem erro
- [ ] Busca funciona com filtros
- [ ] Card abre detalhe corretamente
- [ ] Detalhe da empresa carrega reviews/mapa
- [ ] Login funciona
- [ ] Esqueci senha / redefinir senha funciona
- [ ] Dashboard parceiro abre sem erro
- [ ] Admin abre sem erro
- [ ] GTM/GA4 continuam ativos
- [ ] Endpoint cron continua protegido por `CRON_SECRET`

Evidencia automatica local (`2026-03-21`):
- `npm run typecheck`: ok
- `npm run build`: ok
- `npm run lint`: ok (somente warnings)
- Smoke HTTP: `/`, `/busca?categoria=viagens`, `/empresas/ci-intercambio-jardim-marajoara`, `/login`, `/esqueci-senha`, `/redefinir-senha`, `/dashboard`, `/admin` com `200`; `/api/cron/sync-google-ratings` sem token com `401 Unauthorized`.

## 8) Criterio de aceite final
- `0` regressao funcional reportada apos merge.
- `100%` dos itens de Fase 1 concluidos.
- Build, typecheck e preview sempre verdes por PR.
