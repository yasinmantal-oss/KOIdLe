import type { BattleConfig, CardDef } from '@koidle/rules';
import { z } from 'zod';

const int = (min = 0) => z.int().min(min);
const positive = () => z.int().min(1);

export const BattleConfigSchema = z.strictObject({
  hero: z.strictObject({ hp: positive() }),
  mp: z.strictObject({
    start: positive(),
    perTurn: int(),
    max: positive().max(20),
    secondPlayerFirstTurnBonus: int(),
  }),
  hand: z.strictObject({
    starting: int(),
    limit: positive(),
    drawPerTurn: int(),
    firstPlayerSkipsFirstDraw: z.boolean(),
    secondPlayerFirstTurnExtraDraw: int(),
    openingGuarantee: z.boolean(),
  }),
  deck: z.strictObject({ size: positive(), reshuffles: int() }),
  fatigue: z.strictObject({ start: int(), step: int(), ignoresShield: z.boolean() }),
  shield: z.strictObject({ persistence: z.enum(['resetOnOwnTurnStart', 'persistent']) }),
  arenaCollapse: z.strictObject({
    enabled: z.boolean(),
    startRound: positive(),
    start: int(),
    step: int(),
    ignoresShield: z.boolean(),
  }),
  statuses: z.strictObject({
    weak: z.strictObject({ duration: positive() }),
    strength: z.strictObject({ max: positive() }),
    poison: z.strictObject({ max: positive(), decay: positive() }),
  }),
  deckBuilding: z.strictObject({ maxHeavy: int(), minOpeners: int() }),
  roundCap: positive(),
}) satisfies z.ZodType<BattleConfig>;

const StatusIdSchema = z.enum(['strength', 'weak', 'poison', 'critical', 'evade']);

export const ConditionSchema = z.union([
  z.strictObject({ selfHas: StatusIdSchema }),
  z.strictObject({ enemyHas: StatusIdSchema }),
  z.strictObject({ enemyHpAtMost: positive() }),
  z.strictObject({ selfHpAtMost: positive() }),
]);

const BonusSchema = z.strictObject({ if: ConditionSchema, amount: positive() });

export const EffectSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('damage'),
    amount: int(),
    ignoreShield: z.boolean().exactOptional(),
    hits: z.int().min(2).exactOptional(),
    bonus: BonusSchema.exactOptional(),
    strengthMultiplier: z.int().min(2).exactOptional(),
  }),
  z.strictObject({ kind: z.literal('selfDamage'), amount: positive() }),
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
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case olmalı (ör. leg-cutting)'),
  name: z.string().min(1),
  job: z.enum(['common', 'warrior', 'rogue']),
  branch: z.enum(['assassin', 'archer']).exactOptional(),
  tags: z.array(z.literal('heavy')).min(1).exactOptional(),
  type: z.enum(['attack', 'skill', 'defense', 'heal', 'buff', 'debuff']),
  cost: int().max(10),
  effects: z.array(EffectSchema).min(1),
  text: z.string().min(1),
}) satisfies z.ZodType<CardDef>;

export const CardListSchema = z.array(CardSchema).min(1);

/** Hazır deste: yalnız kart id'leri; kurallar `validateDeck`'te. */
export const DeckSchema = z.array(z.string().min(1)).min(1);

export const AiWeightsSchema = z.strictObject({
  enemyDamage: z.number().min(0),
  selfDamage: z.number().min(0),
  shield: z.number().min(0),
  enemyShield: z.number().min(0),
  status: z.number().min(0),
  hand: z.number().min(0),
  /** Kritik'in AI için değeri (sabit puan). */
  criticalValue: z.number().min(0),
  /** Kaçınma'nın AI için değeri (sabit puan). */
  evadeValue: z.number().min(0),
});

export const AiProfilesSchema = z.strictObject({
  aggressive: AiWeightsSchema,
  balanced: AiWeightsSchema,
  defensive: AiWeightsSchema,
});

export type AiWeights = z.infer<typeof AiWeightsSchema>;
export type AiProfiles = z.infer<typeof AiProfilesSchema>;

/** AI tur planı: kaç kart derinliğe, kaç aday genişliğinde bakar. AI ayarı, kural değeri değil. */
export const AiPlannerSchema = z.strictObject({
  depth: z.int().min(1).max(6),
  beam: z.int().min(1).max(20),
});

export type AiPlanner = z.infer<typeof AiPlannerSchema>;
