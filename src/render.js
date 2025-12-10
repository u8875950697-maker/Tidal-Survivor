import { gameState, player } from './state.js';

function renderBackground(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, gameState.height);
  gradient.addColorStop(0, '#0b132b');
  gradient.addColorStop(1, '#0a1a2f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gameState.width, gameState.height);
}

function renderPlayer(ctx) {
  ctx.save();
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderEnemies(ctx) {
  ctx.fillStyle = '#f87171';
  for (const enemy of gameState.enemies) {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderBullets(ctx) {
  ctx.fillStyle = '#e5e7eb';
  for (const bullet of gameState.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderXpOrbs(ctx) {
  ctx.fillStyle = '#22c55e';
  for (const orb of gameState.xpOrbs) {
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderUI(ctx) {
  ctx.fillStyle = '#e5e7eb';
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`HP: ${Math.ceil(player.hp)} / ${player.maxHp}`, 16, 28);
  ctx.fillText(
    `Level: ${player.level} | XP: ${Math.floor(player.currentXP)} / ${player.xpToNext}`,
    16,
    52
  );

  ctx.textAlign = 'right';
  ctx.fillText(`Time: ${gameState.time.toFixed(1)}s`, gameState.width - 16, 28);

  if (gameState.isGameOver) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef2f2';
    ctx.font = '48px "Segoe UI", sans-serif';
    ctx.fillText('GAME OVER', gameState.width / 2, gameState.height / 2);
  }
}

export function renderScene(ctx) {
  renderBackground(ctx);
  renderXpOrbs(ctx);
  renderBullets(ctx);
  renderEnemies(ctx);
  renderPlayer(ctx);
  renderUI(ctx);
}
