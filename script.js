// Constants for difficulty levels
const EASY_MIN = 1;
const EASY_MAX = 50;
const MEDIUM_MIN = 1;
const MEDIUM_MAX = 100;
const HARD_MIN = 1;
const HARD_MAX = 500;

// Game variables
let min, max, targetNumber, remainingAttempts, timer, bestScore;

const difficultySelect = document.getElementById('difficulty');
const timeLimitInput = document.getElementById('timeLimit');
const startButton = document.getElementById('startButton');
const guessField = document.getElementById('guessField');
const guessSubmit = document.getElementById('guessSubmit');
const message = document.querySelector('.message');
const timeLeft = document.getElementById('timeLeft');
const attempts = document.getElementById('attempts');
const bestScoreDisplay = document.getElementById('bestScore');

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Event listener for the guess button
guessSubmit.addEventListener('click', checkGuess);

// Start the game
function startGame() {
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
            endGame(false);
        }
    }, 1000);
}

// Check the user's guess
function checkGuess() {
    const userGuess = parseInt(guessField.value);

    if (isNaN(userGuess) || userGuess < min || userGuess > max) {
        message.textContent = `Please enter a valid number between ${min} and ${max}.`;
        return;
    }

    remainingAttempts--;
    attempts.textContent = maxAttemptsByDifficulty(difficultySelect.value) - remainingAttempts;

    if (userGuess === targetNumber) {
        endGame(true);
    } else {
        if (userGuess < targetNumber) {
            message.textContent = 'Try a higher number.';
        } else {
            message.textContent = 'Try a lower number.';
        }

        guessField.value = '';
        guessField.focus();

        if (remainingAttempts === 0) {
            endGame(false);
        }
    }
}

// End the game
function endGame(isWinner) {
    clearInterval(timer);
    guessField.setAttribute('disabled', 'disabled');
    guessSubmit.setAttribute('disabled', 'disabled');
    timeLimitInput.removeAttribute('disabled');
    startButton.removeAttribute('disabled');

    if (isWinner) {
        message.textContent = `Congratulations! You guessed the number in ${maxAttemptsByDifficulty(difficultySelect.value) - remainingAttempts} attempts.`;

        // Update best score if necessary
        if (remainingAttempts < bestScore) {
            bestScore = remainingAttempts;
            localStorage.setItem(difficultySelect.value, bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
    } else {
        message.textContent = `Out of time. The correct number was ${targetNumber}.`;
    }
}
