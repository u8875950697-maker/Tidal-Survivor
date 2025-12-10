import { gameState, inputState, player, resetPlayerPosition } from './state.js';
import { renderScene } from './render.js';
import { updateGame } from './systems.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let lastTimestamp = 0;

function resizeCanvas() {
  gameState.width = window.innerWidth;
  gameState.height = window.innerHeight;
  canvas.width = gameState.width;
  canvas.height = gameState.height;
  resetPlayerPosition();
}

function setupInput() {
  const keyMap = {
    KeyW: 'up',
    ArrowUp: 'up',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
  };

  window.addEventListener('keydown', (e) => {
    const dir = keyMap[e.code];
    if (dir) {
      inputState[dir] = true;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    const dir = keyMap[e.code];
    if (dir) {
      inputState[dir] = false;
      e.preventDefault();
    }
  });
}

function init() {
  resizeCanvas();
  setupInput();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  const dt = (timestamp - lastTimestamp) / 1000 || 0;
  lastTimestamp = timestamp;

  updateGame(dt);
  renderScene(ctx, gameState);

  requestAnimationFrame(gameLoop);
}

init();
