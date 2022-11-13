import Swal from 'sweetalert2';

async function fetchAPI(deckId) {
  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }
}

export function getNewDeck() {
  return fetchAPI('new/');
}

export async function drawCard(deckId) {
  const card = await fetchAPI(`${deckId}/draw/`);
  return card.cards[0];
}

export function shuffleDeck(deckId) {
  return fetchAPI(`${deckId}/shuffle/`);
}
