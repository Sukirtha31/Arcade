const startOverlay = document.getElementById("startOverlay");
let gameStarted = false;
const game = document.getElementById("game");
const ship = document.getElementById("ship");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let shipX = window.innerWidth / 2 - 30;
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let keys = {};
let lastShotTime = 0;

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function moveShip() {
  if (keys["ArrowLeft"]) shipX = Math.max(0, shipX - 7);
  if (keys["ArrowRight"]) shipX = Math.min(game.offsetWidth - 60, shipX + 7);
  ship.style.left = shipX + "px";
}

function shoot() {
  const now = Date.now();
  if (keys["Space"] && now - lastShotTime > 250) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = shipX + 28 + "px";
    bullet.style.bottom = "100px";
    game.appendChild(bullet);
    bullets.push(bullet);
    lastShotTime = now;
  }
}

function createEnemy() {
  if (gameOver) return;
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  const randX = Math.floor(Math.random() * (game.offsetWidth - 40));
  enemy.style.left = randX + "px";
  enemy.style.top = "0px";
  game.appendChild(enemy);
  enemies.push(enemy);
}

function updateGame() {
  if (gameOver) return;

  moveShip();
  shoot();

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    let bottom = parseInt(b.style.bottom);
    if (bottom > game.offsetHeight) {
      b.remove();
      bullets.splice(i, 1);
    } else {
      b.style.bottom = bottom + 12 + "px";
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    let top = parseInt(e.style.top);
    if (top > game.offsetHeight - 60) {
      endGame();
      return;
    } else {
      e.style.top = top + 2 + "px";
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      const bx = b.getBoundingClientRect();
      const ex = e.getBoundingClientRect();

      if (
        bx.left < ex.right &&
        bx.right > ex.left &&
        bx.top < ex.bottom &&
        bx.bottom > ex.top
      ) {
        e.remove();
        b.remove();
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDisplay.textContent = score;
        break;
      }
    }
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  alert("💥 Game Over, Elion!\nFinal Score: " + score);
  setTimeout(() => {
    restartBtn.style.display = "inline-block";
  }, 100);
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startOverlay.style.display = "none";
  setInterval(createEnemy, 1500);
  requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", startGame);

