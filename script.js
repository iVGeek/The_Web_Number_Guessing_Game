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
