import type { AiProfile } from '@koidle/ai';
import type { ArchetypeId } from '@koidle/content-schema';
import type { BattleConfig, CardDef, EndReason } from '@koidle/rules';

export interface Gate1Answers {
  eglence: number; // 1–5
  kararVermekZorundaKaldim: number; // 1–5
  gerekendenUzun: boolean;
  iseYaramayanKartSinirlendirdi: boolean;
  /** Faz 2 sorusu: "Sonucu değiştiren bir kombomu/kararımı hatırlıyor muyum?" */
  sonucuDegistirenKarariHatirliyorum: boolean;
  /** Faz 2 sorusu: "Bu job farklı hissettirdi mi?" */
  farkliHissettirdi: boolean;
  not: string;
}

export interface Gate1Record {
  zaman: string;
  seed: number;
  aiProfili: AiProfile;
  oyuncuJob: ArchetypeId;
  aiJob: ArchetypeId;
  /** Oynanan destenin kart id'leri. */
  deste: string[];
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

export const FAZ2_BACKUP_KEY = 'koidle.faz2';

export function readBackup(): Gate1Record[] {
  try {
    return JSON.parse(localStorage.getItem(FAZ2_BACKUP_KEY) ?? '[]') as Gate1Record[];
  } catch {
    return [];
  }
}

export type SaveTarget = 'artifact kaydına yazıldı' | 'dosyaya yazıldı' | 'yalnız tarayıcıda';

interface ArtifactDb {
  collection(path: string): { add(data: Record<string, unknown>): Promise<unknown> };
}
interface ClaudeRuntime {
  use(name: string): Promise<unknown>;
}

/** claude.ai Artifact içinde açıldıysa sayfanın db'si; değilse null. */
export const inArtifact = (): boolean => typeof window !== 'undefined' && 'claude' in window;

async function artifactDb(): Promise<ArtifactDb | null> {
  const claude = (window as unknown as { claude?: ClaudeRuntime }).claude;
  if (!claude) return null;
  return ((await claude.use('db')) as ArtifactDb | null) ?? null;
}

/**
 * Önce yerel yedek. Sonra: Artifact içindeysek sayfanın db'sine (Claude okuyabilir),
 * değilse dev sunucusu üzerinden docs/faz-2/oturumlar.jsonl dosyasına.
 */
export async function saveRecord(record: Gate1Record): Promise<SaveTarget> {
  try {
    localStorage.setItem(FAZ2_BACKUP_KEY, JSON.stringify([...readBackup(), record]));
  } catch {
    // yedek olmadan da devam
  }
  if (inArtifact()) {
    try {
      const db = await artifactDb();
      if (db) {
        await db.collection('faz2').add({ ...record });
        return 'artifact kaydına yazıldı';
      }
    } catch {
      // aşağıya düş
    }
    return 'yalnız tarayıcıda';
  }
  try {
    const res = await fetch('/__faz2', { method: 'POST', body: JSON.stringify(record) });
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
  a.download = 'faz-2-oturumlar.jsonl';
  a.click();
  URL.revokeObjectURL(url);
}
