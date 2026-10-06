import type { AiProfile } from '@koidle/ai';
import type { BattleConfig, CardDef, EndReason } from '@koidle/rules';

export interface Gate1Answers {
  eglence: number; // 1–5
  kararVermekZorundaKaldim: number; // 1–5
  gerekendenUzun: boolean;
  iseYaramayanKartSinirlendirdi: boolean;
  sonucuDegistirenKarariHatirliyorum: boolean;
  not: string;
}

export interface Gate1Record {
  zaman: string;
  seed: number;
  aiProfili: AiProfile;
  ilkOynayan: 'sen' | 'rakip';
  sonuc: 'kazandın' | 'kaybettin' | 'berabere';
  bitisNedeni: EndReason;
  raunt: number;
  sureSn: number;
  arenaGoruldu: boolean;
  yorgunlukGoruldu: boolean;
  configHash: string;
  cevaplar: Gate1Answers;
}

/** Değerler değişince kayıtlar ayrışsın diye config + kartların kısa özeti (FNV-1a). */
export function contentHash(config: BattleConfig, cards: CardDef[]): string {
  const text = JSON.stringify({ config, cards });
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const BACKUP_KEY = 'koidle.gate1';

export function readBackup(): Gate1Record[] {
  try {
    return JSON.parse(localStorage.getItem(BACKUP_KEY) ?? '[]') as Gate1Record[];
  } catch {
    return [];
  }
}

/** Önce yerel yedek, sonra dev sunucusu üzerinden docs/gate-1/oturumlar.jsonl. */
export async function saveRecord(
  record: Gate1Record,
): Promise<'dosyaya yazıldı' | 'yalnız tarayıcıda'> {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify([...readBackup(), record]));
  } catch {
    // yedek olmadan da devam
  }
  try {
    const res = await fetch('/__gate1', { method: 'POST', body: JSON.stringify(record) });
    return res.ok ? 'dosyaya yazıldı' : 'yalnız tarayıcıda';
  } catch {
    return 'yalnız tarayıcıda';
  }
}

export function downloadBackup(): void {
  const lines = readBackup()
    .map((r) => JSON.stringify(r))
    .join('\n');
  const url = URL.createObjectURL(new Blob([`${lines}\n`], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gate-1-oturumlar.jsonl';
  a.click();
  URL.revokeObjectURL(url);
}
