import { board } from "./script.js";

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
  // console.log(copy);
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

  card.addEventListener("click", () => {});
  return card;
}

function renderBoard() {
  board.replaceChildren();
  state.deck.forEach((cardData) => {
    // console.log(cardData);
    board.appendChild(createCard(cardData));
  });
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
  // console.log(state);
  renderBoard();
}


export { startNewGame };
