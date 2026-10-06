# KOIdLe

Knight Online'dan esinlenen, Hearthstone tarzı bir kart oyunu. MMORPG değil. Faz 1 (savaş sandbox'ı) kodu var; Gate 1 = FAIL / ITERATE (Yasin); Combat v0.2 uygulandı; Gate 1B = CONDITIONAL PASS; **Gate 1 = PASS (Yasin, 2026-10-06)**; Faz 2 tasarımı onaylandı (`docs/superpowers/specs/2026-10-06-faz-2-dort-job-design.md`), sıradaki iş Faz 2a planı.

- **Her oturuma `docs/devam-notu.md` ile başla.** Kararlar, Yasin'in revizyonları ve sıradaki adımlar orada.
- Dil: Türkçe. Hitap: Yasin. Ton samimi ve net.
- Knight Online'a ait isimler (uluslar, şehirler, item'lar, bosslar, NPC'ler, para birimi) kullanılmaz. Liste: `docs/research/01-ko-topluluk-ve-bagimlilik.md` başı. **Skill isimleri serbest** (Yasin, 2026-10-06); kişi adı içeren skill adı hariç.
- Sadelik önceliklidir. Bu bir kart oyunu; Knight'taki her sistem buraya taşınmaz.
- Çalışma düzeni: Claude uygular, Yasin karar verir. **Copilot 2026-10-06'dan itibaren geçici olarak devre dışı** (Yasin'in kararı); Yasin geri alana kadar Copilot onayı beklenmez. Her önemli adımın sonunda DURUM RAPORU yazılır (şablon: Faz 0–1 planı §1).
- **Her oturumu `docs/kapanis-protokolu.md`'ye göre kapat:** devam notu, vault, commit + push, kapanış raporu. Hiçbir karar yalnız sohbette kalmaz. Gate geçmeden sonraki faz başlamaz.
- Mockup'lar (`design/mockups/`) referanstır; spec ve `content/` ile çelişirse spec geçerli.
- Savaş kural değerleri tek yerde: `docs/savas-degerleri.md` (kaynak `content/` JSON'ları).

## Komutlar
- `pnpm install` · `pnpm test` · `pnpm typecheck` · `pnpm lint` (`pnpm format` düzeltir)
- `packages/rules` saftır: DOM, Node API, `Math.random`, `Date.now` yasak; bağımlılığı yok. Kural değerleri yalnız `content/` JSON'larında.
