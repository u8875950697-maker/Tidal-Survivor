export const inputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export const RUN_DURATION = 540; // 9 minutes

const PLAYER_START_HP = 100;
const PLAYER_START_SPEED = 220;
const PLAYER_BASE_DAMAGE = 15;
const PLAYER_FIRE_RATE = 3;
const PLAYER_RADIUS = 18;

export const player = {
  x: 0,
  y: 0,
  radius: PLAYER_RADIUS,
  speed: PLAYER_START_SPEED,
  hp: PLAYER_START_HP,
  maxHp: PLAYER_START_HP,
  baseDamage: PLAYER_BASE_DAMAGE,
  damageMultiplier: 1,
  fireRate: PLAYER_FIRE_RATE,
  fireCooldown: 0,
  level: 1,
  currentXP: 0,
  xpToNext: 20,
};

export const gameState = {
  width: window.innerWidth,
  height: window.innerHeight,
  time: 0,
  runDuration: RUN_DURATION,
  isGameOver: false,
  isVictory: false,
  enemies: [],
  bullets: [],
  xpOrbs: [],
  enemySpawnTimer: 0,
  enemySpawnInterval: 1.2,
  enemySpawnIntervalMin: 0.4,
};

export function resetPlayerPosition() {
  player.x = gameState.width / 2;
  player.y = gameState.height / 2;
}
