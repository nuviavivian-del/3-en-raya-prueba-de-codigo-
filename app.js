// app.js

// Seleccionamos todas las celdas y el tablero
const cells = document.querySelectorAll(".cell");
const board = document.getElementById("board");

// Jugadores
const PLAYER = "X";   // tú
const COMPUTER = "O"; // computador

// Estado inicial del tablero (array de 9 posiciones)
let gameState = ["", "", "", "", "", "", "", "", ""];

// Combinaciones ganadoras
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6]             // diagonales
];

// Función: verificar ganador
function checkWinner(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => gameState[index] === player);
  });
}

// Función: tablero lleno
function isBoardFull() {
  return gameState.every(cell => cell !== "");
}

// Evento: clic del jugador
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameState[index] === "" && !checkWinner(PLAYER) && !checkWinner(COMPUTER)) {
      makeMove(index, PLAYER);
      if (!checkWinner(PLAYER) && !isBoardFull()) {
        setTimeout(computerMove, 500); // pequeña pausa para simular turno
      }
    }
  });
});

// Función: hacer movimiento
function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    setTimeout(() => alert(`${player} gana!`), 100);
  } else if (isBoardFull()) {
    setTimeout(() => alert("¡Empate!"), 100);
  }
}

// Función: movimiento del computador (elige celda vacía al azar)
function computerMove() {
  let emptyIndices = gameState
    .map((val, idx) => (val === "" ? idx : null))
    .filter(val => val !== null);

  let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, COMPUTER);
}
