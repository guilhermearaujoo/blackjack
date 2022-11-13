import Swal from 'sweetalert2';
import { getNewDeck, drawCard, shuffleDeck } from './api';

let deckId;
let playersPoints = {
  1: 0,
  2: 0,
};
const LOST_NUMBER = 21;
const DEALER_STOP_1 = 12;
const DEALER_STOP_2 = 15;

const shuffleButton = document.querySelector('.shuffle');
const drawButton = document.querySelector('.draw');
const stopButton = document.querySelector('.stop');

function restartGame() {
  playersPoints = {
    1: 0,
    2: 0,
  };
  document.querySelector('.player-1.score').textContent = 0;
  document.querySelector('.player-2.score').textContent = 0;
  document.querySelector('.player-1.cards').textContent = '';
  document.querySelector('.player-2.cards').textContent = '';
}

export async function startNewGame() {
  restartGame();
  const response = await getNewDeck();
  const data = await shuffleDeck(response.deck_id);

  deckId = data.deck_id;
  shuffleButton.disabled = true;
  drawButton.disabled = false;
  stopButton.disabled = false;
}

function addCardToPlayer(card, player) {
  const img = document.createElement('img');
  img.src = card.image;
  img.alt = `${card.value} of ${card.suit}`;
  img.classList.add('card');
  document.querySelector(`.player-${player}.cards`).appendChild(img);

  if (card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING') {
    playersPoints[player] += 10;
  } else if (card.value === 'ACE') {
    playersPoints[player] += 1;
  } else {
    playersPoints[player] += Number(card.value);
  }

  const playerScore = document.querySelector(`.player-${player}.score`);
  playerScore.textContent = playersPoints[player];
}

function showResult(result) {
  if (result === 'win') {
    Swal.fire({
      icon: 'success',
      title: 'You Won',
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'You Lost',
    });
  }
}

async function dealerTurn() {
  const card1 = await drawCard(deckId);
  addCardToPlayer(card1, 2);
  if (playersPoints[2] < DEALER_STOP_1) {
    const card2 = await drawCard(deckId);
    addCardToPlayer(card2, 2);
    if (playersPoints[2] < DEALER_STOP_2) {
      const card3 = await drawCard(deckId);
      addCardToPlayer(card3, 2);
    }
  }
}

export async function stopGame() {
  drawButton.disabled = true;
  stopButton.disabled = true;
  shuffleButton.disabled = false;

  if (playersPoints[1] > LOST_NUMBER) {
    return showResult('lose');
  }

  await dealerTurn();
  if (playersPoints[1] > playersPoints[2] || playersPoints[2] > LOST_NUMBER) {
    showResult('win');
  } else {
    showResult('lose');
  }
}

export async function drawNewCard() {
  const card = await drawCard(deckId);
  addCardToPlayer(card, 1);

  if (playersPoints[1] >= LOST_NUMBER) {
    stopGame();
  }
}
