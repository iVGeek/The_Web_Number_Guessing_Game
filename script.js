const MAX_LEADERBOARD_SIZE = 5;
const leaderboard = [];

class GameLevel {
  constructor(name, min, max, attempts, color) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.attempts = attempts;
    this.color = color;
  }
}

function displayWelcomeScreen() {
  const gameTitle = document.getElementById("game-title");
  gameTitle.textContent = "Guess the Number!";
  gameTitle.classList.add("cyan");

  const welcomeMessage = document.getElementById("welcome-message");
  welcomeMessage.textContent = "Welcome to Guess the Number!";
  welcomeMessage.classList.add("cyan");

  // Initialize game
  setTimeout(() => {
    initializeGame();
  }, 2000);
}

function printAnimation() {
  const animationFrames = [
    "[■     ]",
    "[ ■    ]",
    "[  ■   ]",
    "[   ■  ]",
    "[    ■ ]",
    "[     ■]",
    "[    ■ ]",
    "[   ■  ]",
    "[  ■   ]",
    "[ ■    ]",
  ];

  const animationElement = document.getElementById("animation");
  let frameIndex = 0;

  function animateFrame() {
    animationElement.textContent = animationFrames[frameIndex];
    frameIndex = (frameIndex + 1) % animationFrames.length;
  }

  const animationInterval = setInterval(animateFrame, 500);

  // Stop animation after 5 seconds
  setTimeout(() => {
    clearInterval(animationInterval);
    animationElement.textContent = "";
  }, 5000);
}

function initializeGame() {
  printAnimation();

  setTimeout(() => {
    document.getElementById("game-container").style.display = "block";
  }, 2000);
}

function selectGameLevel() {
  const levelSelect = document.getElementById("level-select");
  return levelSelect.options[levelSelect.selectedIndex].value;
}

function updateLeaderboard(player, score, level) {
  const now = new Date();
  const date = now.toLocaleString();
  leaderboard.push({ player, score, level, date });
  leaderboard.sort((a, b) => a.score - b.score);

  if (leaderboard.length > MAX_LEADERBOARD_SIZE) {
    leaderboard.shift();
  }

  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardContainer = document.getElementById("leaderboard");
  leaderboardContainer.innerHTML = ""; // Clear previous leaderboard

  if (leaderboard.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No leaderboard data available.";
    message.classList.add("red");
    leaderboardContainer.appendChild(message);
  } else {
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

    sortedLeaderboard.forEach((entry, index) => {
      const playerRow = document.createElement("div");
      playerRow.classList.add("leaderboard-row");

      const rank = document.createElement("span");
      rank.textContent = `${index + 1}.`;
      playerRow.appendChild(rank);

      const playerName = document.createElement("span");
      playerName.textContent = entry.player;
      playerRow.appendChild(playerName);

      const playerScore = document.createElement("span");
      playerScore.textContent = entry.score;
      playerRow.appendChild(playerScore);

      const playerLevel = document.createElement("span");
      playerLevel.textContent = entry.level;
      playerRow.appendChild(playerLevel);

      const playerDate = document.createElement("span");
      playerDate.textContent = entry.date;
      playerRow.appendChild(playerDate);

      leaderboardContainer.appendChild(playerRow);
    });
  }
}

function clearLeaderboard() {
  leaderboard.length = 0;
  displayLeaderboard();
}

function playGame(player1, player2 = null, levelName) {
  const level = getGameLevel(levelName);
  const targetNumber = generateRandomNumber(level.min, level.max);
  let guessCount = 0;
  let attemptsLeft = level.attempts;

  const currentPlayer = player1;
  const playerDisplay = document.getElementById("current-player");
  playerDisplay.textContent = `Current Player: ${currentPlayer}`;

  const guessInput = document.getElementById("guess-input");
  const guessButton = document.getElementById("guess-button");
  const attemptsDisplay = document.getElementById("attempts-left");
  const gameStatusDisplay = document.getElementById("game-status");

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function handleGuess(guess) {
    guessCount++;
    attemptsLeft--;

    if (guess < targetNumber) {
      gameStatusDisplay.textContent = "Too low!";
      gameStatusDisplay.classList.add("red");
    } else if (guess > targetNumber) {
      gameStatusDisplay.textContent = "Too high!";
      gameStatusDisplay.classList.add("red");
    } else {
      gameStatusDisplay.textContent = `Congratulations, ${currentPlayer}! You guessed the number in ${guessCount} tries!`;
      gameStatusDisplay.classList.add("green");

      playConfettiAnimation();
      updateLeaderboard(currentPlayer, guessCount, level.name);
    }

    attemptsDisplay.textContent = `Attempts left: ${attemptsLeft}`;

    if (attemptsLeft === 0) {
      gameStatusDisplay.textContent = `Game over! The correct number was ${targetNumber}.`;
      gameStatusDisplay.classList.add("red");
      guessInput.disabled = true;
      guessButton.disabled = true;
    }
  }

  function playConfettiAnimation() {
    // Implement confetti animation here (you can use a library like 'confetti-js')
  }

  guessButton.addEventListener("click", () => {
    const guess = parseInt(guessInput.value);

    if (!isNaN(guess)) {
      handleGuess(guess);
    }
  });
}

function getGameLevel(levelName) {
  // Define game levels here
  const levels = {
    easy: new GameLevel("Easy", 1, 10, 8, "green"),
    medium: new GameLevel("Medium", 1, 50, 6, "yellow"),
    hard: new GameLevel("Hard", 1, 100, 4, "red"),
  };

  return levels[levelName] || levels.medium; // Default to medium level if invalid levelName
}

function startSinglePlayerGame() {
  const playerName = prompt("Enter your name:");
  const selectedLevel = selectGameLevel();

  if (!playerName) {
    alert("Please enter a valid player name.");
    return;
  }

  playGame(playerName, null, selectedLevel);
}

function main() {
  displayWelcomeScreen();

  const singlePlayerButton = document.getElementById("single-player-button");
  singlePlayerButton.addEventListener("click", startSinglePlayerGame);

  const viewLeaderboardButton = document.getElementById("view-leaderboard-button");
  viewLeaderboardButton.addEventListener("click", displayLeaderboard);

  const clearLeaderboardButton = document.getElementById("clear-leaderboard-button");
  clearLeaderboardButton.addEventListener("click", clearLeaderboard);
}

document.addEventListener("DOMContentLoaded", main);
