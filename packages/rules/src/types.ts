export type PlayerIndex = 0 | 1;
export type Job = 'warrior' | 'rogue';
export type Branch = 'assassin' | 'archer';
export type CardTag = 'heavy';
export type CardType = 'attack' | 'skill' | 'defense' | 'heal' | 'buff' | 'debuff';
export type StatusId = 'strength' | 'weak' | 'poison' | 'critical' | 'evade';

/** Combat v0.2: kartın koşullu bonusu. Koşul kart oynandığı an değerlendirilir. */
export type Condition =
  | { selfHas: StatusId }
  | { enemyHas: StatusId }
  | { enemyHpAtMost: number }
  | { selfHpAtMost: number };

export interface Bonus {
  if: Condition;
  amount: number;
}

export type Effect =
  | {
      kind: 'damage';
      amount: number;
      ignoreShield?: boolean;
      hits?: number;
      bonus?: Bonus;
      /** Güç bu kartta kaç kat sayılır (varsayılan 1; Hell Blade 2). */
      strengthMultiplier?: number;
    }
  | { kind: 'selfDamage'; amount: number }
  | { kind: 'gainMp'; amount: number }
  | { kind: 'damageFromShieldGainedThisTurn' }
  | { kind: 'shield'; amount: number }
  | { kind: 'heal'; amount: number; bonus?: Bonus }
  | { kind: 'draw'; count: number }
  | { kind: 'applyStatus'; target: 'self' | 'enemy'; status: StatusId; amount: number };

export interface CardDef {
  id: string;
  name: string;
  job: Job | 'common';
  /** Yalnız Rogue kartlarında; Rogue ortak kartlarında yok. */
  branch?: Branch;
  /** 'heavy' = Ağır: destede en fazla `deckBuilding.maxHeavy`, açılış eline gelmez. */
  tags?: CardTag[];
  type: CardType;
  cost: number;
  effects: Effect[];
  text: string;
}

export interface BattleConfig {
  hero: { hp: number };
  mp: { start: number; perTurn: number; max: number };
  hand: {
    starting: number;
    limit: number;
    drawPerTurn: number;
    firstPlayerSkipsFirstDraw: boolean;
    openingGuarantee: boolean;
  };
  deck: { size: number; reshuffles: number };
  fatigue: { start: number; step: number; ignoresShield: boolean };
  shield: { persistence: 'resetOnOwnTurnStart' | 'persistent' };
  arenaCollapse: { startRound: number; start: number; step: number; ignoresShield: boolean };
  statuses: {
    /** Zayıflık: K7 (büyük/eşit değer yeniler); sahibinin tur sonunda süre düşer. */
    weak: { duration: number };
    /** Güç: toplanır, üst sınırı var; ilk hasar veren kartta tamamı harcanır. */
    strength: { max: number };
    /** Zehir: toplanır, üst sınırı var; sahibinin tur başında vurur, sonra `decay` azalır. */
    poison: { max: number; decay: number };
  };
  /** Deste kurma sınırları. Motor yok sayar; deste kurma ekranı, hazır desteler ve sim doğrular. */
  deckBuilding: { maxHeavy: number; minOpeners: number };
  roundCap: number;
}

export interface CardInstance {
  iid: string;
  cardId: string;
}

export interface Status {
  id: StatusId;
  amount: number;
  /** null = süresi yok (kullanılana kadar; Kaçınma sahibinin sonraki turunun başında düşer). */
  turnsLeft: number | null;
}

export interface PlayerState {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  shield: number;
  /** Bu tur kazanılan Kalkan; sahibinin tur başında 0 olur (Kalkan Darbesi bunu okur). */
  shieldGainedThisTurn: number;
  /** Bu tur oynanan kart sayısı (yalnız gösterim). Sahibinin tur başında 0 olur; kart çözüldükten sonra artar. */
  cardsPlayedThisTurn: number;
  statuses: Status[];
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  turnsTaken: number;
  reshufflesLeft: number;
  fatigueCount: number;
}

export type EndReason = 'normalDamage' | 'fatigue' | 'arenaCollapse' | 'roundCap';

export interface BattleResult {
  /** null = berabere */
  winner: PlayerIndex | null;
  reason: EndReason;
}

export interface BattleState {
  config: BattleConfig;
  cards: Record<string, CardDef>;
  rng: number;
  round: number;
  active: PlayerIndex;
  firstPlayer: PlayerIndex;
  players: [PlayerState, PlayerState];
  result: BattleResult | null;
}

export type Action =
  | { type: 'PLAY_CARD'; player: PlayerIndex; iid: string }
  | { type: 'END_TURN'; player: PlayerIndex };

export type DamageSource = PlayerIndex | 'arena' | 'fatigue' | 'poison';

export type BattleEvent =
  | { type: 'BATTLE_STARTED'; firstPlayer: PlayerIndex; seed: number }
  | { type: 'TURN_STARTED'; player: PlayerIndex; round: number; maxMp: number }
  | { type: 'SHIELD_EXPIRED'; player: PlayerIndex; amount: number }
  | { type: 'CARD_DRAWN'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'CARD_BURNED'; player: PlayerIndex; iid: string; cardId: string }
  | { type: 'DECK_RESHUFFLED'; player: PlayerIndex; count: number; reshufflesLeft: number }
  | { type: 'CARD_PLAYED'; player: PlayerIndex; iid: string; cardId: string; cost: number }
  | {
      type: 'DAMAGE_DEALT';
      source: DamageSource;
      target: PlayerIndex;
      amount: number;
      absorbed: number;
    }
  | { type: 'SHIELD_GAINED'; player: PlayerIndex; amount: number }
  | { type: 'HEALED'; player: PlayerIndex; amount: number }
  | {
      type: 'STATUS_APPLIED';
      player: PlayerIndex;
      status: StatusId;
      amount: number;
      duration: number | null;
    }
  | { type: 'STATUS_IGNORED'; player: PlayerIndex; status: StatusId; amount: number }
  | { type: 'STATUS_EXPIRED'; player: PlayerIndex; status: StatusId }
  | { type: 'MP_GAINED'; player: PlayerIndex; amount: number }
  /** Güç harcandı: `amount` toplam eklenen değer (çarpan dahil); çarpan > 1 ise Hell Blade kombosu. */
  | { type: 'STRENGTH_USED'; player: PlayerIndex; amount: number; multiplier: number }
  | { type: 'CRIT_USED'; player: PlayerIndex }
  | { type: 'EVADED'; player: PlayerIndex; attacker: PlayerIndex }
  | { type: 'TURN_ENDED'; player: PlayerIndex; unusedMp: number }
  | { type: 'BATTLE_ENDED'; winner: PlayerIndex | null; round: number; reason: EndReason };

export interface BattleSetup {
  config: BattleConfig;
  cards: CardDef[];
  decks: [string[], string[]];
  names: [string, string];
  seed: number;
}

export interface ApplyResult {
  state: BattleState;
  events: BattleEvent[];
}
