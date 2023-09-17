// Global variables
let player1Name = "";
let player2Name = "";
let currentPlayer = "";
let currentLevel = {};
let secretNumber = 0;
let attemptsLeft = 0;
let isMultiplayer = false;
let leaderboard = [];

// Function to display the welcome screen
function displayWelcomeScreen() {
    const welcomeMessage = document.createElement("h1");
    welcomeMessage.textContent = "Welcome to Guess the Number!";
    const playerNameInput = document.createElement("input");
    playerNameInput.setAttribute("type", "text");
    playerNameInput.setAttribute("id", "player-name");
    playerNameInput.setAttribute("placeholder", "Enter your name");
    const gameModeButtons = document.createElement("div");
    gameModeButtons.setAttribute("id", "game-mode");
    const singlePlayerButton = document.createElement("button");
    singlePlayerButton.textContent = "Single Player";
    singlePlayerButton.addEventListener("click", () => {
        isMultiplayer = false;
        startGame();
    });
    const multiplayerButton = document.createElement("button");
    multiplayerButton.textContent = "Multiplayer";
    multiplayerButton.addEventListener("click", () => {
        isMultiplayer = true;
        askForPlayerNames();
    });

    // Clear existing content and add the welcome screen elements
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";
    gameArea.appendChild(welcomeMessage);
    gameArea.appendChild(playerNameInput);
    gameArea.appendChild(gameModeButtons);
    gameModeButtons.appendChild(singlePlayerButton);
    gameModeButtons.appendChild(multiplayerButton);
}

// Function to ask for player names in multiplayer mode
function askForPlayerNames() {
    const playerNameInput = document.getElementById("player-name");
    player1Name = playerNameInput.value;
    playerNameInput.value = "";
    playerNameInput.placeholder = "Enter Player 2's name";
    playerNameInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            player2Name = playerNameInput.value;
            startGame();
        }
    });
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
}

// Function to start the game
function startGame() {
    // Reset game state
    currentPlayer = player1Name;
    currentLevel = {
        name: "Easy",
        min: 1,
        max: 10,
        maxAttempts: 5,
    };
    secretNumber = generateRandomNumber(currentLevel.min, currentLevel.max);
    attemptsLeft = currentLevel.maxAttempts;

    // Create game elements
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = "";
    const gameHeader = document.createElement("h2");
    gameHeader.textContent = "Guess the Number";
    const messageElement = document.createElement("p");
    messageElement.setAttribute("id", "message");
    const attemptsLeftElement = document.createElement("p");
    attemptsLeftElement.setAttribute("id", "attempts-left");
    attemptsLeftElement.textContent = `Attempts left: ${attemptsLeft}`;
    const guessInput = document.createElement("input");
    guessInput.setAttribute("type", "number");
    guessInput.setAttribute("id", "guess-input");
    guessInput.setAttribute("placeholder", "Enter your guess");
    const guessButton = document.createElement("button");
    guessButton.textContent = "Guess";
    guessButton.addEventListener("click", handleGuess);

    gameArea.appendChild(gameHeader);
    gameArea.appendChild(messageElement);
    gameArea.appendChild(attemptsLeftElement);
    gameArea.appendChild(guessInput);
    gameArea.appendChild(guessButton);
}

// Function to generate a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to handle user guesses
function handleGuess() {
    // Implement guess handling logic here
    // Check if the guess is correct, too low, or too high
    // Update the message, attempts left, and end the game if needed
}

// Function to end the game
function endGame(isWinner) {
    // Implement game ending logic here
    // Update the message to show the game result
    // Update the leaderboard
    // Display the leaderboard and offer to play again
}

// Function to update the leaderboard
function updateLeaderboard(player, score, level) {
    // Implement leaderboard update logic here
    // Add the player, score, and level to the leaderboard array
    // Sort the leaderboard based on scores
    // Keep only the top scores (you can limit the leaderboard size)
}

// Function to display the leaderboard
function displayLeaderboard() {
    // Implement leaderboard display logic here
    // Create a table and populate it with the leaderboard data
}

// Function to clear the leaderboard
function clearLeaderboard() {
    // Implement leaderboard clearing logic here
    // Clear the leaderboard array and update the display
}

// Function to play sound effects
function playSoundEffect(soundFile) {
    // Implement sound effect playing logic using Howler.js here
}

// Function to handle user input and game events
function handleUserInput(input) {
    // Implement user input handling logic here
    // This can include handling guesses, player names, and more
}

// Main function
function main() {
    // Display the welcome screen initially
    displayWelcomeScreen();
}

// Call the main function when the page loads
window.onload = main;
