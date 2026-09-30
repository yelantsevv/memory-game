import {
  closeModal,
  getLeaderboard,
  sortLeaderboard,
  openModal,
  saveLeaderboard,
  winTitle,
  winMessage,
  winModal,
} from "./leader.js";

const SYMBOLS = ["🍉", "🍋", "🍇", "🍒", "🍊", "🍎", "🍍", "🍓"];

const state = {
  deck: [],
  selectedCards: [],
  moves: 0,
  matches: 0,
  isLocked: false,
  mismatchTimer: null,
  isGameFinished: false,
  hasSavedResult: false,
};

let board;
let movesValue;
let matchesValue;

function initializeBoard(elements) {
  board = elements.board;
  movesValue = elements.movesValue;
  matchesValue = elements.matchesValue;
}

function buildDeck() {
  const cards = SYMBOLS.flatMap((symbol, index) => [
    { id: `${index}a`, symbol },
    { id: `${index}b`, symbol },
  ]);
  return shuffle(cards);
}
function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; --index) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createCard(cardData) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.id = cardData.id;
  card.dataset.symbol = cardData.symbol;
  card.setAttribute("aria-label", "Hidden card");

  const back = document.createElement("span");
  back.className = "card-back";
  back.setAttribute("aria-hidden", "true");

  const face = document.createElement("span");
  face.className = "card-face";
  face.textContent = cardData.symbol;

  card.append(back, face);

  card.addEventListener("click", handleCardClick);
  return card;
}

function renderBoard() {
  board.replaceChildren();
  state.deck.forEach((cardData) => {
    board.appendChild(createCard(cardData));
  });
}

function updateStats() {
  movesValue.textContent = String(state.moves);
  matchesValue.textContent = `${state.matches} / ${SYMBOLS.length}`;
}
function updateCardState(cardElement, isFlipped, isMatched) {
  cardElement.classList.toggle("is-flipped", isFlipped);
  cardElement.classList.toggle("is-matched", isMatched);

  const isLocked = isMatched || isFlipped;
  cardElement.disabled = isLocked && !isMatched;
  cardElement.setAttribute(
    "aria-label",
    isFlipped ? `Card ${cardElement.dataset.symbol}` : "Hidden card",
  );
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (state.isLocked || state.isGameFinished) {
    return;
  }

  if (
    clickedCard.classList.contains("is-flipped") ||
    clickedCard.classList.contains("is-matched")
  ) {
    return;
  }

  updateCardState(clickedCard, true, false);
  state.selectedCards.push(clickedCard);

  if (state.selectedCards.length === 1) {
    return;
  }

  state.moves += 1;
  updateStats();

  const [firstCard, secondCard] = state.selectedCards;
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    updateCardState(firstCard, true, true);
    updateCardState(secondCard, true, true);
    state.matches += 1;
    state.selectedCards = [];
    updateStats();

    if (state.matches === SYMBOLS.length) {
      finishGame();
    }
    return;
  }

  state.isLocked = true;
  state.mismatchTimer = setTimeout(() => {
    clearMismatch();
  }, 900);
}

function finishGame() {
  state.isGameFinished = true;

  if (!state.hasSavedResult) {
    const leaderboard = getLeaderboard();
    leaderboard.push({
      moves: state.moves,
      date: new Date().toISOString(),
    });

    const sorted = sortLeaderboard(leaderboard).slice(0, 10);
    saveLeaderboard(sorted);
    state.hasSavedResult = true;
  }

  winTitle.textContent = "You won!";
  winMessage.textContent = `You solved the board in ${state.moves} moves.`;
  openModal(winModal);
}
function clearMismatch() {
  if (state.mismatchTimer) {
    clearTimeout(state.mismatchTimer);
    state.mismatchTimer = null;
  }

  if (state.selectedCards.length === 2) {
    const [firstCard, secondCard] = state.selectedCards;
    updateCardState(firstCard, false, false);
    updateCardState(secondCard, false, false);
    state.selectedCards = [];
    state.isLocked = false;
  }
}

function startNewGame() {
  if (state.mismatchTimer) {
    clearTimeout(state.mismatchTimer);
    state.mismatchTimer = null;
  }

  state.deck = buildDeck();
  state.selectedCards = [];
  state.moves = 0;
  state.matches = 0;
  state.isLocked = false;
  state.isGameFinished = false;
  state.hasSavedResult = false;
  closeModal(winModal);
  updateStats();
  renderBoard();
}

export { initializeBoard, startNewGame };
