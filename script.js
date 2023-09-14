const toggleThemeButton = document.getElementById('toggle-theme');
const body = document.body;
const container = document.querySelector('.container');
const leaderboardList = document.getElementById('leaderboard-list');

toggleThemeButton.addEventListener('click', toggleTheme);

let darkMode = false;

function toggleTheme() {
    darkMode = !darkMode;

    if (darkMode) {
        body.classList.add('dark-mode');
        container.style.backgroundColor = '#444';
        container.style.color = '#fff';
        leaderboardList.style.backgroundColor = '#555';
        leaderboardList.style.color = '#fff';
        toggleThemeButton.textContent = 'Toggle Light Mode';
    } else {
        body.classList.remove('dark-mode');
        container.style.backgroundColor = '';
        container.style.color = '';
        leaderboardList.style.backgroundColor = '';
        leaderboardList.style.color = '';
        toggleThemeButton.textContent = 'Toggle Dark Mode';
    }
}

const MAX_LEADERBOARD_SIZE = 5;
let leaderboard = [];

class GameLevel {
    constructor(name, min_value, max_value, max_attempts, color) {
        this.name = name;
        this.min_value = min_value;
        this.max_value = max_value;
        this.max_attempts = max_attempts;
        this.color = color;
    }
}

function display_welcome_screen() {
    const f = new Figlet({ font: 'big' });
    const welcomeMessage = document.createElement('h1');
    welcomeMessage.textContent = 'Welcome to Guess the Number!';
    welcomeMessage.classList.add('welcome-message');
    container.appendChild(welcomeMessage);

    f.loadFont('Standard', (err, font) => {
        if (!err) {
            const gameTitle = f.render('Guess the Number!', font);
            const gameTitleElement = document.createElement('pre');
            gameTitleElement.textContent = gameTitle;
            gameTitleElement.classList.add('game-title');
            container.appendChild(gameTitleElement);
        }

        const developerMessage = document.createElement('p');
        developerMessage.textContent = 'Game developed by iVGeek';
        developerMessage.classList.add('developer-message');
        container.appendChild(developerMessage);

        console.log('Initializing game...');
        print_animation();
        console.log('Game ready!\n');
    });
}

function print_animation() {
    const animationFrames = ["[■     ]", "[ ■    ]", "[  ■   ]", "[   ■  ]", "[    ■ ]", "[     ■]", "[    ■ ]", "[   ■  ]", "[  ■   ]", "[ ■    ]"];
    const animationInterval = setInterval(() => {
        const frame = animationFrames.shift();
        if (frame !== undefined) {
            console.clear();
            console.log(frame);
            animationFrames.push(frame);
        }
    }, 500);

    setTimeout(() => {
        clearInterval(animationInterval);
    }, 5000);
}

function play_game(player1, player2 = null) {
    if (player2) {
        console.log(`Player 1: ${player1}, Player 2: ${player2}\n`);
    } else {
        console.log(`Player: ${player1}\n`);
    }

    const level = select_game_level();
    const target_number = random.randint(level.min_value, level.max_value);
    let guess_count = 0;
    let attempts_left = level.max_attempts;

    while (true) {
        let current_player;
        if (player2) {
            current_player = guess_count % 2 === 0 ? player1 : player2;
            console.log(`Current Player: ${current_player}`);
        } else {
            current_player = player1;
        }
        const guess = parseInt(prompt(`Guess a number between ${level.min_value} and ${level.max_value}: `));
        guess_count += 1;
        attempts_left -= 1;

        if (guess < target_number) {
            console.log('Too low!\n');
        } else if (guess > target_number) {
            console.log('Too high!\n');
        } else {
            console.log(`Congratulations, ${current_player}! You guessed the number in ${guess_count} tries!\n`);
            update_leaderboard(current_player, guess_count, level.name);
            break;
        }

        if (attempts_left === 0) {
            console.log(`Game over! The correct number was ${target_number}.\n`);
            break;
        }
    }

    const play_again = prompt('Do you want to play again? (y/n): ');
    if (play_again.toLowerCase() === 'y') {
        if (player2) {
            play_game(player1, player2);
        } else {
            play_game(player1);
        }
    } else {
        console.log('Thank you for playing!\n');
    }
}

function select_game_level() {
    console.log('Select a game level:');
    console.log('1. Easy (1-10, 8 attempts)');
    console.log('2. Medium (1-50, 6 attempts)');
    console.log('3. Hard (1-100, 4 attempts)');

    const choice = prompt('Enter the level number: ');

    if (choice === '1') {
        return new GameLevel('Easy', 1, 10, 8, 'green');
    } else if (choice === '2') {
        return new GameLevel('Medium', 1, 50, 6, 'yellow');
    } else if (choice === '3') {
        return new GameLevel('Hard', 1, 100, 4, 'red');
    } else {
        console.log('Invalid choice. Defaulting to Medium level.\n');
        return new GameLevel('Medium', 1, 50, 4, 'yellow');
    }
}

function update_leaderboard(player, score, level) {
    const now = new Date();
    const date = now.toISOString();
    leaderboard.push({ player, score, level, date });
    leaderboard.sort((a, b) => a.score - b.score);
    if (leaderboard.length > MAX_LEADERBOARD_SIZE) {
        leaderboard.shift();
    }
}

function display_leaderboard() {
    if (leaderboard.length === 0) {
        console.log('No leaderboard data available.\n');
        return;
    }

    console.log('Leaderboard');
    console.log('---------------------------');

    const sortedLeaderboard = leaderboard.slice().sort((a, b) => b.score - a.score);

    for (const entry of sortedLeaderboard) {
        const { player, score, level, date } = entry;
        const scoreText = score === 0 ? '0 (Not on leaderboard)' : score.toString();
        console.log(`Player: ${player}, Score: ${scoreText}, Level: ${level}, Date: ${date}`);
    }

    for (const playerScore of leaderboard) {
        if (playerScore.score === 0) {
            const playerName = playerScore.player;
            if (!sortedLeaderboard.some(entry => entry.player === playerName)) {
                console.log(`Player: ${playerName}, Score: 0 (Not on leaderboard)`);
            }
        }
    }

    console.log('---------------------------\n');
}

function clear_leaderboard() {
    leaderboard = [];
    console.log('Leaderboard cleared.\n');
}

function play_two_players() {
    console.log('Two-Player Mode\n');
    const player1 = prompt('Enter Player 1 name: ');
    const player2 = prompt('Enter Player 2 name: ');
    console.log('\nLet\'s begin!\n');
    play_game(player1, player2);
}

function play_with_ai() {
    console.log('Single-Player Mode against AI\n');
    const player1 = prompt('Enter your name: ');
    console.log('\nLet\'s begin!\n');
    play_game(player1);
}

function main() {
    display_welcome_screen();

    while (true) {
        console.log('Main Menu');
        console.log('---------------------------');
        console.log('1. Play Two Players');
        console.log('2. Play with AI');
        console.log('3. View Leaderboard');
        console.log('4. Clear Leaderboard');
        console.log('5. Quit');
        console.log('---------------------------');

        const choice = prompt('Enter your choice: ');

        if (choice === '1') {
            play_two_players();
        } else if (choice === '2') {
            play_with_ai();
        } else if (choice === '3') {
            display_leaderboard();
        } else if (choice === '4') {
            clear_leaderboard();
        } else if (choice === '5') {
            console.log('Goodbye!\n');
            break;
        } else {
            console.log('Invalid choice. Please try again.\n');
        }
    }
}

main();
