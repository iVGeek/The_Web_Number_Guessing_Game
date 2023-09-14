// Initialize game variables
let leaderboard = [];
let currentLevel;
let secretNumber;
let attemptsLeft;
let currentPlayer = 1;
let player1Name;
let player2Name;

// Define game levels
class GameLevel {
    constructor(name, min, max, maxAttempts, color) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.maxAttempts = maxAttempts;
        this.color = color;
    }
}

// Function to display the welcome screen
function displayWelcomeScreen() {
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = "Welcome to Guess the Number!";

    const modeSelect = document.getElementById('mode-select');
    modeSelect.style.display = 'block';

    const playerInfo = document.getElementById('player-info');
    playerInfo.style.display = 'none';

    const gameElements = document.getElementById('game-elements');
    gameElements.style.display = 'none';

    const leaderboardSection = document.getElementById('leaderboard');
    leaderboardSection.style.display = 'none';

    const clearLeaderboardButton = document.getElementById('clear-leaderboard');
    clearLeaderboardButton.addEventListener('click', clearLeaderboard);
}

// Function to select a game mode (Single or Multiplayer)
function selectGameMode() {
    const singlePlayerButton = document.getElementById('single-player');
    const multiplayerButton = document.getElementById('multiplayer');

    singlePlayerButton.addEventListener('click', () => {
        currentPlayer = 1;
        player1Name = prompt("Enter your name (Player 1):");
        startGame();
    });

    multiplayerButton.addEventListener('click', () => {
        currentPlayer = 1;
        player1Name = prompt("Enter Player 1 name:");
        player2Name = prompt("Enter Player 2 name:");
        startGame();
    });
}

// Function to start the game
function startGame() {
    const modeSelect = document.getElementById('mode-select');
    modeSelect.style.display = 'none';

    const playerInfo = document.getElementById('player-info');
    playerInfo.style.display = 'none';

    const gameElements = document.getElementById('game-elements');
    gameElements.style.display = 'block';

    const leaderboardSection = document.getElementById('leaderboard');
    leaderboardSection.style.display = 'none';

    secretNumber = generateRandomNumber(currentLevel.min, currentLevel.max);
    attemptsLeft = currentLevel.maxAttempts;

    const gameTitle = document.getElementById('game-title');
    gameTitle.textContent = 'Guess the Number';

    const messageElement = document.getElementById('message');
    messageElement.textContent = '';

    const attemptsLeftElement = document.getElementById('attempts-left');
    attemptsLeftElement.textContent = `Attempts left: ${attemptsLeft}`;
}

// Function to generate a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to handle user guesses
function handleGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < currentLevel.min || guess > currentLevel.max) {
        displayMessage('Invalid guess. Please enter a number between ' + currentLevel.min + ' and ' + currentLevel.max + '.');
        return;
    }

    attemptsLeft--;

    if (guess === secretNumber) {
        endGame(true);
    } else if (attemptsLeft === 0) {
        endGame(false);
    } else {
        displayMessage(guess < secretNumber ? 'Too low!' : 'Too high!');
        displayAttemptsLeft();
    }
}

// Function to end the game
function endGame(isWinner) {
    const messageElement = document.getElementById('message');
    if (isWinner) {
        messageElement.textContent = 'Congratulations! You guessed the number!';
        playSound('correct-sound');
        updateLeaderboard(currentPlayer === 1 ? player1Name : player2Name, currentLevel.maxAttempts - attemptsLeft);
    } else {
        messageElement.textContent = 'Game over. The number was ' + secretNumber + '.';
        playSound('gameover-sound');
    }

    const gameElements = document.getElementById('game-elements');
    gameElements.style.display = 'none';

    const leaderboardSection = document.getElementById('leaderboard');
    leaderboardSection.style.display = 'block';
    displayLeaderboard();
}

// Function to play sound effects
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

// Function to display a message to the user
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
}

// Function to display remaining attempts
function displayAttemptsLeft() {
    const attemptsLeftElement = document.getElementById('attempts-left');
    attemptsLeftElement.textContent = `Attempts left: ${attemptsLeft}`;
}

// Function to update the leaderboard
function updateLeaderboard(player, score) {
    leaderboard.push({ player, score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 5) {
        leaderboard.pop(); // Remove the lowest score if leaderboard size exceeds the maximum
    }
    displayLeaderboard();
}

// Function to display the leaderboard
function displayLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-table');
    const leaderboardRows = leaderboardTable.querySelectorAll('tr');
    
    // Clear previous leaderboard data
    for (let i = 1; i < leaderboardRows.length; i++) {
        leaderboardRows[i].remove();
    }

    // Populate the leaderboard
    for (let i = 0; i < leaderboard.length; i++) {
        const row = document.createElement('tr');
        const rank = document.createElement('td');
        const player = document.createElement('td');
        const score = document.createElement('td');

        rank.textContent = i + 1;
        player.textContent = leaderboard[i].player;
        score.textContent = leaderboard[i].score;

        row.appendChild(rank);
        row.appendChild(player);
        row.appendChild(score);

        leaderboardTable.appendChild(row);
    }
}

// Function to clear the leaderboard
function clearLeaderboard() {
    leaderboard = [];
    displayLeaderboard();
}

// Main menu
function main() {
    displayWelcomeScreen();
    selectGameMode();
}

// Call the main function when the page loads
window.onload = main;
