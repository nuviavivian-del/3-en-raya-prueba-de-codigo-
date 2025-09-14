// app.js
const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const PLAYER = "GB";   // gato blanco (tú)
const COMPUTER = "GN"; // gato negro (PC)

let gameState = ["","","","","","","","",""];
let gameOver = false;

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderCell(index){
  const val = gameState[index];
  const el = cells[index];
  if(!val){
    el.innerHTML = "";
  } else if(val === PLAYER){
    el.innerHTML = '<img src="images/gb.png" alt="GB">';
  } else if(val === COMPUTER){
    el.innerHTML = '<img src="images/gn.png" alt="GN">';
  }
}

function checkWinner(player){
  return winningCombinations.some(combo =>
    combo.every(i => gameState[i] === player)
  );
}

function isBoardFull(){
  return gameState.every(c => c !== "");
}

function updateStatus(text){
  statusEl.textContent = text;
}

function makeMove(index, player){
  if(gameOver || gameState[index]) return;
  gameState[index] = player;
  renderCell(index);

  if(checkWinner(player)){
    gameOver = true;
    updateStatus(player === PLAYER ? "¡Ganaste, GB!" : "Gana la PC (GN)");
    highlightWinning(player);
    return;
  }
  if(isBoardFull()){
    gameOver = true;
    updateStatus("¡Empate!");
    return;
  }

  updateStatus(player === PLAYER ? "Turno: GN (PC)" : "Turno: GB (tú)");
}

function highlightWinning(player){
  const combo = winningCombinations.find(c => c.every(i => gameState[i] === player));
  if(!combo) return;
  combo.forEach(i => cells[i].classList.add("win"));
}

/* simple IA: intenta ganar, si no bloquea, si no toma centro, si no aleatorio */
function computerMove(){
  if(gameOver) return;

  const empty = gameState.map((v,i) => v === "" ? i : null).filter(v => v !== null);
  if(empty.length === 0) return;

  // 1) intentar ganar
  for(const idx of empty){
    const copy = [...gameState];
    copy[idx] = COMPUTER;
    if(winsWith(copy, COMPUTER)){
      makeMove(idx, COMPUTER);
      return;
    }
  }

  // 2) bloquear al jugador
  for(const idx of empty){
    const copy = [...gameState];
    copy[idx] = PLAYER;
    if(winsWith(copy, PLAYER)){
      makeMove(idx, COMPUTER);
      return;
    }
  }

  // 3) tomar centro si está libre
  if(gameState[4] === ""){
    makeMove(4, COMPUTER);
    return;
  }

  // 4) esquina aleatoria
  const corners = empty.filter(i => [0,2,6,8].includes(i));
  if(corners.length){
    const pick = corners[Math.floor(Math.random()*corners.length)];
    makeMove(pick, COMPUTER);
    return;
  }

  // 5) al azar
  const pick = empty[Math.floor(Math.random()*empty.length)];
  makeMove(pick, COMPUTER);
}

function winsWith(boardArr, player){
  return winningCombinations.some(combo => combo.every(i => boardArr[i] === player));
}

/* listeners */
cells.forEach((cell, idx) => {
  cell.addEventListener("click", () => {
    if(gameOver) return;
    if(gameState[idx] !== "") return; // ya ocupado
    makeMove(idx, PLAYER);

    // turno PC
    if(!gameOver){
      setTimeout(() => computerMove(), 450);
    }
  });
});

resetBtn.addEventListener("click", resetGame);

function resetGame(){
  gameState = ["","","","","","","","",""];
  gameOver = false;
  cells.forEach(c => { c.innerHTML = ""; c.classList.remove("win"); });
  updateStatus("Turno: GB (tú)");
}
