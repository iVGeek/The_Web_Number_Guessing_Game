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
    welcomeMessage.textContent = "Welcome to Guess the Number!";
}

// Function to select a game level
function selectGameLevel() {
    const levelSelect = document.getElementById('level-select');
    levelSelect.style.display = 'block';

    // Listen for level selection
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
        levelSelect.style.display = 'none';
    });
}

// Function to start the game
function startGame() {
    displayWelcomeScreen(); // Update welcome message
    secretNumber = generateRandomNumber(currentLevel.min, currentLevel.max);
    attemptsLeft = currentLevel.maxAttempts;

    // Display game elements
    const gameElements = document.getElementById('game-elements');
    gameElements.style.display = 'block';

    // Clear previous messages
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';

    // Display attempts left
    const attemptsLeftElement = document.getElementById('attempts-left');
    attemptsLeftElement.textContent = `Attempts left: ${attemptsLeft}`;
}

// ... (Rest of your existing code)

// Main menu
function main() {
    displayWelcomeScreen();
    selectGameLevel();
}

// Call the main function when the page loads
window.onload = main;
