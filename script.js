document.addEventListener('DOMContentLoaded', function () {
    // Constants for difficulty levels
    const EASY_MIN = 1;
    const EASY_MAX = 20;
    const MEDIUM_MIN = 1;
    const MEDIUM_MAX = 50;
    const HARD_MIN = 1;
    const HARD_MAX = 100;

    // Elements
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

    // Dark mode toggle
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    const body = document.body;

    toggleDarkModeButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        // Add background animations based on dark or light mode
        if (body.classList.contains('dark-mode')) {
            body.style.backgroundImage = 'url("dark-mode-bg.jpg")'; // Dark mode background image
        } else {
            body.style.backgroundImage = 'url("light-mode-bg.jpg")'; // Light mode background image
        }
    });

    // Event listener for game mode selection
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

    // Event listener for starting the game
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

    // Function to generate a random number within a range
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to handle player guesses
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

    // Function to end the game
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

            // Open the leaderboard when a player wins
            leaderboard.style.display = 'block';
            updateLeaderboard();
        }
    }

    // Function to reset the UI for a new game
    function resetUI() {
        guessField.value = '';
        guessField.removeAttribute('disabled');
        guessSubmit.removeAttribute('disabled');
        message.textContent = `${currentPlayerName}'s Turn`;
        winnerDisplay.textContent = '';
        attemptsLeftDisplay.textContent = remainingAttempts;
        playerNameDisplay.textContent = currentPlayerName;
    }

    // Event listener for submitting a guess
    guessSubmit.addEventListener('click', function () {
        makeGuess(); // Call the makeGuess function when the Submit Guess button is clicked
    });

    // Leaderboard features
    const leaderboardButton = document.getElementById('leaderboardButton');
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardList = document.getElementById('leaderboardList');
    const leaderboardCloseButton = document.getElementById('leaderboardCloseButton');
    const sortCriteriaSelect = document.getElementById('sortCriteria');
    const filterDifficultySelect = document.getElementById('filterDifficulty');
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');
    const currentPageDisplay = document.getElementById('currentPage');

    let leaderboardData = [];
    let currentPage = 1;
    const leaderboardPerPage = 5;

    leaderboardButton.addEventListener('click', function () {
        // Display the leaderboard
        leaderboard.style.display = 'block';

        // Update the leaderboard UI
        updateLeaderboard();
    });

    leaderboardCloseButton.addEventListener('click', function () {
        // Hide the leaderboard
        leaderboard.style.display = 'none';
    });

    // Event listener for sorting criteria and difficulty filter
    sortCriteriaSelect.addEventListener('change', updateLeaderboard);
    filterDifficultySelect.addEventListener('change', updateLeaderboard);

    // Event listener for pagination buttons
    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            updateLeaderboard();
        }
    });

    nextPageButton.addEventListener('click', function () {
        const maxPage = Math.ceil(leaderboardData.length / leaderboardPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            updateLeaderboard();
        }
    });

    // Function to update the leaderboard UI
    function updateLeaderboard() {
        leaderboardList.innerHTML = ''; // Clear previous leaderboard entries

        // Calculate the start and end indices for the current page
        const startIndex = (currentPage - 1) * leaderboardPerPage;
        const endIndex = startIndex + leaderboardPerPage;

        // Add leaderboard entries to the UI for the current page
        leaderboardData.slice(startIndex, endIndex).forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `#${startIndex + index + 1}: ${entry.name} - ${entry.attempts} attempts (${entry.difficulty})`;

            // Highlight the current user's entry
            if (entry.name === currentPlayerName) {
                listItem.classList.add('current-user');
            }

            leaderboardList.appendChild(listItem);
        });

        // Update current page display
        currentPageDisplay.textContent = `Page ${currentPage}`;

        // Disable pagination buttons when at the start or end of the leaderboard
        if (currentPage === 1) {
            prevPageButton.setAttribute('disabled', 'disabled');
        } else {
            prevPageButton.removeAttribute('disabled');
        }

        const maxPage = Math.ceil(leaderboardData.length / leaderboardPerPage);
        if (currentPage === maxPage) {
            nextPageButton.setAttribute('disabled', 'disabled');
        } else {
            nextPageButton.removeAttribute('disabled');
        }
    }

    // Sound effects
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const gameOverSound = document.getElementById('gameOverSound');

    function playCorrectSound() {
        if (correctSound) {
            correctSound.currentTime = 0;
            correctSound.play();
        }
    }

    function playWrongSound() {
        if (wrongSound) {
            wrongSound.currentTime = 0;
            wrongSound.play();
        }
    }

    function playGameOverSound() {
        if (gameOverSound) {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }
    }
});
