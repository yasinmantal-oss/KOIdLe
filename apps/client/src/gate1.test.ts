import { afterEach, describe, expect, it, vi } from 'vitest';
import { FAZ2_BACKUP_KEY, readBackup } from './gate1';

afterEach(() => vi.unstubAllGlobals());

describe('match form backup', () => {
  it('uses the Faz 2 key, so Gate 1 records are never mixed in', () => {
    expect(FAZ2_BACKUP_KEY).toBe('koidle.faz2');
    const getItem = vi.fn(() => '[]');
    vi.stubGlobal('localStorage', { getItem });
    expect(readBackup()).toEqual([]);
    expect(getItem).toHaveBeenCalledWith('koidle.faz2');
  });

  it('is empty without localStorage', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(readBackup()).toEqual([]);
  });
});
