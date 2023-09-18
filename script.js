// Wrap the code in an event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const DIFFICULTIES = {
        easy: {
            min: 1,
            max: 20,
            maxTries: 4, // Adjusted number of tries for easy difficulty
        },
        medium: {
            min: 1,
            max: 50,
            maxTries: 6, // Adjusted number of tries for medium difficulty
        },
        hard: {
            min: 1,
            max: 100,
            maxTries: 8, // Adjusted number of tries for hard difficulty
        },
    };

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

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer;
    const playerGuesses = {
        1: [],
        2: [],
    };
    const playerAttempts = {
        1: 0,
        2: 0,
    };

    // Countdown animation
    const timeLeftElement = document.getElementById('timeLeft');

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
        const difficulty = DIFFICULTIES[selectedDifficulty];

        min = difficulty.min;
        max = difficulty.max;
        remainingAttempts = difficulty.maxTries; // Adjusted number of tries based on difficulty
        playerAttempts[1] = remainingAttempts;
        playerAttempts[2] = remainingAttempts;

        targetNumber = generateRandomNumber(min, max);
        bestScore = parseInt(localStorage.getItem(selectedDifficulty)) || Infinity;
        currentPlayer = 1;
        playerGuesses[1] = [];
        playerGuesses[2] = [];

        guessField.value = '';
        message.textContent = '';
        timeLeft.textContent = timeLimitInput.value;
        attempts.textContent = playerAttempts[1];
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
            return;
        }

        playerGuesses[player].push(userGuess);

        if (userGuess === targetNumber) {
            endGame(player);
        } else {
            message.textContent = `${getPlayerName(player)}, your guess is recorded.`;
            guessField.value = '';
            guessField.focus();
            playerAttempts[player]--;

            if (playerAttempts[player] === 0) {
                endGame(0); // No more attempts, declare both players as losers
            } else {
                attempts.textContent = playerAttempts[player];
                currentPlayer = 3 - currentPlayer; // Switch players
            }
        }
    }

    // End the game and declare the winner or both players as losers
    function endGame(winner) {
        clearInterval(timer);
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        timeLimitInput.removeAttribute('disabled');
        startButton.removeAttribute('disabled');

        if (winner === 1 || winner === 2) {
            message.textContent = `${getPlayerName(winner)} wins! The correct number was ${targetNumber}.`;
            correctSound.play();
        } else {
            message.textContent = `${player1Name} and ${player2Name} both lose. The correct number was ${targetNumber}.`;
            gameOverSound.play();
        }

        if (playerGuesses[1].length < bestScore) {
            bestScore = playerGuesses[1].length;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        } else if (playerGuesses[2].length < bestScore) {
            bestScore = playerGuesses[2].length;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }
});
