// JavaScript for Guess the Number game

// Initialize game variables
let secretNumber;
let attemptsLeft;
let isGameOver = false;
let leaderboard = [];
let isDarkMode = false;

// Function to start a new game
function startNewGame() {
    const playerName = getPlayerName();
    if (!playerName) return;

    secretNumber = generateRandomNumber(1, 100);
    attemptsLeft = getAttemptsForLevel();
    isGameOver = false;
    document.getElementById('result-message').textContent = '';
    document.getElementById('attempts-left').textContent = `Attempts left: ${attemptsLeft}`;
    document.getElementById('guess-input').value = '';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('gameplay').style.display = 'block';
}

// Function to generate a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to handle the "Guess" button click
function handleGuessClick() {
    if (isGameOver) {
        return;
    }

    const guessInput = document.getElementById('guess-input');
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById('result-message').textContent = 'Invalid guess. Please enter a number between 1 and 100.';
        return;
    }

    attemptsLeft--;

    if (guess === secretNumber) {
        endGame(true);
    } else if (attemptsLeft === 0) {
        endGame(false);
    } else {
        document.getElementById('attempts-left').textContent = `Attempts left: ${attemptsLeft}`;
        document.getElementById('result-message').textContent = guess < secretNumber ? 'Too low!' : 'Too high!';
    }
}

// Function to end the game and display the result
function endGame(isWinner) {
    isGameOver = true;
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = isWinner ? 'Congratulations! You guessed the number!' : `Game over. The number was ${secretNumber}.`;
    leaderboard.push({ attempts: 5 - attemptsLeft, isWinner });
    showLeaderboard();
    document.getElementById('game-controls').style.display = 'block';
    document.getElementById('gameplay').style.display = 'none';
}

// Function to display the leaderboard
function showLeaderboard() {
    leaderboard.sort((a, b) => a.attempts - b.attempts);
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach((entry, index) => {
        leaderboardContainer.innerHTML += `<p>${index + 1}. Attempts: ${entry.attempts}, ${entry.isWinner ? 'Winner' : 'Loser'}</p>`;
    });
}

// Function to get the player's name
function getPlayerName() {
    const playerName = prompt('Enter your name:');
    return playerName;
}

// Function to get the number of attempts based on the selected level
function getAttemptsForLevel() {
    const levelRadios = document.getElementsByName('game-level');
    for (const radio of levelRadios) {
        if (radio.checked) {
            const level = radio.value;
            switch (level) {
                case 'easy':
                    return 8;
                case 'medium':
                    return 6;
                case 'hard':
                    return 4;
                default:
                    return 8; // Default to easy level
            }
        }
    }
}

// Event listeners
document.getElementById('start-button').addEventListener('click', startNewGame);
document.getElementById('guess-button').addEventListener('click', handleGuessClick);

// Toggle Dark Mode
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

// Function to toggle dark/light mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (isDarkMode) {
        body.classList.add('dark-mode');
        header.classList.add('dark-mode');
        footer.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        header.classList.remove('dark-mode');
        footer.classList.remove('dark-mode');
    }
}

// Start a new game when the page loads
startNewGame();
