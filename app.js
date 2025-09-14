const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'GB'; // GB = jugador, GN = PC
let gameState = Array(9).fill(null);

// Rutas correctas de las imágenes
const images = {
  GB: 'imagenes/GB.jpeg', // gato blanco
  GN: 'imagenes/GN.jpeg'  // gato negro
};

// Verifica si hay un ganador o empate
function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }
  return gameState.includes(null) ? null : 'Empate';
}

// Renderiza una celda con la imagen correspondiente
function renderCell(index) {
  const cell = cells[index];
  cell.innerHTML = '';
  if (gameState[index]) {
    const img = document.createElement('img');
    img.src = images[gameState[index]];
    img.alt = gameState[index];
    img.style.width = '80px';
    img.style.height = '80px';
    cell.appendChild(img);
  }
}

// Realiza un movimiento
function makeMove(index) {
  if (gameState[index] || checkWinner()) return;

  gameState[index] = currentPlayer;
  renderCell(index);

  const winner = checkWinner();
  if (winner) {
    status.textContent = winner === 'Empate' ? '¡Empate!' : `¡Ganó ${winner}!`;
    return;
  }

  currentPlayer = currentPlayer === 'GB' ? 'GN' : 'GB';
  status.textContent = `Turno: ${currentPlayer === 'GB' ? 'GB (tú)' : 'GN (PC)'}`;

  // Movimiento automático del PC
  if (currentPlayer === 'GN') {
    const emptyCells = gameState.map((v,i) => v===null ? i : null).filter(v => v!==null);
    const pcMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(pcMove);
  }
}

// Eventos de clic en celdas
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (currentPlayer === 'GB') makeMove(index);
  });
});

// Reiniciar juego
resetBtn.addEventListener('click', () => {
  gameState = Array(9).fill(null);
  cells.forEach(cell => cell.innerHTML = '');
  currentPlayer = 'GB';
  status.textContent = 'Turno: GB (tú)';
});
