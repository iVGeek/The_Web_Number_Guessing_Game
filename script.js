// Generate a random number between 1 and 100
const randomNumber = Math.floor(Math.random() * 100) + 1;

const guessField = document.getElementById('guessField');
const guessSubmit = document.getElementById('guessSubmit');
const message = document.querySelector('.message');

let attempts = 0;

guessSubmit.addEventListener('click', checkGuess);

function checkGuess() {
    const userGuess = parseInt(guessField.value);
    attempts++;

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    if (userGuess === randomNumber) {
        message.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
        guessSubmit.disabled = true;
    } else if (userGuess < randomNumber) {
        message.textContent = 'Try a higher number.';
    } else {
        message.textContent = 'Try a lower number.';
    }

    guessField.value = '';
    guessField.focus();
}
