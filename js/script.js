import { startNewGame } from "./board.js";

const app = document.createElement("div");
app.className = "app";

const header = document.createElement("header");
header.className = "header";

const title = document.createElement("h1");
title.className = "title";
title.textContent = "Memory Game";

const controls = document.createElement("div");
controls.className = "controls";
const newGameButton = document.createElement("button");
newGameButton.type = "button";
newGameButton.className = "button";
newGameButton.textContent = "New Game";
newGameButton.addEventListener("click", () => {});

const leaderButton = document.createElement("button");
leaderButton.type = "button";
leaderButton.className = "button";
leaderButton.textContent = "Leader";
leaderButton.addEventListener("click", () => {});

controls.append(newGameButton, leaderButton);
header.append(title, controls);

const scoreboard = document.createElement("div");
scoreboard.className = "scoreboard";

const board = document.createElement("div");
board.className = "board";

const movesBox = document.createElement("div");
movesBox.className = "stat-box";
const movesLabel = document.createElement("span");
movesLabel.className = "stat-label";
movesLabel.textContent = "Moves";
const movesValue = document.createElement("span");
movesValue.className = "stat-value";
movesValue.textContent = "0";
movesBox.append(movesLabel, movesValue);

const matchesBox = document.createElement("div");
matchesBox.className = "stat-box";
const matchesLabel = document.createElement("span");
matchesLabel.className = "stat-label";
matchesLabel.textContent = "Found";
const matchesValue = document.createElement("span");
matchesValue.className = "stat-value";
matchesValue.textContent = `0 / 8`;
matchesBox.append(matchesLabel, matchesValue);

scoreboard.append(movesBox, matchesBox);

app.append(header, scoreboard, board);
document.body.appendChild(app);

export { board };

startNewGame();

