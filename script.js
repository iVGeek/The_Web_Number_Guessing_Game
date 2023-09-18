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

    // Define an array of levels
    const levels = [
        { target: 25, attempts: 5 },
        { target: 50, attempts: 7 },
        { target: 75, attempts: 10 },
        // Add more levels as needed
    ];

    let currentLevel = 0; // Initialize the current level

    // Define an array of daily challenges
    const dailyChallenges = [
        {
            description: 'Guess the correct number in 3 attempts.',
            reward: 50, // Reward in points or currency
            completed: false, // Indicates if the challenge is completed
        },
        {
            description: 'Play the game for 30 minutes.',
            reward: 100,
            completed: false,
        },
        // Add more daily challenges with descriptions and rewards
    ];

    // Define a player profile object to store customization data
    const playerProfile = {
        theme: 'default', // Default theme
        background: 'background1.jpg', // Default background
        avatar: 'avatar1.png', // Default avatar
    };

    // Define arrays to store friends and friend requests
    const friendsList = [];
    const friendRequests = [];

    // Define an array of achievements
    const achievements = [
        {
            name: 'Novice Guesser',
            condition: 'Guess the correct number 10 times.',
            reward: 100,
            earned: false,
        },
        {
            name: 'Master Guesser',
            condition: 'Guess the correct number 50 times.',
            reward: 500,
            earned: false,
        },
        // Add more achievements with names, conditions, and rewards
    ];

    // Define daily login rewards
    const dailyLoginRewards = [
        { day: 1, reward: 50 },
        { day: 2, reward: 100 },
        { day: 3, reward: 150 },
        // Define rewards for each consecutive day
    ];

    let min, max, targetNumber, remainingAttempts, timer, bestScore, currentPlayer;
    const playerGuesses = {
        1: [],
        2: [],
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

        targetNumber = generateRandomNumber(levels[currentLevel].target);
        remainingAttempts = levels[currentLevel].attempts;
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
    function generateRandomNumber(max) {
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
            correctSound.play(); // Play a victory sound
        } else {
            gameOverSound.play(); // Play a game over sound
        }
    }

    // Helper function to get player name
    function getPlayerName(player) {
        return player === 1 ? player1Name : player2Name;
    }

    // Call applyCustomization() during game initialization to apply customization settings
    function applyCustomization() {
        // Apply selected theme, background, and avatar to the game interface
        // Update CSS classes or styles to reflect the customization
    }

    // Function to send a friend request
    function sendFriendRequest(playerName) {
        // Add playerName to friendRequests array
        // Implement UI to send friend requests
    }

    // Function to accept a friend request
    function acceptFriendRequest(playerName) {
        // Remove playerName from friendRequests array
        // Add playerName to friendsList array
        // Implement UI to accept friend requests
    }

    // Function to send a chat message
    function sendChatMessage(playerName, message) {
        // Implement UI to send and display chat messages
    }

    // Function to check and unlock achievements
    function checkAchievements() {
        achievements.forEach((achievement) => {
            if (!achievement.earned) {
                // Check if the player meets the conditions of the achievement
                // If conditions are met, mark the achievement as earned
                // Reward the player with the specified points or currency
            }
        });
    }

    // Function to claim daily login rewards
    function claimDailyLoginReward(day) {
        // Check if the player's login day matches the reward's day
        // If a match is found, reward the player with points or currency
    }

    // Call applyCustomization() during game initialization to apply customization settings
    applyCustomization();
});
