import { describe, expect, it } from 'vitest';
import { RULES_VERSION } from './index';

describe('rules', () => {
  it('exposes a version', () => {
    expect(RULES_VERSION).toBe('0.1.0');
  });
});
