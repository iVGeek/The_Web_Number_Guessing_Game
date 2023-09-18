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
    const player1Display = document.getElementById('player1');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('startButton');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');
    const message = document.querySelector('.message');

    let min, max, targetNumber, remainingAttempts, currentPlayer;

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Event listener for the guess button
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    // Start the game
    function startGame() {
        // Get player name
        const player1Name = player1NameInput.value;

        // Get selected difficulty and set game parameters
        const selectedDifficulty = difficultySelect.value;
        if (selectedDifficulty === 'easy') {
            min = EASY_MIN;
            max = EASY_MAX;
            remainingAttempts = 4; // 4 attempts for Easy mode
        } else if (selectedDifficulty === 'medium') {
            min = MEDIUM_MIN;
            max = MEDIUM_MAX;
            remainingAttempts = 6; // 6 attempts for Medium mode
        } else {
            min = HARD_MIN;
            max = HARD_MAX;
            remainingAttempts = 8; // 8 attempts for Hard mode
        }

        targetNumber = generateRandomNumber(min, max);
        currentPlayer = 1;

        guessField.value = '';
        message.textContent = `Hello, ${player1Name}! Enter a number between ${min} and ${max}.`;
        player1Display.textContent = `${player1Name}'s Turn`;
        guessField.removeAttribute('disabled');
        guessSubmit.removeAttribute('disabled');
        startButton.setAttribute('disabled', 'disabled');
    }

    // Generate a random number within a given range
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Check the user's guess
    function checkGuess(player) {
        const userGuess = parseInt(guessField.value);

        if (isNaN(userGuess) || userGuess < min || userGuess > max) {
            message.textContent = `Please enter a valid number between ${min} and ${max}.`;
            return;
        }

        remainingAttempts--;

        if (userGuess === targetNumber) {
            endGame(player);
        } else if (remainingAttempts === 0) {
            endGame(0); // No more attempts, declare a tie
        } else {
            message.textContent = `Sorry, ${player1Name}, that's not correct. ${remainingAttempts} ${
                remainingAttempts === 1 ? 'attempt' : 'attempts'
            } left.`;
            guessField.value = '';
            currentPlayer = 2; // Switch to the AI's turn
            player1Display.textContent = "AI's Turn";

            // Simulate AI's guess (you can implement AI logic here)
            setTimeout(simulateAIGuess, 1000);
        }
    }

    // Simulate AI's guess (generates a random number)
    function simulateAIGuess() {
        const aiGuess = generateRandomNumber(min, max);
        remainingAttempts--;

        if (aiGuess === targetNumber) {
            endGame(2); // AI wins
        } else if (remainingAttempts === 0) {
            endGame(0); // No more attempts, declare a tie
        } else {
            message.textContent = `AI guessed ${aiGuess}. ${remainingAttempts} ${
                remainingAttempts === 1 ? 'attempt' : 'attempts'
            } left.`;
            currentPlayer = 1;
            player1Display.textContent = `${player1Name}'s Turn`;
        }
    }

    // End the game and declare the result
    function endGame(winner) {
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        startButton.removeAttribute('disabled');

        if (winner === 1) {
            message.textContent = `${player1Name} wins! The correct number was ${targetNumber}.`;
        } else if (winner === 2) {
            message.textContent = `AI wins! The correct number was ${targetNumber}.`;
        } else {
            message.textContent = `It's a tie! The correct number was ${targetNumber}.`;
        }
    }
});
