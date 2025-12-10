export function createBullet(x, y, speed, damage) {
  return {
    x,
    y,
    vx: 0,
    vy: -speed,
    radius: 4,
    damage,
  };
}

export function createEnemy(spawnX, spawnY) {
  return {
    x: spawnX,
    y: spawnY,
    radius: 18,
    speed: 80 + Math.random() * 50,
    hp: 50,
    maxHp: 50,
  };
}

export function createXpOrb(x, y) {
  return {
    x,
    y,
    radius: 8,
    value: 6,
  };
}
