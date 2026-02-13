# Guia Marajoara - Handoff Tecnico Completo

## 1) Resumo Executivo
- Projeto: **Guia Marajoara** (diretorio digital local com busca, cupons, painel de parceiro e admin).
- Dominio de producao: `https://www.marajoaraon.com.br`.
- Stack principal:
  - Next.js (App Router), React 19, TypeScript, Tailwind.
  - Supabase (Auth + Postgres + Storage).
  - Google Maps/Places (mapa, place details, reviews/rating).
  - GA4 + GTM com consentimento de cookies.
- Deploy: Vercel.

## 2) Estado Atual (operacional)
- Producao ativa no Vercel.
- Google Maps/Places funcionando com separacao de chaves:
  - Front: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
  - Server: `GOOGLE_MAPS_SERVER_API_KEY`.
- Analytics implementado com consentimento:
  - Banner de cookies + preferencias.
  - GTM/GA4 carregados via provider global.
- Reducao de custo Places implementada:
  - Cache em tabela `google_places_cache`.
  - Sync diario de ratings via cron.

## 3) Estrutura Principal do Codigo

### 3.1 App Router (`src/app`)
- Publico:
  - `/` Home
  - `/busca`
  - `/cupons`
  - `/empresas/[slug]`
  - paginas legais (`/termos`, `/politica-privacidade`, `/politica-cookies`)
- Parceiro:
  - `/dashboard`
  - `/dashboard/empresa`
  - `/dashboard/cupons`
  - `/dashboard/horarios`
  - `/dashboard/imagens`
- Admin:
  - `/admin`
  - `/admin/categorias`
  - `/admin/destaques`
  - `/admin/planos`
- APIs:
  - `/api/google-places`
  - `/api/admin/approve-business`
  - `/api/cron/sync-google-ratings`

### 3.2 Componentes (`src/components`)
- Layout/Home: `layout/*` (Hero, RecentBusinesses, FeaturedSection, ActiveCoupons, etc).
- Busca/Card: `BusinessCard.tsx`, `BuscaClient.tsx`.
- Detalhe empresa: `BusinessMapAndReviews.tsx`, `GoogleReviews.tsx`.
- Analytics:
  - `analytics/AnalyticsProvider.tsx`
  - `analytics/AnalyticsScripts.tsx`
  - `analytics/AnalyticsRouteTracker.tsx`
  - `analytics/CookieConsentBanner.tsx`

### 3.3 Servicos (`src/lib`)
- `services/search.ts`: busca e filtros de negocios.
- `services/google-places.ts`: busca/details com cache e funcoes reutilizaveis.
- `analytics.ts`: utilitarios de consentimento, pageview e eventos.
- `supabase.ts`: client helper.

## 4) Fluxo de Avaliacoes Google (importante)

### 4.1 Onde os dados aparecem
- **Detalhe da empresa** (`/empresas/[slug]`): reviews vindo de Place Details (tempo real pelo `google_place_id`).
- **Cards da Home/Busca**: usam dados persistidos no banco (`rating` e `total_reviews` em `businesses`).

### 4.2 Como os dados entram no banco
1. Parceiro/Admin vincula empresa ao Google Place no dashboard.
2. Sistema salva `google_place_id` na `businesses`.
3. `handleSyncRatings` grava `rating` + `total_reviews`.
4. Cron diario refresca esses campos automaticamente.

### 4.3 Otimizacao de custo aplicada
- Busca Places usa cache (TTL por env).
- Details de Place tambem usa cache.
- Consulta de details completa so quando necessario.

## 5) Analytics (GA4 + GTM)

### 5.1 Como esta implementado
- Scripts injetados no `layout.tsx` via `AnalyticsProvider`.
- Consent mode inicial = denied para analytics.
- So envia `page_view` apos aceite de cookies opcionais.

### 5.2 Variaveis esperadas
- `NEXT_PUBLIC_GTM_ID` (recomendado).
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (fallback/compatibilidade).

### 5.3 Configuracao GTM recomendada
- Tag base GA4/Google tag para `G-...`.
- Tag de evento `page_view` com trigger custom event `page_view`.
- Variaveis Data Layer:
  - `page_path`
  - `page_location`
  - `page_title`

## 6) Cron e Rotina Diaria

### 6.1 Endpoint
- `GET /api/cron/sync-google-ratings`
- Autorizacao obrigatoria por header:
  - `Authorization: Bearer ${CRON_SECRET}`

### 6.2 Agenda
- Arquivo: `vercel.json`
- Cron atual: `0 5 * * *` (05:00 UTC diario)

### 6.3 Configs de lote
- `GOOGLE_RATINGS_SYNC_BATCH_SIZE=40`
- Com ~18 empresas, sobra capacidade (todas processadas em 1 rodada).

## 7) Banco de Dados e Migrations

### 7.1 Migrations relevantes
- `supabase/migrations/add_google_place_id.sql`
- `supabase/migrations/20260213_google_places_cache_and_sync.sql`
- `supabase/migrations/20260213_google_places_cache_rls.sql`

### 7.2 Seguranca (RLS)
- `google_places_cache` com RLS habilitado.
- Sem policy para `anon/authenticated`.
- `REVOKE ALL` para `anon`, `authenticated`.
- Acesso apenas pelo backend com `service_role`.

## 8) Variaveis de Ambiente (resumo)
Arquivo de referencia: `.env.example`.

Minimas para rodar:
- Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Google:
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `GOOGLE_MAPS_SERVER_API_KEY`
- Analytics:
  - `NEXT_PUBLIC_GTM_ID` e/ou `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Cron/cache:
  - `CRON_SECRET`
  - `GOOGLE_PLACES_CACHE_TTL_HOURS`
  - `GOOGLE_RATINGS_SYNC_BATCH_SIZE`

## 9) Operacao - Checklist de Producao

### 9.1 Antes de deploy
1. Verificar envs em Production e Preview.
2. Confirmar migrations aplicadas no Supabase.
3. Verificar que `CRON_SECRET` existe.

### 9.2 Depois de deploy
1. Abrir Home/Busca/Detalhe e validar cards/mapa/reviews.
2. Validar endpoint cron manualmente:
   - `curl -i -H "Authorization: Bearer <CRON_SECRET>" https://www.marajoaraon.com.br/api/cron/sync-google-ratings`
3. Validar GA4 Realtime apos aceitar cookies.

## 10) Problemas Ja Resolvidos (historico recente)
- Erro de build por versao vulneravel do Next -> atualizado.
- Imports quebrados (`supabase` e icone) -> corrigidos.
- Banner de cookies quebrando layout -> corrigido.
- Busca Places fraca e cara -> busca contextual + cache.
- Cards com fallback de avaliacao "hardcoded" -> ajustados para dados reais.
- Tabela de cache sem RLS -> corrigido com migration de seguranca.

## 11) Riscos/Tecnicos Pendentes
- `next.config.ts` ainda ignora erros de TypeScript/ESLint no build (`ignoreBuildErrors`, `ignoreDuringBuilds`).
  - Recomendacao: remover gradualmente para elevar qualidade CI/CD.
- Ha documentos historicos em `docs/` com partes desatualizadas.
  - Este arquivo deve ser a fonte principal de handoff tecnico.

## 12) Comandos Uteis
- Dev local: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Ver status git: `git status`
- Ver cron (Vercel): painel > Settings > Cron Jobs

## 13) Onde mexer para cada tipo de demanda
- Ajustar cards de busca/home: `src/components/BusinessCard.tsx`, `src/components/layout/RecentBusinesses.tsx`, `src/app/busca/BuscaClient.tsx`.
- Ajustar detalhe de empresa/reviews: `src/app/empresas/[slug]/page.tsx`, `src/components/BusinessMapAndReviews.tsx`.
- Melhorar Places/custo: `src/lib/services/google-places.ts`, `src/app/api/google-places/route.ts`.
- Ajustar cron de sync: `src/app/api/cron/sync-google-ratings/route.ts`, `vercel.json`.
- Ajustar consentimento/analytics: `src/components/analytics/*`, `src/lib/analytics.ts`.

## 14) Fonte de verdade para proxima sessao
Se for retomar desenvolvimento com IA/equipe:
1. Ler este arquivo primeiro.
2. Confirmar envs e cron.
3. Confirmar status de migrations no Supabase.
4. Rodar checklist do item 9.

---
Ultima atualizacao: 2026-02-13
