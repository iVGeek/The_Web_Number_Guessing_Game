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
    let singlePlayer = true;

    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    const body = document.body;

    toggleDarkModeButton.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            body.style.backgroundImage = 'url("dark-mode-bg.jpg")'; // Path to your dark mode background image
        } else {
            body.style.backgroundImage = 'url("light-mode-bg.jpg")'; // Path to your light mode background image
        }
    });

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
            currentPlayer = 3 - currentPlayer;
            currentPlayerName = (currentPlayer === 1 || singlePlayer) ? player1Name : player2Name;
            message.textContent = `${currentPlayerName}'s Turn`;
        }
    }

    function endGame(winner) {
        guessField.setAttribute('disabled', 'disabled');
        guessSubmit.setAttribute('disabled', 'disabled');
        startButton.removeAttribute('disabled');

        const attempts = remainingAttempts;
        const difficulty = difficultySelect.value;

        leaderboardData.push({ name: currentPlayerName, attempts, difficulty });

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
        makeGuess();
    });

    // Leaderboard features (Add this section)
    const leaderboardButton = document.getElementById('leaderboardButton');
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardList = document.getElementById('leaderboardList');
    const leaderboardCloseButton = document.getElementById('leaderboardCloseButton');
    const sortCriteriaSelect = document.getElementById('sortCriteria');
    const filterDifficultySelect = document.getElementById('filterDifficulty');
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');
    const currentPageDisplay = document.getElementById('currentPage');

    let currentPage = 1;
    const leaderboardPerPage = 5;

    leaderboardButton.addEventListener('click', function () {
        leaderboard.style.display = 'block';
        updateLeaderboard();
    });

    leaderboardCloseButton.addEventListener('click', function () {
        leaderboard.style.display = 'none';
    });

    sortCriteriaSelect.addEventListener('change', updateLeaderboard);
    filterDifficultySelect.addEventListener('change', updateLeaderboard);

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

    function updateLeaderboard() {
        leaderboardList.innerHTML = '';
        const sortedData = sortLeaderboardData(leaderboardData, sortCriteriaSelect.value);
        const filteredData = filterLeaderboardData(sortedData, filterDifficultySelect.value);

        const startIndex = (currentPage - 1) * leaderboardPerPage;
        const endIndex = startIndex + leaderboardPerPage;
        const displayedData = filteredData.slice(startIndex, endIndex);

        displayedData.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `#${startIndex + index + 1}: ${entry.name} - ${entry.attempts} attempts (${entry.difficulty})`;

            if (entry.name === currentPlayerName) {
                listItem.classList.add('current-user');
            }

            leaderboardList.appendChild(listItem);
        });

        currentPageDisplay.textContent = `Page ${currentPage}`;

        if (currentPage === 1) {
            prevPageButton.setAttribute('disabled', 'disabled');
        } else {
            prevPageButton.removeAttribute('disabled');
        }

        const maxPage = Math.ceil(filteredData.length / leaderboardPerPage);
        if (currentPage === maxPage) {
            nextPageButton.setAttribute('disabled', 'disabled');
        } else {
            nextPageButton.removeAttribute('disabled');
        }
    }

    function sortLeaderboardData(data, criteria) {
        if (criteria === 'attempts-asc') {
            return data.slice().sort((a, b) => a.attempts - b.attempts);
        } else if (criteria === 'attempts-desc') {
            return data.slice().sort((a, b) => b.attempts - a.attempts);
        } else {
            return data.slice().sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    function filterLeaderboardData(data, difficulty) {
        if (difficulty === 'all') {
            return data;
        } else {
            return data.filter(entry => entry.difficulty === difficulty);
        }
    }

    // Audio elements with file paths
    const correctSound = new Audio('correct.mp3'); // Path to your correct sound file
    const wrongSound = new Audio('wrong.mp3'); // Path to your wrong sound file
    const gameOverSound = new Audio('gameover.mp3'); // Path to your game over sound file

    guessSubmit.addEventListener('click', function () {
        makeGuess();
    });
});
