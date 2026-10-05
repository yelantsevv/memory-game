const STORAGE_KEY = "memory-game";

function createModal(titleText, id, modalClass) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay hidden";
  overlay.id = id;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const panel = document.createElement("div");
  panel.className = "modal-panel";

  const header = document.createElement("div");
  header.className = "modal-header";

  const heading = document.createElement("h2");
  heading.className = "modal-title";
  heading.textContent = titleText;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close-button";
  closeButton.setAttribute("aria-label", "Close modal");
  closeButton.textContent = "✕";

  const content = document.createElement("div");
  content.className = "modal-content";

  const actions = document.createElement("div");
  actions.className = "modal-actions";

  header.append(heading, closeButton);
  panel.append(header, content, actions);
  overlay.appendChild(panel);

  closeButton.addEventListener("click", () => closeModal({ overlay, id }));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal({ overlay, id });
    }
  });

  return { overlay, content, actions, heading, modalClass };
}

const winModal = createModal("Victory", "win-modal", "win");
const winMessage = document.createElement("p");
winMessage.className = "modal-message";
winMessage.textContent = "You solved the board!";
const winTitle = document.createElement("h3");
winTitle.className = "modal-message";
winTitle.textContent = "Congratulations!";

const winNewGameButton = document.createElement("button");
winNewGameButton.type = "button";
winNewGameButton.className = "button";
winNewGameButton.textContent = "New Game";

const winCloseButton = document.createElement("button");
winCloseButton.type = "button";
winCloseButton.className = "button secondary-button";
winCloseButton.textContent = "Close";
winCloseButton.addEventListener("click", () => closeModal(winModal));

winModal.content.append(winTitle, winMessage);
winModal.actions.append(winNewGameButton, winCloseButton);
document.body.appendChild(winModal.overlay);

const leaderboardModal = createModal(
  "Leaderboard",
  "leaderboard-modal",
  "leaderboard",
);

const leaderboardTable = document.createElement("div");
leaderboardTable.className = "leaderboard-table";

const leaderboardHeader = document.createElement("div");
leaderboardHeader.className = "leaderboard-row leaderboard-header";

const placeHeader = document.createElement("div");
placeHeader.textContent = "Place";
const movesHeader = document.createElement("div");
movesHeader.textContent = "Moves";
const dateHeader = document.createElement("div");
dateHeader.textContent = "Date";
leaderboardHeader.append(placeHeader, movesHeader, dateHeader);

const leaderboardBody = document.createElement("div");
leaderboardBody.className = "leaderboard-body";
leaderboardTable.append(leaderboardHeader, leaderboardBody);
leaderboardModal.content.appendChild(leaderboardTable);

const leaderboardCloseButton = document.createElement("button");
leaderboardCloseButton.type = "button";
leaderboardCloseButton.className = "button secondary-button";
leaderboardCloseButton.textContent = "Close";
leaderboardCloseButton.addEventListener("click", () =>
  closeModal(leaderboardModal),
);
leaderboardModal.actions.appendChild(leaderboardCloseButton);
document.body.appendChild(leaderboardModal.overlay);

function openModal(modal) {
  modal.overlay.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.overlay.classList.add("hidden");
  const anyOpen = document.querySelector(".modal-overlay:not(.hidden)");
  if (!anyOpen) {
    document.body.classList.remove("modal-open");
  }
}
function getLeaderboard() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function sortLeaderboard(results) {
  return [...results].sort((left, right) => {
    if (left.moves !== right.moves) {
      return left.moves - right.moves;
    }
    return new Date(left.date) - new Date(right.date);
  });
}

function saveLeaderboard(results) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function renderLeaderboard() {
  const results = sortLeaderboard(getLeaderboard()).slice(0, 10);
  leaderboardBody.replaceChildren();

  if (results.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.className = "leaderboard-row empty";
    emptyRow.textContent = "No results yet";
    leaderboardBody.appendChild(emptyRow);
    return;
  }

  results.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";

    const place = document.createElement("div");
    const moves = document.createElement("div");
    const date = document.createElement("div");

    place.textContent = String(index + 1);
    moves.textContent = `${entry.moves} moves`;
    date.textContent = formatDate(entry.date);
    row.append(place, moves, date);
    leaderboardBody.appendChild(row);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

export {
  getLeaderboard,
  sortLeaderboard,
  openModal,
  closeModal,
  saveLeaderboard,
  renderLeaderboard,
  leaderboardModal,
  winTitle,
  winMessage,
  winModal,
  winNewGameButton,
};
