// Wrap the code in an event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const EASY_MIN = 1;
    const EASY_MAX = 20; // Adjusted max value for easy level
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 50; // Adjusted max value for medium level
    const HARD_MIN = 1;
    const HARD_MAX = 100; // Adjusted max value for hard level

    // Get player names from input fields
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const gameModeSelect = document.getElementById('gameMode');
    const player2NameLabel = document.getElementById('player2NameLabel');
    let player1Name = 'Player 1'; // Default names
    let player2Name = 'Player 2';

    // Get other elements
    const difficultySelect = document.getElementById('difficulty');
    const timeLimitInput = document.getElementById('timeLimit');
    const startButton = document.getElementById('startButton');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');
    const message = document.querySelector('.message');
    const timeLeft = document.getElementById('timeLeft');
    const attempts = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('bestScore');
    const winnerDisplay = document.getElementById('winner');

    // Sounds
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const gameOverSound = document.getElementById('gameOverSound');

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer;
    const playerGuesses = {
        1: [],
        2: [],
    };

    // Countdown animation
    const timeLeftElement = document.getElementById('timeLeft');

    // Event listener for the game mode select
    gameModeSelect.addEventListener('change', function () {
        const selectedMode = gameModeSelect.value;
        if (selectedMode === 'single') {
            player2NameLabel.style.display = 'none';
            player2NameInput.style.display = 'none';
            player1NameInput.placeholder = 'Your Name';
        } else {
            player2NameLabel.style.display = 'block';
            player2NameInput.style.display = 'block';
            player1NameInput.placeholder = 'Player 1 Name';
        }
    });

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Event listener for the guess button
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    // Start the game
    function startGame() {
        // Get player names from input fields
        player1Name = player1NameInput.value || 'Player 1';
        player2Name = player2NameInput.value || 'Player 2';

        // Get selected difficulty and set game parameters
        const selectedDifficulty = difficultySelect.value;
        if (selectedDifficulty === 'easy') {
            min = EASY_MIN;
            max = EASY_MAX;
            remainingAttempts = 4; // Adjusted attempts for easy level
        } else if (selectedDifficulty === 'medium') {
            min = MEDIUM_MIN;
            max = MEDIUM_MAX;
            remainingAttempts = 6; // Adjusted attempts for medium level
        } else {
            min = HARD_MIN;
            max = HARD_MAX;
            remainingAttempts = 8; // Adjusted attempts for hard level
        }

        targetNumber = generateRandomNumber(min, max);
        bestScore = parseInt(localStorage.getItem(selectedDifficulty)) || Infinity;
        currentPlayer = 1;
        playerGuesses[1] = [];
        playerGuesses[2] = [];

        guessField.value = '';
        message.textContent = '';
        timeLeft.textContent = timeLimitInput.value;
        attempts.textContent = remainingAttempts; // Display remaining attempts
        bestScoreDisplay.textContent = bestScore === Infinity ? '-' : bestScore;
        winnerDisplay.textContent = ''; // Clear winner display

        guessField.removeAttribute('disabled');
        guessSubmit.removeAttribute('disabled');
        timeLimitInput.setAttribute('disabled', 'disabled');
        startButton.setAttribute('disabled', 'disabled');

        startTimer();
    }

    // Generate a random number within a given range
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Start the timer
    function startTimer() {
        clearInterval(timer);
        const timeLimit = parseInt(timeLimitInput.value);
        let timeRemaining = timeLimit;

        timer = setInterval(function () {
            timeRemaining--;
            timeLeft.textContent = timeRemaining;

            if (timeRemaining === 0) {
                endGame(0); // Time's up, declare a tie
            }
        }, 1000);
    }

    // Check the user's guess
    function checkGuess(player) {
        const userGuess = parseInt(guessField.value);

        if (isNaN(userGuess) || userGuess < min || userGuess > max) {
            message.textContent = `${getPlayerName(player)}, please enter a valid number between ${min} and ${max}.`;
            return;
        }

        playerGuesses[player].push(userGuess);

        // Check if the current player has guessed correctly
        if (userGuess === targetNumber) {
            endGame(player);
        } else if (playerGuesses[player].length >= remainingAttempts) {
            endGame(0); // All attempts used, declare a tie
        } else {
            message.textContent = `${getPlayerName(player)}, your guess is recorded. Next player's turn.`;
            guessField.value = '';
            guessField.focus();
            currentPlayer = 3 - currentPlayer; // Switch players
        }
    }

    // End the game and declare the winner
    function endGame(winner) {
        clearInterval(timer);
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        timeLimitInput.removeAttribute('disabled');
        startButton.removeAttribute('disabled');

        if (winner === 1 || winner === 2) {
            message.textContent = `${getPlayerName(winner)} wins with ${playerGuesses[winner].length} attempts! The correct number was ${targetNumber}.`;
            winnerDisplay.textContent = `${getPlayerName(winner)} Wins!`;
        } else {
            message.textContent = `Both players lose. The correct number was ${targetNumber}.`;
            winnerDisplay.textContent = 'Both Lose';
        }

        // Update best score if applicable
        if (playerGuesses[1].length < bestScore) {
            bestScore = playerGuesses[1].length;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        } else if (playerGuesses[2].length < bestScore) {
            bestScore = playerGuesses[2].length;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        }

        // Play sound based on the result
        if (winner === 1 || winner === 2) {
            correctSound.play(); // Play a victory sound
        } else {
            gameOverSound.play(); // Play a game over sound
        }
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }
});
