import type { BattleConfig, CardDef } from '@koidle/rules';
import { z } from 'zod';

const int = (min = 0) => z.int().min(min);
const positive = () => z.int().min(1);

export const BattleConfigSchema = z.strictObject({
  hero: z.strictObject({ hp: positive() }),
  mp: z.strictObject({ start: positive(), perTurn: int(), max: positive().max(20) }),
  hand: z.strictObject({
    starting: int(),
    limit: positive(),
    drawPerTurn: int(),
    firstPlayerSkipsFirstDraw: z.boolean(),
  }),
  deck: z.strictObject({ size: positive(), reshuffles: int() }),
  fatigue: z.strictObject({ start: int(), step: int(), ignoresShield: z.boolean() }),
  shield: z.strictObject({ persistence: z.enum(['resetOnOwnTurnStart', 'persistent']) }),
  arenaCollapse: z.strictObject({
    startRound: positive(),
    start: int(),
    step: int(),
    ignoresShield: z.boolean(),
  }),
  statuses: z.strictObject({
    stacking: z.literal('maxAmountRefreshOnGte'),
    tickOn: z.literal('ownerTurnEnd'),
    strength: z.strictObject({ duration: positive() }),
    weak: z.strictObject({ duration: positive() }),
    curse: z.strictObject({ duration: positive() }),
    poison: z.strictObject({ duration: positive() }),
    stealth: z.strictObject({ duration: positive() }),
  }),
  roundCap: positive(),
}) satisfies z.ZodType<BattleConfig>;

const StatusIdSchema = z.enum(['strength', 'weak', 'curse', 'poison', 'stealth']);

export const ConditionSchema = z.union([
  z.strictObject({ selfHas: StatusIdSchema }),
  z.strictObject({ enemyHas: StatusIdSchema }),
  z.strictObject({ enemyHpAtMost: positive() }),
  z.strictObject({ selfHpAtMost: positive() }),
  z.strictObject({ cardsPlayedAtLeast: positive() }),
]);

const BonusSchema = z.strictObject({ if: ConditionSchema, amount: positive() });

export const EffectSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('damage'),
    amount: int(),
    ignoreShield: z.boolean().exactOptional(),
    hits: z.int().min(2).exactOptional(),
    bonus: BonusSchema.exactOptional(),
  }),
  z.strictObject({ kind: z.literal('damageFromShieldGainedThisTurn') }),
  z.strictObject({ kind: z.literal('shield'), amount: positive() }),
  z.strictObject({
    kind: z.literal('heal'),
    amount: positive(),
    bonus: BonusSchema.exactOptional(),
  }),
  z.strictObject({ kind: z.literal('draw'), count: positive() }),
  z.strictObject({
    kind: z.literal('applyStatus'),
    target: z.enum(['self', 'enemy']),
    status: StatusIdSchema,
    amount: positive(),
  }),
]);

export const CardSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case olmalı (ör. kalkan-kaldir)'),
  name: z.string().min(1),
  job: z.literal('warrior'),
  type: z.enum(['attack', 'skill', 'defense', 'heal', 'buff', 'debuff']),
  cost: int().max(10),
  effects: z.array(EffectSchema).min(1),
  text: z.string().min(1),
}) satisfies z.ZodType<CardDef>;

export const CardListSchema = z.array(CardSchema).min(1);

export const AiWeightsSchema = z.strictObject({
  enemyDamage: z.number().min(0),
  selfDamage: z.number().min(0),
  shield: z.number().min(0),
  enemyShield: z.number().min(0),
  status: z.number().min(0),
  hand: z.number().min(0),
});

export const AiProfilesSchema = z.strictObject({
  aggressive: AiWeightsSchema,
  balanced: AiWeightsSchema,
  defensive: AiWeightsSchema,
});

export type AiWeights = z.infer<typeof AiWeightsSchema>;
export type AiProfiles = z.infer<typeof AiProfilesSchema>;
