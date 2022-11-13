import './style.css';
import { startNewGame, drawNewCard, stopGame } from './helpers/game';

const shuffleButton = document.querySelector('.shuffle');
const drawButton = document.querySelector('.draw');
const stopButton = document.querySelector('.stop');

shuffleButton.addEventListener('click', startNewGame);
drawButton.addEventListener('click', drawNewCard);
stopButton.addEventListener('click', stopGame);
