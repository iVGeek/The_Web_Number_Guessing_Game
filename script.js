document.addEventListener('DOMContentLoaded', function () {
    const EASY_MIN = 1;
    const EASY_MAX = 20;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 50;
    const HARD_MIN = 1;
    const HARD_MAX = 100;

    const gameModeSelect = document.getElementById('gameMode');
    const playerNameInputs = document.getElementById('playerNameInputs');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameLabel = document.getElementById('player2NameLabel');
    const player2NameInput = document.getElementById('player2NameInput');
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('startButton');
    const guessField = document.getElementById('guessField');
    const guessSubmit = document.getElementById('guessSubmit');
    const message = document.querySelector('.message');
    const winnerDisplay = document.querySelector('.winner');
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    const attemptsLeftDisplay = document.getElementById('attemptsLeft');

    let min, max, targetNumber, remainingAttempts, currentPlayer;
    let player1Name = '';
    let player2Name = '';
    let currentPlayerName = '';
    let singlePlayer = true; // Single player mode flag

    gameModeSelect.addEventListener('change', function () {
        const selectedGameMode = gameModeSelect.value;
        if (selectedGameMode === 'single') {
            playerNameInputs.classList.remove('hidden');
            player2NameLabel.classList.add('hidden');
            player2NameInput.classList.add('hidden');
            singlePlayer = true;
        } else {
            playerNameInputs.classList.remove('hidden');
            player2NameLabel.classList.remove('hidden');
            player2NameInput.classList.remove('hidden');
            singlePlayer = false;
        }
        startButton.classList.remove('hidden');
    });

    startButton.addEventListener('click', function () {
        player1Name = player1NameInput.value.trim() || 'Player 1';
        player2Name = player2NameInput.value.trim() || 'Player 2';
        currentPlayerName = player1Name;

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
        currentPlayer = 1;
        resetUI();
    });

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function makeGuess() {
        const userGuess = parseInt(guessField.value);

        if (isNaN(userGuess) || userGuess < min || userGuess > max) {
            message.textContent = `Please enter a valid number between ${min} and ${max}.`;
            return;
        }

        remainingAttempts--;
        attemptsLeftDisplay.textContent = remainingAttempts;

        if (userGuess === targetNumber) {
            endGame(currentPlayerName);
        } else if (remainingAttempts === 0) {
            endGame('none');
        } else {
            currentPlayer = 3 - currentPlayer; // Switch players (1 <-> 2)
            currentPlayerName = (currentPlayer === 1 || singlePlayer) ? player1Name : player2Name;
            message.textContent = `${currentPlayerName}'s Turn`;
        }
    }

    function endGame(winner) {
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        startButton.removeAttribute('disabled');

        if (winner === 'none') {
            message.textContent = `Both players lost. The correct number was ${targetNumber}.`;
            winnerDisplay.textContent = '';
        } else {
            message.textContent = `${winner} wins! The correct number was ${targetNumber}.`;
            winnerDisplay.textContent = `${winner} wins!`;
        }
    }

    function resetUI() {
        guessField.value = '';
        guessField.removeAttribute('disabled');
        guessSubmit.removeAttribute('disabled');
        message.textContent = `${currentPlayerName}'s Turn`;
        winnerDisplay.textContent = '';
        attemptsLeftDisplay.textContent = remainingAttempts;
        playerNameDisplay.textContent = currentPlayerName;
    }

    guessSubmit.addEventListener('click', function () {
        makeGuess(); // Call the makeGuess function when the Submit Guess button is clicked
    });
});
