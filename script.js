/* Add your CSS styles here */

body {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: #f2f2f2;
    margin: 0;
    padding: 0;
}

h1 {
    color: #333;
}

.game-settings {
    margin: 20px auto;
    width: 80%;
    max-width: 400px;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-settings label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.game-settings select,
.game-settings input[type="text"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.game-settings button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.game-settings button.hidden {
    display: none;
}

.gameplay {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 20px auto;
    width: 80%;
    max-width: 400px;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.player-info p {
    margin: 0;
    font-weight: bold;
}

.game-controls {
    margin-top: 20px;
}

.guess-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.guess-submit {
    padding: 10px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.message {
    margin-top: 20px;
    font-weight: bold;
}

.winner {
    margin-top: 10px;
    font-weight: bold;
    color: #28a745;
}

/* Leaderboard styles */
#leaderboard {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
    text-align: left;
}

#leaderboard h2 {
    margin: 0;
    font-weight: bold;
    font-size: 1.5rem;
}

#leaderboardList {
    list-style: none;
    padding: 0;
}

#leaderboardList li {
    margin-bottom: 10px;
}

#leaderboardCloseButton {
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 0.9rem;
    cursor: pointer;
}

#leaderboardCloseButton:hover {
    background-color: #c82333;
}

/* Dark Mode Styles */
.dark-mode {
    background-color: #333;
    color: #fff;
}

.dark-mode h1 {
    color: #fff;
}

.dark-mode .game-settings,
.dark-mode .gameplay {
    background-color: #444;
    border: 1px solid #666;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .game-settings label,
.dark-mode .game-settings button,
.dark-mode .gameplay .player-info p,
.dark-mode .gameplay .game-controls,
.dark-mode .guess-field,
.dark-mode .guess-submit,
.dark-mode .message,
.dark-mode .winner,
.dark-mode #leaderboard {
    color: #fff;
}

.dark-mode #leaderboard {
    background-color: #444;
    border: 1px solid #666;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode #leaderboardCloseButton {
    background-color: #dc3545;
}

.dark-mode #leaderboardCloseButton:hover {
    background-color: #c82333;
}
