import { createBullet, createEnemy, createXpOrb } from './entities.js';
import { gameState, inputState, player } from './state.js';

const PLAYER_FIRE_SPEED = 400;
const ENEMY_CONTACT_DAMAGE = 15;
const BULLET_DESPAWN_MARGIN = 20;
const ORB_MAGNET_RANGE = 150;
const ORB_PULL_SPEED = 120;
const SPAWN_INTERVAL_START = 1.2;
const SPAWN_INTERVAL_MIN = 0.4;
const SPAWN_DECAY = 0.08;
const SPAWN_DECAY_PERIOD = 20;
const TANK_INTRO_TIME = 60;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function circleCollides(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const radii = a.radius + b.radius;
  return dx * dx + dy * dy <= radii * radii;
}

function setVictory() {
  gameState.isVictory = true;
  gameState.enemies.length = 0;
  gameState.enemySpawnTimer = 0;
}

function spawnEnemy(type) {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  switch (side) {
    case 0:
      x = Math.random() * gameState.width;
      y = -30;
      break;
    case 1:
      x = gameState.width + 30;
      y = Math.random() * gameState.height;
      break;
    case 2:
      x = Math.random() * gameState.width;
      y = gameState.height + 30;
      break;
    default:
      x = -30;
      y = Math.random() * gameState.height;
      break;
  }
  gameState.enemies.push(createEnemy(x, y, type));
}

function selectEnemyType() {
  if (gameState.time < TANK_INTRO_TIME) return 'chaser';
  const extraTankChance = Math.min(0.3, (gameState.time - TANK_INTRO_TIME) / 240 * 0.3);
  const tankChance = 0.3 + extraTankChance;
  return Math.random() < tankChance ? 'tank' : 'chaser';
}

export function updateGame(dt) {
  if (!gameState.isGameOver && !gameState.isVictory) {
    gameState.time += dt;
    if (gameState.time >= gameState.runDuration) {
      setVictory();
    }
  }

  updatePlayer(dt);
  updateBullets(dt);
  updateEnemies(dt);
  updateBulletEnemyCollisions();
  updateXpOrbs(dt);
  updateSpawning(dt);
}

export function updatePlayer(dt) {
  if (gameState.isGameOver) return;
  let moveX = 0;
  let moveY = 0;
  if (inputState.up) moveY -= 1;
  if (inputState.down) moveY += 1;
  if (inputState.left) moveX -= 1;
  if (inputState.right) moveX += 1;

  const length = Math.hypot(moveX, moveY) || 1;
  moveX /= length;
  moveY /= length;

  player.x += moveX * player.speed * dt;
  player.y += moveY * player.speed * dt;

  player.x = clamp(player.x, player.radius, gameState.width - player.radius);
  player.y = clamp(player.y, player.radius, gameState.height - player.radius);

  player.fireCooldown -= dt;
  const fireInterval = 1 / player.fireRate;
  if (player.fireCooldown <= 0) {
    player.fireCooldown = fireInterval;
    const damage = player.baseDamage * player.damageMultiplier;
    gameState.bullets.push(createBullet(player.x, player.y - player.radius, PLAYER_FIRE_SPEED, damage));
  }
}

export function updateBullets(dt) {
  for (let i = gameState.bullets.length - 1; i >= 0; i--) {
    const bullet = gameState.bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    if (
      bullet.x < -BULLET_DESPAWN_MARGIN ||
      bullet.x > gameState.width + BULLET_DESPAWN_MARGIN ||
      bullet.y < -BULLET_DESPAWN_MARGIN ||
      bullet.y > gameState.height + BULLET_DESPAWN_MARGIN
    ) {
      gameState.bullets.splice(i, 1);
    }
  }
}

export function updateEnemies(dt) {
  if (gameState.isVictory || gameState.isGameOver) return;
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / dist) * enemy.speed * dt;
    enemy.y += (dy / dist) * enemy.speed * dt;

    if (circleCollides(enemy, player)) {
      player.hp -= ENEMY_CONTACT_DAMAGE;
      gameState.enemies.splice(i, 1);
      if (player.hp <= 0) {
        player.hp = 0;
        gameState.isGameOver = true;
      }
    }
  }
}

export function updateBulletEnemyCollisions() {
  if (gameState.isVictory) return;
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    for (let j = gameState.bullets.length - 1; j >= 0; j--) {
      const bullet = gameState.bullets[j];
      if (circleCollides(enemy, bullet)) {
        enemy.hp -= bullet.damage;
        gameState.bullets.splice(j, 1);
        if (enemy.hp <= 0) {
          gameState.enemies.splice(i, 1);
          gameState.xpOrbs.push(createXpOrb(enemy.x, enemy.y, enemy.xpValue));
        }
        break;
      }
    }
  }
}

export function updateXpOrbs(dt) {
  for (let i = gameState.xpOrbs.length - 1; i >= 0; i--) {
    const orb = gameState.xpOrbs[i];
    const dx = player.x - orb.x;
    const dy = player.y - orb.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < ORB_MAGNET_RANGE) {
      orb.x += (dx / dist) * ORB_PULL_SPEED * dt;
      orb.y += (dy / dist) * ORB_PULL_SPEED * dt;
    }

    if (circleCollides(orb, player)) {
      addXp(orb.value);
      gameState.xpOrbs.splice(i, 1);
    }
  }
}

function addXp(amount) {
  player.currentXP += amount;
  while (player.currentXP >= player.xpToNext) {
    player.currentXP -= player.xpToNext;
    player.level += 1;
    player.xpToNext = Math.ceil(player.xpToNext * 1.4);
    player.damageMultiplier *= 1.2;
  }
}

export function updateSpawning(dt) {
  if (gameState.isVictory || gameState.isGameOver) return;

  const steps = Math.floor(gameState.time / SPAWN_DECAY_PERIOD);
  const targetInterval = clamp(
    SPAWN_INTERVAL_START - steps * SPAWN_DECAY,
    SPAWN_INTERVAL_MIN,
    SPAWN_INTERVAL_START
  );
  gameState.enemySpawnInterval = targetInterval;

  gameState.enemySpawnTimer += dt;
  if (gameState.enemySpawnTimer >= gameState.enemySpawnInterval) {
    gameState.enemySpawnTimer -= gameState.enemySpawnInterval;
    spawnEnemy(selectEnemyType());
  }
}
