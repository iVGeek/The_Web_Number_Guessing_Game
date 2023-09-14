const toggleThemeButton = document.getElementById('toggle-theme');
const body = document.body;
const container = document.querySelector('.container');
const leaderboardList = document.getElementById('leaderboard-list');
const gameControls = document.getElementById('game-controls');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const attemptsLeft = document.getElementById('attempts-left');
const gameModeSelect = document.getElementById('game-mode-select');
const player1Input = document.getElementById('player1-input');
const player2Input = document.getElementById('player2-input');
const playerNameDisplay = document.getElementById('player-name-display');

toggleThemeButton.addEventListener('click', toggleTheme);
guessButton.addEventListener('click', makeGuess);
gameModeSelect.addEventListener('change', selectGameMode);

let darkMode = false;
let gameMode = 'single';
let currentPlayer = 'Player 1';
let targetNumber;
let guessCount = 0;
let maxAttempts = 0;
let attempts = 0;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

function toggleTheme() {
    darkMode = !darkMode;
    const theme = darkMode ? 'dark' : 'light';
    body.className = theme;
    container.className = theme;
    leaderboardList.className = theme;
    gameControls.className = theme;
    guessInput.className = theme;
    guessButton.className = theme;
    attemptsLeft.className = theme;
    gameModeSelect.className = theme;
    playerNameDisplay.className = theme;
    updateThemeButtonText();
}

function updateThemeButtonText() {
    toggleThemeButton.textContent = darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}

function selectGameMode() {
    gameMode = gameModeSelect.value;
    resetGame();
}

function initializeGame() {
    guessCount = 0;
    attempts = maxAttempts;
    targetNumber = Math.floor(Math.random() * 100) + 1;
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.value = '';
    updateAttemptsLeft();
    if (gameMode === 'single' && currentPlayer === player2Name) {
        setTimeout(makeAIGuess, 1000); // Simulate AI's guess after a delay
    }
}

function makeGuess() {
    const guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('Please enter a valid number between 1 and 100.');
        return;
    }

    guessCount++;
    attempts--;

    if (guess < targetNumber) {
        alert('Too low! Try again.');
    } else if (guess > targetNumber) {
        alert('Too high! Try again.');
    } else {
        handleWin();
        return;
    }

    if (attempts === 0) {
        handleLoss();
        return;
    }

    guessInput.value = '';
    updateAttemptsLeft();
    if (gameMode === 'single' && currentPlayer === player2Name) {
        setTimeout(makeAIGuess, 1000); // Simulate AI's guess after a delay
    }
}

function makeAIGuess() {
    const aiGuess = Math.floor(Math.random() * 100) + 1;
    guessInput.value = aiGuess;
    makeGuess();
}

function handleWin() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    const message = `${currentPlayer} wins! You guessed the number in ${guessCount} tries.`;
    alert(message);

    updateLeaderboard(currentPlayer, guessCount);
    displayLeaderboard();

    if (gameMode === 'single') {
        currentPlayer = player1Name;
    } else {
        currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
    }

    initializeGame();
}

function handleLoss() {
    guessInput.disabled = true;
    guessButton.disabled = true;
    alert(`Game over! The correct number was ${targetNumber}.`);
    initializeGame();
}

function updateAttemptsLeft() {
    attemptsLeft.textContent = `Attempts left: ${attempts}`;
}

function updateLeaderboard(player, score) {
    const leaderboardEntry = { player, score };
    leaderboard.push(leaderboardEntry);
    leaderboard.sort((a, b) => a.score - b.score);
    if (leaderboard.length > 5) {
        leaderboard.pop();
    }
}

function displayLeaderboard() {
    leaderboardList.innerHTML = '';
    for (let i = leaderboard.length - 1; i >= 0; i--) {
        const entry = leaderboard[i];
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.player}: ${entry.score} tries`;
        leaderboardList.appendChild(listItem);
    }
}

function resetGame() {
    if (gameMode === 'single') {
        currentPlayer = player1Name;
    } else {
        currentPlayer = player1Name;
        playerNameDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    maxAttempts = gameMode === 'single' ? 8 : 10;
    updateAttemptsLeft();
    initializeGame();
}

function init() {
    toggleTheme();
    selectGameMode();
    playerNameDisplay.textContent = `Current Player: ${currentPlayer}`;
    resetGame();
}

init();
