const cells = [...document.querySelectorAll(".cell")];
const statusMessage = document.querySelector("#status-message");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const playerXCard = document.querySelector("#player-x-card");
const playerOCard = document.querySelector("#player-o-card");
const newGameButton = document.querySelector("#new-game");
const resetScoresButton = document.querySelector("#reset-scores");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0 };

function setActivePlayer(player) {
  playerXCard.classList.toggle("is-active", player === "X");
  playerOCard.classList.toggle("is-active", player === "O");
}

function finishRound(winner, winningLine) {
  gameOver = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (winner) {
    winningLine.forEach((index) => cells[index].classList.add("is-winning"));
    scores[winner] += 1;
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    statusMessage.textContent = `Player ${winner} wins!`;
    setActivePlayer(winner);
    return;
  }

  statusMessage.textContent = "It's a draw!";
  playerXCard.classList.remove("is-active");
  playerOCard.classList.remove("is-active");
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);

  if (gameOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(`mark-${currentPlayer.toLowerCase()}`);
  cell.disabled = true;
  cell.setAttribute(
    "aria-label",
    `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`,
  );

  const winningLine = winningLines.find((line) =>
    line.every((lineIndex) => board[lineIndex] === currentPlayer),
  );

  if (winningLine) {
    finishRound(currentPlayer, winningLine);
    return;
  }

  if (board.every(Boolean)) {
    finishRound(null, []);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
  setActivePlayer(currentPlayer);
}

function startNewRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusMessage.textContent = "Player X's turn";
  setActivePlayer(currentPlayer);

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "is-winning");
    cell.setAttribute(
      "aria-label",
      `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`,
    );
  });
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
newGameButton.addEventListener("click", startNewRound);
resetScoresButton.addEventListener("click", () => {
  scores = { X: 0, O: 0 };
  scoreX.textContent = "0";
  scoreO.textContent = "0";
  startNewRound();
});
