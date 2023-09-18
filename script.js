document.addEventListener('DOMContentLoaded', function () {
    const EASY_MIN = 1;
    const EASY_MAX = 50;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 100;
    const HARD_MIN = 1;
    const HARD_MAX = 500;

    let player1Name = 'Player 1';
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

    const timeLeftElement = document.getElementById('timeLeft');

    startButton.addEventListener('click', startGame);
    guessSubmit.addEventListener('click', function () {
        checkGuess(currentPlayer);
    });

    function startGame() {
        const gameMode = document.querySelector('input[name="gameMode"]:checked').value;

        if (gameMode === 'single') {
            player1Name = prompt('Enter your name (Single Player):') || 'Player 1';
            player2Name = 'AI';
            document.getElementById('player2Settings').style.display = 'none';
        } else if (gameMode === 'multi') {
            player1Name = prompt('Enter Player 1 name (Multiplayer):') || 'Player 1';
            player2Name = prompt('Enter Player 2 name (Multiplayer):') || 'Player 2';
            document.getElementById('player2Settings').style.display = 'block';
        }

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
        displayCurrentPlayer();
    }

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    function startTimer() {
        clearInterval(timer);
        const timeLimit = parseInt(timeLimitInput.value);
        let timeRemaining = timeLimit;

        timer = setInterval(function () {
            timeRemaining--;
            timeLeft.textContent = timeRemaining;

            if (timeRemaining === 0) {
                endGame(0);
            }
        }, 1000);
    }

    function checkGuess(player) {
        const userGuess = parseInt(guessField.value);

        if (isNaN(userGuess) || userGuess < min || userGuess > max) {
            message.textContent = `${getPlayerName(player)}, please enter a valid number between ${min} and ${max}.`;
            return;
        }

        playerGuesses[player].push(userGuess);

        if (userGuess === targetNumber) {
            endGame(player);
        } else if (playerGuesses[player].length >= remainingAttempts) {
            endGame(0);
        } else {
            message.textContent = `${getPlayerName(player)}, your guess is recorded. Next player's turn.`;
            guessField.value = '';
            guessField.focus();
            currentPlayer = 3 - currentPlayer;
            displayCurrentPlayer();
        }
    }

    function endGame(winner) {
        clearInterval(timer);
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        timeLimitInput.removeAttribute('disabled');
        startButton.removeAttribute('disabled');

        if (winner === 1 || winner === 2) {
            const winningPlayer = playerGuesses[1].length < playerGuesses[2].length ? 1 : 2;
            message.textContent = `${getPlayerName(winningPlayer)} wins with ${playerGuesses[winningPlayer].length} attempts! The correct number was ${targetNumber}.`;
        } else {
            message.textContent = `${getPlayerName(1)} and ${getPlayerName(2)} both lose. The correct number was ${targetNumber}.`;
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

        if (winner === 1 || winner === 2) {
            correctSound.play();
        } else {
            gameOverSound.play();
        }
    }

    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }

    function displayCurrentPlayer() {
        document.getElementById('currentPlayerInfo').textContent = `${getPlayerName(currentPlayer)}'s Turn`;
    }
});
