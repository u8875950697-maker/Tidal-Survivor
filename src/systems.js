import { createBullet, createEnemy, createXpOrb } from './entities.js';
import { gameState, inputState, player } from './state.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function circleCollides(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const radii = a.radius + b.radius;
  return dx * dx + dy * dy <= radii * radii;
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  switch (side) {
    case 0: // top
      x = Math.random() * gameState.width;
      y = -30;
      break;
    case 1: // right
      x = gameState.width + 30;
      y = Math.random() * gameState.height;
      break;
    case 2: // bottom
      x = Math.random() * gameState.width;
      y = gameState.height + 30;
      break;
    case 3: // left
      x = -30;
      y = Math.random() * gameState.height;
      break;
  }
  gameState.enemies.push(createEnemy(x, y));
}

export function updateGame(dt) {
  if (gameState.isGameOver) return;
  gameState.time += dt;
  updatePlayer(dt);
  updateBullets(dt);
  updateEnemies(dt);
  updateBulletEnemyCollisions();
  updateXpOrbs(dt);
  updateSpawning(dt);
}

export function updatePlayer(dt) {
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
    gameState.bullets.push(createBullet(player.x, player.y - player.radius, 400, damage));
  }
}

export function updateBullets(dt) {
  for (let i = gameState.bullets.length - 1; i >= 0; i--) {
    const bullet = gameState.bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    if (
      bullet.x < -10 ||
      bullet.x > gameState.width + 10 ||
      bullet.y < -20 ||
      bullet.y > gameState.height + 20
    ) {
      gameState.bullets.splice(i, 1);
    }
  }
}

export function updateEnemies(dt) {
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / dist) * enemy.speed * dt;
    enemy.y += (dy / dist) * enemy.speed * dt;

    if (circleCollides(enemy, player)) {
      player.hp -= 15;
      gameState.enemies.splice(i, 1);
      if (player.hp <= 0) {
        player.hp = 0;
        gameState.isGameOver = true;
      }
    }
  }
}

export function updateBulletEnemyCollisions() {
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    for (let j = gameState.bullets.length - 1; j >= 0; j--) {
      const bullet = gameState.bullets[j];
      if (circleCollides(enemy, bullet)) {
        enemy.hp -= bullet.damage;
        gameState.bullets.splice(j, 1);
        if (enemy.hp <= 0) {
          gameState.enemies.splice(i, 1);
          gameState.xpOrbs.push(createXpOrb(enemy.x, enemy.y));
        }
        break;
      }
    }
  }
}

export function updateXpOrbs(dt) {
  const magnetRange = 150;
  const pullSpeed = 120;
  for (let i = gameState.xpOrbs.length - 1; i >= 0; i--) {
    const orb = gameState.xpOrbs[i];
    const dx = player.x - orb.x;
    const dy = player.y - orb.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < magnetRange) {
      orb.x += (dx / dist) * pullSpeed * dt;
      orb.y += (dy / dist) * pullSpeed * dt;
    }

    if (circleCollides(orb, player)) {
      player.currentXP += orb.value;
      gameState.xpOrbs.splice(i, 1);
      checkLevelUp();
    }
  }
}

function checkLevelUp() {
  while (player.currentXP >= player.xpToNext) {
    player.currentXP -= player.xpToNext;
    player.level += 1;
    player.xpToNext = Math.ceil(player.xpToNext * 1.4);
    player.damageMultiplier *= 1.2;
  }
}

export function updateSpawning(dt) {
  gameState.enemySpawnTimer += dt;
  if (gameState.enemySpawnTimer >= gameState.enemySpawnInterval) {
    gameState.enemySpawnTimer = 0;
    spawnEnemy();
    gameState.enemySpawnInterval = clamp(
      gameState.enemySpawnInterval - 0.05,
      gameState.enemySpawnIntervalMin,
      10
    );
  }
}
