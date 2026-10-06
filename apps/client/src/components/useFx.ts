import type { BattleEvent } from '@koidle/rules';
import { useEffect, useState } from 'react';
import { FX, type FxResult, fxFor } from '../fx';

export interface ActiveFx {
  /** Her aksiyonda artar; CSS animasyonunu yeniden başlatmak için çift/tek sınıf seçer. */
  seq: number;
  result: FxResult;
}

/** Son aksiyonun efektini calloutMs boyunca tutar, sonra temizler. Girdiyi bloklamaz. */
export function useFx(lastEvents: BattleEvent[], seq: number): ActiveFx | null {
  const [active, setActive] = useState<ActiveFx | null>(null);
  useEffect(() => {
    if (seq === 0) return;
    setActive({ seq, result: fxFor(lastEvents) });
    const timer = setTimeout(
      () => setActive((cur) => (cur?.seq === seq ? null : cur)),
      FX.calloutMs,
    );
    return () => clearTimeout(timer);
  }, [lastEvents, seq]);
  return active;
}
