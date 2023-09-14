document.addEventListener("DOMContentLoaded", function () {
    const guessButton = document.getElementById("guess-button");
    const restartButton = document.getElementById("restart-button");
    const guessInput = document.getElementById("guess-input");
    const message = document.getElementById("message");
    const attemptsSpan = document.getElementById("attempts");
    const scoreSpan = document.getElementById("score");

    let targetNumber;
    let attempts;
    let score;

    function startNewGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        score = 100;
        guessInput.value = "";
        message.textContent = "Welcome to the game! Try to guess the number between 1 and 100.";
        attemptsSpan.textContent = attempts;
        scoreSpan.textContent = score;
        guessInput.removeAttribute("disabled");
        guessButton.removeAttribute("disabled");
        restartButton.style.display = "none";
    }

    startNewGame();

    guessButton.addEventListener("click", function () {
        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess)) {
            message.textContent = "Please enter a valid number.";
            return;
        }

        attempts++;

        if (userGuess < targetNumber) {
            message.textContent = "Too low! Try again.";
            document.getElementById("incorrect-audio").play();
        } else if (userGuess > targetNumber) {
            message.textContent = "Too high! Try again.";
            document.getElementById("incorrect-audio").play();
        } else {
            message.textContent = `Congratulations! You guessed the number ${targetNumber} in ${attempts} attempts.`;
            guessInput.setAttribute("disabled", "true");
            guessButton.setAttribute("disabled", "true");
            restartButton.style.display = "block";
            document.getElementById("correct-audio").play();
        }

        score -= 10; // Deduct points for each guess
        attemptsSpan.textContent = attempts;
        scoreSpan.textContent = score;

        if (attempts >= 10) {
            message.textContent = "Game Over! You've reached the maximum number of attempts.";
            guessInput.setAttribute("disabled", "true");
            guessButton.setAttribute("disabled", "true");
            restartButton.style.display = "block";
            document.getElementById("gameover-audio").play();
        }
    });

    restartButton.addEventListener("click", function () {
        startNewGame();
    });
});
