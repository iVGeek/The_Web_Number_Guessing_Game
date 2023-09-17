// Initialize game variables
let leaderboard = [];
let currentLevel;
let secretNumber;
let attemptsLeft;

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
    welcomeMessage.textContent = "Welcome to Guess the Number!\nGame developed by Your Name";
}

// Function to select a game level
function selectGameLevel() {
    const levelSelect = document.getElementById('level-dropdown');
    levelSelect.addEventListener('change', function () {
        const selectedLevel = levelSelect.value;
        switch (selectedLevel) {
            case 'easy':
                currentLevel = new GameLevel("Easy", 1, 10, 8, "green");
                break;
            case 'medium':
                currentLevel = new GameLevel("Medium", 1, 50, 6, "yellow");
                break;
            case 'hard':
                currentLevel = new GameLevel("Hard", 1, 100, 4, "red");
                break;
            default:
                currentLevel = new GameLevel("Medium", 1, 50, 4, "yellow");
                break;
        }
        startGame();
    });
}

// Function to start the game
function startGame() {
    secretNumber = generateRandomNumber(currentLevel.min, currentLevel.max);
    attemptsLeft = currentLevel.maxAttempts;
    const levelSelect = document.getElementById('level-select');
    const gameElements = document.getElementById('game-elements');
    levelSelect.style.display = 'none';
    gameElements.style.display = 'block';
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
    } else {
        messageElement.textContent = 'Game over. The number was ' + secretNumber + '.';
    }
    updateLeaderboard('Player Name', currentLevel.maxAttempts - attemptsLeft, currentLevel.name);
    const gameElements = document.getElementById('game-elements');
    gameElements.style.display = 'none';
    const levelSelect = document.getElementById('level-select');
    levelSelect.style.display = 'block';
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
function updateLeaderboard(player, score, level) {
    leaderboard.push({ player, score, level });
    leaderboard.sort((a, b) => a.score - b.score);
    if (leaderboard.length > 5) {
        leaderboard.shift(); // Remove the lowest score if leaderboard size exceeds the maximum
    }
    displayLeaderboard();
}

// Function to display the leaderboard
function displayLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-table');
    leaderboardTable.innerHTML = '<tr><th>Player</th><th>Score</th><th>Level</th></tr>';
    for (const entry of leaderboard) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.player}</td><td>${entry.score}</td><td>${entry.level}</td>`;
        leaderboardTable.appendChild(row);
    }
}

// Clear the leaderboard
function clearLeaderboard() {
    leaderboard = [];
    displayLeaderboard();
}

// Main menu
function main() {
    displayWelcomeScreen();
    selectGameLevel();
}

// Call the main function when the page loads
window.onload = main;

// Toggle Dark Mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
});

// Event listener for the guess button
const guessButton = document.getElementById('guess-button');
guessButton.addEventListener('click', handleGuess);
