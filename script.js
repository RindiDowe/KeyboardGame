let draggables = document.querySelectorAll('.key');
let slots = document.querySelectorAll('.key-slot');
const sound = document.getElementById('success-sound');
const banner = document.getElementById('complete-message');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('reset-button');

let score = 0;
let startTime = null;
let timerInterval = null;

function startTimer() {
  if (startTime) return;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = elapsed;
  }, 1000);
}

function resetGame() {
  banner.classList.add('hidden');
  timerDisplay.textContent = "0";
  scoreDisplay.textContent = "0";
  clearInterval(timerInterval);
  startTime = null;
  score = 0;

  slots.forEach(slot => {
    slot.textContent = '';
    slot.style.background = '#fff';
  });

  draggables.forEach(key => {
    key.classList.remove('correct');
    key.setAttribute('draggable', 'true');
  });

  const container = document.querySelector('.draggables');
  const keys = Array.from(container.children);
  keys.sort(() => Math.random() - 0.5);
  keys.forEach(k => container.appendChild(k));
}

draggables.forEach(key => {
  key.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', key.dataset.key);
  });
});

slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', e => {
    e.preventDefault();
    const draggedKey = e.dataTransfer.getData('text/plain');
    const matchingKey = document.querySelector(`.key[data-key="${draggedKey}"]`);

    if (!startTime) startTimer();

    if (draggedKey === slot.dataset.key) {
      if (slot.textContent === '') {
        slot.textContent = draggedKey;
        slot.style.background = '#a3be8c';
        matchingKey.classList.add('correct');
        matchingKey.setAttribute('draggable', 'false');
        sound.currentTime = 0;
        sound.play();
        score++;
        scoreDisplay.textContent = score;
      }

      if (document.querySelectorAll('.key:not(.correct)').length === 0) {
        clearInterval(timerInterval);
        setTimeout(() => banner.classList.remove('hidden'), 300);
      }
    } else {
      alert('Oops! Try again.');
    }
  });
});

resetBtn.addEventListener('click', resetGame);