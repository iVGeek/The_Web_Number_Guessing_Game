document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const EASY_MIN = 1;
    const EASY_MAX = 20;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 50;
    const HARD_MIN = 1;
    const HARD_MAX = 100;

    // Get elements from the HTML
    const gameModeSelect = document.getElementById('gameMode');
    const playerNameInputs = document.getElementById('playerNameInputs');
    const difficultySelect = document.getElementById('difficulty');
    const timeLimitInput = document.getElementById('timeLimit');
    const startButton = document.getElementById('startButton');
    const message = document.querySelector('.message');
    const timeLeft = document.getElementById('timeLeft');
    const attempts = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('bestScore');
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const gameOverSound = document.getElementById('gameOverSound');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer;
    let player1Name = '';
    let player2Name = '';
    let gameMode = 'single';

    // Event listener for the game mode selection
    gameModeSelect.addEventListener('change', function () {
        gameMode = gameModeSelect.value;
        updatePlayerNameInputs();
    });

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Update player name inputs based on game mode
    function updatePlayerNameInputs() {
        if (gameMode === 'single') {
            playerNameInputs.innerHTML = `
                <label for="playerName">Enter Your Name:</label>
                <input type="text" id="playerName" required>
            `;
        } else if (gameMode === 'multi') {
            playerNameInputs.innerHTML = `
                <label for="player1Name">Player 1 Name:</label>
                <input type="text" id="player1Name" required>
                <label for="player2Name">Player 2 Name:</label>
                <input type="text" id="player2Name" required>
            `;
        }
    }

    // Start the game
    function startGame() {
        // Get player names
        player1Name = document.getElementById('player1Name').value;
        player2Name = document.getElementById('player2Name').value;

        // Get selected difficulty and set game parameters
        const selectedDifficulty = difficultySelect.value;
        if (selectedDifficulty === 'easy') {
            min = EASY_MIN;
            max = EASY_MAX;
            remainingAttempts = 4;
        } else if (selectedDifficulty === 'medium') {
            min = MEDIUM_MIN;
            max = MEDIUM_MAX;
            remainingAttempts = 6;
        } else {
            min = HARD_MIN;
            max = HARD_MAX;
            remainingAttempts = 8;
        }

        targetNumber = generateRandomNumber(min, max);
        bestScore = localStorage.getItem(selectedDifficulty) || '-';
        currentPlayer = 1;

        guessField.value = '';
        message.textContent = '';
        timeLeft.textContent = timeLimitInput.value;
        attempts.textContent = remainingAttempts;
        bestScoreDisplay.textContent = bestScore;

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

        // Decrease the attempts
        remainingAttempts--;

        if (userGuess === targetNumber) {
            endGame(player);
        } else if (remainingAttempts === 0) {
            endGame(0);
        } else {
            message.textContent = `${getPlayerName(player)}, your guess is recorded. Next player's turn.`;
            guessField.value = '';
            guessField.focus();
            currentPlayer = 3 - currentPlayer; // Switch players
        }
    }

    // End the game
    function endGame(winner) {
        clearInterval(timer);
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        timeLimitInput.removeAttribute('disabled');
        startButton.removeAttribute('disabled');

        if (winner === 1 || winner === 2) {
            message.textContent = `${getPlayerName(winner)} wins! The correct number was ${targetNumber}.`;
        } else {
            message.textContent = `${player1Name} and ${player2Name} lost. The correct number was ${targetNumber}.`;
        }

        if (bestScore === '-' || remainingAttempts < bestScore) {
            bestScore = remainingAttempts;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        }

        if (winner === 1 || winner === 2) {
            correctSound.play(); // Play a victory sound
        } else {
            gameOverSound.play(); // Play a game over sound
        }

        setTimeout(() => {
            // Reset the game
            guessField.removeAttribute('disabled');
            guessSubmit.removeAttribute('disabled');
            timeLimitInput.setAttribute('disabled', 'disabled');
            startButton.setAttribute('disabled', 'disabled');
            message.textContent = '';
            timeLeft.textContent = timeLimitInput.value;
            attempts.textContent = remainingAttempts;
            startGame();
        }, 3000);
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }

    // Event listener for the guess button
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    // Initial setup based on game mode
    updatePlayerNameInputs();
});
