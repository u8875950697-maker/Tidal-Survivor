export const inputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export const player = {
  x: 0,
  y: 0,
  radius: 18,
  speed: 220,
  hp: 100,
  maxHp: 100,
  baseDamage: 15,
  damageMultiplier: 1,
  fireRate: 3,
  fireCooldown: 0,
  level: 1,
  currentXP: 0,
  xpToNext: 20,
};

export const gameState = {
  width: window.innerWidth,
  height: window.innerHeight,
  time: 0,
  isGameOver: false,
  enemies: [],
  bullets: [],
  xpOrbs: [],
  enemySpawnTimer: 0,
  enemySpawnInterval: 2.0,
  enemySpawnIntervalMin: 0.5,
};

export function resetPlayerPosition() {
  player.x = gameState.width / 2;
  player.y = gameState.height / 2;
}
