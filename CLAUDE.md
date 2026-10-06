# KOIdLe

Knight Online'dan esinlenen, Hearthstone tarzı bir kart oyunu. MMORPG değil. Şu an tasarım aşamasında, henüz kod yok.

- **Her oturuma `docs/devam-notu.md` ile başla.** Kararlar, Yasin'in revizyonları ve sıradaki adımlar orada.
- Dil: Türkçe. Hitap: Yasin. Ton samimi ve net.
- Knight Online'a ait isimler (uluslar, şehirler, item'lar, bosslar, NPC'ler, para birimi) kullanılmaz. Liste: `docs/research/01-ko-topluluk-ve-bagimlilik.md` başı.
- Sadelik önceliklidir. Bu bir kart oyunu; Knight'taki her sistem buraya taşınmaz.
- Üçlü çalışma düzeni: Claude uygular, Copilot (Yasin üzerinden) inceler, Yasin karar verir. Her önemli adımın sonunda DURUM RAPORU yazılır (şablon: Faz 0–1 planı §1).
- Savaş kural değerleri tek yerde: `docs/savas-degerleri.md` (kaynak `content/` JSON'ları).

## Komutlar
- `pnpm install` · `pnpm test` · `pnpm typecheck` · `pnpm lint` (`pnpm format` düzeltir)
- `packages/rules` saftır: DOM, Node API, `Math.random`, `Date.now` yasak; bağımlılığı yok. Kural değerleri yalnız `content/` JSON'larında.
