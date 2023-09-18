// Wrap the code in an event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const EASY_MIN = 1;
    const EASY_MAX = 50;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 100;
    const HARD_MIN = 1;
    const HARD_MAX = 500;

    // Get player names from input fields
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    let player1Name = 'Player 1'; // Default names
    let player2Name = 'Player 2';

    const difficultySelect = document.getElementById('difficulty');
    const timeLimitInput = document.getElementById('timeLimit');
    const startButton = document.getElementById('startButton');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');
    const message = document.querySelector('.message');
    const timeLeft = document.getElementById('timeLeft');
    const attempts = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('bestScore');
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const soundToggle = document.getElementById('soundToggle');
    const wrongToggle = document.getElementById('wrongToggle');
    const gameOverToggle = document.getElementById('gameOverToggle');

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer;
    const playerGuesses = {
        1: [],
        2: [],
    };

    let soundEnabled = true;
    let wrongEnabled = true;
    let gameOverEnabled = true;

    // Countdown animation
    const timeLeftElement = document.getElementById('timeLeft');

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Event listener for the guess button
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    // Event listeners for sound toggles
    soundToggle.addEventListener('click', toggleSound);
    wrongToggle.addEventListener('click', toggleWrongSound);
    gameOverToggle.addEventListener('click', toggleGameOverSound);

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
        } else if (selectedDifficulty === 'medium') {
            min = MEDIUM_MIN;
            max = MEDIUM_MAX;
        } else {
            min = HARD_MIN;
            max = HARD_MAX;
        }

        targetNumber = generateRandomNumber(min, max);
        remainingAttempts = maxAttemptsByDifficulty(selectedDifficulty);
        bestScore = parseInt(localStorage.getItem(selectedDifficulty)) || Infinity;
        currentPlayer = 1;
        playerGuesses[1] = [];
        playerGuesses[2] = [];

        guessField.value = '';
        message.textContent = '';
        timeLeft.textContent = timeLimitInput.value;
        attempts.textContent = '0';
        bestScoreDisplay.textContent = bestScore === Infinity ? '-' : bestScore;

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

    // Calculate maximum attempts based on difficulty
    function maxAttemptsByDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 10;
            case 'medium':
                return 7;
            case 'hard':
                return 5;
            default:
                return 10;
        }
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
            if (playerGuesses[1].length < playerGuesses[2].length) {
                message.textContent = `${getPlayerName(1)} wins with ${playerGuesses[1].length} attempts! The correct number was ${targetNumber}.`;
            } else if (playerGuesses[2].length < playerGuesses[1].length) {
                message.textContent = `${getPlayerName(2)} wins with ${playerGuesses[2].length} attempts! The correct number was ${targetNumber}.`;
            } else {
                message.textContent = `It's a tie with ${playerGuesses[1].length} attempts each! The correct number was ${targetNumber}.`;
            }
        } else {
            message.textContent = `It's a tie with ${playerGuesses[1].length} attempts each! The correct number was ${targetNumber}.`;
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
            if (soundEnabled) {
                correctSound.play(); // Play a victory sound
            }
        } else {
            if (gameOverEnabled) {
                gameOverSound.play(); // Play a game over sound
            }
        }
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }

    // Toggle sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    }

    // Toggle wrong sound
    function toggleWrongSound() {
        wrongEnabled = !wrongEnabled;
        wrongToggle.textContent = wrongEnabled ? '🔊' : '🔇';
    }

    // Toggle game over sound
    function toggleGameOverSound() {
        gameOverEnabled = !gameOverEnabled;
        gameOverToggle.textContent = gameOverEnabled ? '🔊' : '🔇';
    }
});
