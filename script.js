// Game State
const state = {
    p1Name: "",
    p2Name: "",
    scores: { x: 0, o: 0, draw: 0 },
    currentPlayer: 'X',
    board: Array(9).fill(null),
    gameActive: false
};

// Winning Combinations (Indices)
const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const boardEl = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');

// Inputs & Score Displays
const inputP1 = document.getElementById('playerX');
const inputP2 = document.getElementById('playerO');
const displayP1 = document.getElementById('nameX');
const displayP2 = document.getElementById('nameO');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');

// --- EVENT LISTENERS ---

document.getElementById('startGameBtn').addEventListener('click', () => {
    state.p1Name = inputP1.value || "Player 1";
    state.p2Name = inputP2.value || "Player 2";
    
    // Update UI
    displayP1.innerText = state.p1Name;
    displayP2.innerText = state.p2Name;
    
    // Switch Screens
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    startGame();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    location.reload(); // Simple reload to reset everything
});

restartBtn.addEventListener('click', startGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// --- GAME LOGIC ---

function startGame() {
    state.board.fill(null);
    state.gameActive = true;
    state.currentPlayer = 'X';
    restartBtn.classList.add('hidden');
    
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o');
    });
    
    updateStatus();
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    // Ignore if cell filled or game over
    if (state.board[index] || !state.gameActive) return;

    // Update State
    state.board[index] = state.currentPlayer;
    e.target.innerText = state.currentPlayer;
    e.target.classList.add(state.currentPlayer.toLowerCase());

    // Check Win/Draw
    if (checkWin()) {
        endGame(false); // false = not a draw (someone won)
    } else if (checkImpossibleWin()) {
        endGame(true); // true = draw
    } else {
        // Switch Turn
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function updateStatus() {
    const name = state.currentPlayer === 'X' ? state.p1Name : state.p2Name;
    statusText.innerText = `${name}'s Turn (${state.currentPlayer})`;
}

function checkWin() {
    return WIN_LINES.some(combination => {
        return combination.every(index => {
            return state.board[index] === state.currentPlayer;
        });
    });
}

// "Smart" Draw Detection
// Returns TRUE if there is NO possible way for anyone to win anymore
function checkImpossibleWin() {
    // 1. If board is full, it's definitely a draw
    if (!state.board.includes(null)) return true;

    // 2. Check if all 8 lines are "dead"
    // A line is dead if it contains BOTH 'X' and 'O'
    const allLinesDead = WIN_LINES.every(line => {
        const cellValues = line.map(index => state.board[index]);
        const hasX = cellValues.includes('X');
        const hasO = cellValues.includes('O');
        return hasX && hasO;
    });

    return allLinesDead;
}

function endGame(isDraw) {
    state.gameActive = false;
    restartBtn.classList.remove('hidden');

    if (isDraw) {
        statusText.innerText = "Game Over: It's a Draw!";
        state.scores.draw++;
        scoreDraw.innerText = state.scores.draw;
    } else {
        const winnerName = state.currentPlayer === 'X' ? state.p1Name : state.p2Name;
        statusText.innerText = `🎉 ${winnerName} Wins! 🎉`;
        
        if (state.currentPlayer === 'X') {
            state.scores.x++;
            scoreX.innerText = state.scores.x;
        } else {
            state.scores.o++;
            scoreO.innerText = state.scores.o;
        }
    }
              }

