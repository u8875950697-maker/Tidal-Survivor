const BULLET_RADIUS = 4;
const XP_ORB_RADIUS = 8;

const ENEMY_TYPES = {
  chaser: {
    radius: 18,
    speedRange: [80, 130],
    hp: 50,
    xp: 6,
  },
  tank: {
    radius: 26,
    speedRange: [50, 80],
    hp: 120,
    xp: 12,
  },
};

export function createBullet(x, y, speed, damage) {
  return {
    x,
    y,
    vx: 0,
    vy: -speed,
    radius: BULLET_RADIUS,
    damage,
  };
}

export function createEnemy(spawnX, spawnY, type) {
  const config = ENEMY_TYPES[type] || ENEMY_TYPES.chaser;
  const [minSpeed, maxSpeed] = config.speedRange;
  return {
    x: spawnX,
    y: spawnY,
    type,
    radius: config.radius,
    speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
    hp: config.hp,
    maxHp: config.hp,
    xpValue: config.xp,
  };
}

export function createXpOrb(x, y, value) {
  return {
    x,
    y,
    radius: XP_ORB_RADIUS,
    value,
  };
}
