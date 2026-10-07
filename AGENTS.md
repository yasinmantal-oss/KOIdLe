<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# KOIdLe — ajanlar için giriş

**Her oturuma şu sırayla başla:** `docs/deepseek-devir.md` (devir dokümanı, kurallar ve sana verilen iş) → `docs/devam-notu.md` (ana proje hafızası).

- Dil: Türkçe. Proje sahibi ve tek karar verici: Yasin.
- 2026-10-07'den itibaren uygulayıcı DeepSeek Harness; Claude geçici olarak çekildi, Copilot devre dışı.
- `packages/rules` saftır: DOM, Node API, `Math.random`, `Date.now` yasak; kural değerleri yalnız `content/` JSON'larında.
- Knight Online'a ait isimler (ulus, şehir, item, boss, NPC, para) kullanılmaz; skill isimleri serbest.
- Komutlar bu makinede `corepack pnpm …` ile çalışır (ayrıntı: `docs/deepseek-devir.md` §5).
- Her oturumu `docs/kapanis-protokolu.md`'ye göre kapat. `master`'a kendiliğinden merge etme.
