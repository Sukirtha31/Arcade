let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

const statusText = document.getElementById("status");
const boardContainer = document.getElementById("board");

function drawBoard() {
  boardContainer.innerHTML = "";
  board.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", () => makeMove(index));
    boardContainer.appendChild(cellDiv);
  });
}

function makeMove(index) {
  if (board[index] || gameOver) return;
  board[index] = currentPlayer;
  checkWinner();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (!gameOver) statusText.textContent = `Player ${currentPlayer}'s turn`;
  drawBoard();
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `Player ${board[a]} wins!`;
      gameOver = true;
      return;
    }
  }
  if (!board.includes("")) {
    statusText.textContent = "It's a draw!";
    gameOver = true;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  drawBoard();
}

drawBoard();
