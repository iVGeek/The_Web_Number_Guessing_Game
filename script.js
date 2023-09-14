// JavaScript for Guess the Number game

// Initialize game variables
let secretNumber;
let attemptsLeft;
let isGameOver = false;
let leaderboard = [];
let gameMode = 'single'; // Default to single player

// Function to start a new game
function startNewGame() {
    // Retrieve the selected game mode
    const gameModeRadios = document.getElementsByName('game-mode');
    for (const radio of gameModeRadios) {
        if (radio.checked) {
            gameMode = radio.value;
            break;
        }
    }

    // Prompt for the player's name
    const playerName = prompt('Enter your name to start the game:');
    if (!playerName) {
        return; // Exit if the player cancels or leaves the name blank
    }

    // Adjust game settings based on the selected mode
    if (gameMode === 'single') {
        secretNumber = generateRandomNumber(1, 100);
        attemptsLeft = 4;
    } else if (gameMode === 'multi') {
        // Adjust settings for multiplayer mode here
    }

    isGameOver = false;
    document.getElementById('result-message').textContent = '';
    document.getElementById('attempts-left').textContent = `Attempts left: ${attemptsLeft}`;
    document.getElementById('guess-input').value = '';
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

    // Prompt players to enter their names
    const playerName = prompt('Enter your name to save your score:');
    if (!playerName) {
        return; // Exit if the player cancels or leaves the name blank
    }

    leaderboard.push({ player: playerName, attempts: 5 - attemptsLeft, isWinner });
    showLeaderboard();
}

// Function to display the leaderboard
function showLeaderboard() {
    leaderboard.sort((a, b) => a.attempts - b.attempts);
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach((entry, index) => {
        leaderboardContainer.innerHTML += `<p>${index + 1}. ${entry.player}: Attempts: ${entry.attempts}, ${entry.isWinner ? 'Winner' : 'Loser'}</p>`;
    });
}

// Event listeners
document.getElementById('start-button').addEventListener('click', startNewGame);
document.getElementById('guess-button').addEventListener('click', handleGuessClick);

// Start a new game when the page loads
startNewGame();
