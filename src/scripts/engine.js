const CARD_IMAGES = ['Gill', 'Gohan', 'Goku', 'Pan1', 'Trunks', 'Vegeta', 'Gotan', 'Baby', "Mr. Satan", "Super Saiyan"];

const cards = [];
let flippedCards = [];
let isBoardLocked = false;
let matchedPairs = 0;
let startTime;
let timerElement;
let timerInterval;

function createCardElement(cardName) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.card = cardName;

    const cardFront = document.createElement('img');
    cardFront.src = `./src/assets/images/${cardName}.png`;
    cardFront.alt = 'face da carta';
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('img');
    cardBack.src = './src/assets/images/Fundo gt.png';
    cardBack.alt = 'traz da carta';
    cardBack.classList.add('card-back');

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    card.addEventListener('click', flipCard);

    return card;
}

function shuffleCards() {
    const allCards = CARD_IMAGES.concat(CARD_IMAGES);
    allCards.forEach((cardName) => {
        const card = createCardElement(cardName);
        cards.push(card);
    });

    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * cards.length);
        card.style.order = randomPosition;
    });
}

function flipCard() {
    if (isBoardLocked || flippedCards.length === 2 || this.classList.contains('flip')) {
        return;
    }

    this.classList.add('flip');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.card === card2.dataset.card) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });

    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === CARD_IMAGES.length) {
        showVictoryMessage();
    }
}

function unflipCards() {
    isBoardLocked = true;

    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.remove('flip');
            card.addEventListener('click', flipCard);
        });

        flippedCards = [];
        isBoardLocked = false;
    }, 1000);
}

function resetGame() {
    stopTimer();
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });

    flippedCards = [];
    isBoardLocked = false;
    matchedPairs = 0;

    shuffleCards();

    // Esconder a mensagem de vitória e o botão de reiniciar
    const victoryMessage = document.getElementById('victoryMessage');
    const restartButton = document.getElementById('restartButton');
    victoryMessage.classList.add('hidden');
    restartButton.classList.add('hidden');

    // Reiniciar o cronômetro
    startTimer();
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function showVictoryMessage() {
    stopTimer();

    const victoryMessage = document.getElementById('victoryMessage');
    const victoryTime = document.getElementById('victoryTime');
    const currentTime = Math.floor((Date.now() - startTime) / 1000);

    // Adicionar linha para tocar a música de vitória
    const victoryMusic = document.getElementById('victoryMusic');
    victoryMusic.play();

    victoryTime.textContent = `Tempo de Jogo: ${currentTime} segundos`;
    victoryMessage.classList.remove('hidden');
    victoryMessage.classList.add('show');

    // Adicionar linhas para mostrar o botão de reiniciar
    const restartButton = document.getElementById('restartButton');
    restartButton.classList.remove('hidden');
    restartButton.classList.add('show');
}


function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = `Tempo Decorrido: ${currentTime} segundos`;
}

function restartGame() {
    location.reload();
}

function init() {
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.15; // Defina o volume para 15%
    bgm.play();

    // Adicionar elemento para a música de vitória
    const victoryMusic = document.createElement('audio');
    victoryMusic.id = 'victoryMusic';
    victoryMusic.src = './src/assets/audios/victoryMusic.mp3';
    document.body.appendChild(victoryMusic);

    const gameBoard = document.querySelector('.memory-game');
    shuffleCards();
    cards.forEach((card) => {
        gameBoard.appendChild(card);
    });

    // Adicionar botão de reset
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);

    // Adicionar elemento para o cronômetro
    timerElement = document.getElementById('timer');

    // Iniciar cronômetro
    startTimer();

    // Adicionar botão de reiniciar após a vitória
    const restartButton = document.getElementById('restartButton');
    restartButton.addEventListener('click', restartGame);
    
     // Adicionar evento de clique no corpo para permitir a reprodução de áudio
     document.body.addEventListener('click', () => {
        bgm.play();
        document.body.removeEventListener('click', () => {});
    });
}

init();
