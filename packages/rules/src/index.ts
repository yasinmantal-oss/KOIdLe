export const RULES_VERSION = '0.1.0';

export { createBattle } from './battle';
export { apply, IllegalActionError, type IllegalReason, validateAction } from './engine';
export { legalActions } from './legal';
export type * from './types';
