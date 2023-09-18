// Wrap the code in an event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const EASY_MIN = 1;
    const EASY_MAX = 20;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 50;
    const HARD_MIN = 1;
    const HARD_MAX = 100;

    // Get player names from input fields
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    let player1Name = ''; // Default names
    let player2Name = '';

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
    const gameModeSelect = document.getElementById('gameMode');

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer, playerAttempts;
    const playerGuesses = {
        1: [],
        2: [],
    };

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Event listener for the guess button
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    // Start the game
    function startGame() {
        // Get player names from input fields
        player1Name = player1NameInput.value.trim() || 'Player 1';
        player2Name = player2NameInput.value.trim() || 'Player 2';

        // Check if both players have entered their names (for multiplayer mode)
        if (gameModeSelect.value === 'multi' && (player1Name === 'Player 1' || player2Name === 'Player 2')) {
            alert('Please enter names for both players.');
            return;
        }

        // Get selected difficulty and set game parameters
        const selectedDifficulty = difficultySelect.value;
        if (selectedDifficulty === 'easy') {
            min = EASY_MIN;
            max = EASY_MAX;
            playerAttempts = [4, 4];
        } else if (selectedDifficulty === 'medium') {
            min = MEDIUM_MIN;
            max = MEDIUM_MAX;
            playerAttempts = [6, 6];
        } else {
            min = HARD_MIN;
            max = HARD_MAX;
            playerAttempts = [8, 8];
        }

        targetNumber = generateRandomNumber(min, max);
        remainingAttempts = [...playerAttempts];
        bestScore = parseInt(localStorage.getItem(selectedDifficulty)) || Infinity;
        currentPlayer = 1;
        playerGuesses[1] = [];
        playerGuesses[2] = [];

        guessField.value = '';
        message.textContent = '';
        timeLeft.textContent = timeLimitInput.value;
        attempts.textContent = playerAttempts[currentPlayer - 1];
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

    // Start the timer
    function startTimer() {
        clearInterval(timer);
        const timeLimit = parseInt(timeLimitInput.value);
        let timeRemaining = timeLimit;

        timer = setInterval(function () {
            timeRemaining--;
            timeLeft.textContent = timeRemaining;

            if (timeRemaining === 0) {
                endGame(0); // Time's up, declare both players as losers
            }
        }, 1000);
    }

    // Check the user's guess
    function checkGuess(player) {
        const userGuess = parseInt(guessField.value);

        if (isNaN(userGuess) || userGuess < min || userGuess > max) {
            message.textContent = `${getPlayerName(player)}, please enter a valid number between ${min} and ${max}.`;
            guessField.style.borderColor = 'red'; // Set the border color to red for wrong entry
            return;
        }

        playerGuesses[player].push(userGuess);

        // Check if the current player has guessed correctly
        if (userGuess === targetNumber) {
            endGame(player, true); // The current player won
        } else {
            guessField.style.borderColor = 'green'; // Set the border color to green for correct entry
            message.textContent = `${getPlayerName(player)}, your guess is recorded. Next player's turn.`;
            guessField.value = '';
            guessField.focus();
            currentPlayer = 3 - currentPlayer; // Switch players
            attempts.textContent = playerAttempts[currentPlayer - 1];
        }
    }

    // End the game and declare the result
    function endGame(winner, correctGuess) {
        clearInterval(timer);
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        timeLimitInput.removeAttribute('disabled');
        startButton.removeAttribute('disabled');

        if (correctGuess) {
            message.textContent = `${getPlayerName(winner)} wins with ${playerAttempts[3 - winner]} attempts left! The correct number was ${targetNumber}.`;
        } else {
            message.textContent = `Both players, ${player1Name} and ${player2Name}, lose! The correct number was ${targetNumber}.`;
        }

        // Update best score if applicable
        if (playerAttempts[3 - winner] < bestScore) {
            bestScore = playerAttempts[3 - winner];
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        }

        // Play sound based on the result
        if (correctGuess) {
            correctSound.play(); // Play a victory sound
        } else {
            gameOverSound.play(); // Play a game over sound
        }

        // Reset the guess field border color
        guessField.style.borderColor = '';

        // Reset player names
        player1NameInput.value = '';
        player2NameInput.value = '';
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }
});
