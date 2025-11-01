const MASTER_WORD_LIST = [
    "Apple", "Music", "River", "Mountain", "Ocean", "Star", "Sun", "Moon",
    "Book", "Key", "Tree", "Flower", "Bridge", "Road", "Car", "Train",
    "Boat", "Plane", "Bird", "Cat", "Dog", "Fish", "Lion", "Tiger",
    "Bear", "Horse", "Cow", "Pig", "Sheep", "Goat", "Duck", "Frog",
    "Snake", "Spider", "Ant", "Bee", "Fly", "Baby", "Child", "Man",
    "Woman", "Doctor", "Police", "Fire", "Water", "Earth", "Air",
    "Love", "Hate", "War", "Peace", "Life", "Death", "Time", "Space",
    "Art", "Color", "Red", "Green", "Blue", "Yellow", "Black", "White",
    "Food", "Bread", "Cheese", "Milk", "Egg", "Meat", "Fruit", "Pizza",
    "Heart", "Mind", "Soul", "Body", "Hand", "Foot", "Eye", "Ear",
    "Nose", "Mouth", "Tooth", "Hair", "Blood", "Bone", "Skin", "Gold",
    "Silver", "Iron", "Steel", "Wood", "Glass", "Paper", "Stone", "Rock",
    "Sand", "Clay", "Cloth", "Silk", "Wool", "Cotton", "Money", "Coin",
    "King", "Queen", "Prince", "Princess", "Castle", "Sword", "Shield", "War",
    "School", "Teacher", "Student", "Desk", "Chair", "Door", "Window", "Wall",
    "Floor", "Roof", "Room", "Home", "House", "City", "Town", "Village",
    "Farm", "Field", "Forest", "Desert", "Island", "Beach", "Wave", "Sky",
    "Cloud", "Rain", "Snow", "Wind", "Storm", "Sun", "Light", "Dark",
    "Day", "Night", "Morning", "Evening", "Week", "Month", "Year", "Date",
    "Clock", "Watch", "Phone", "Computer", "TV", "Radio", "Photo", "Paint",
    "Song", "Dance", "Movie", "Game", "Sport", "Ball", "Goal", "Team",
    "Win", "Loss", "Play", "Work", "Sleep", "Dream", "Talk", "Sing",
    "Read", "Write", "Draw", "Run", "Walk", "Jump", "Swim", "Fly",
    "Smile", "Laugh", "Cry", "Sad", "Happy", "Angry", "Fear", "Joy"
];

// --- DOM ELEMENTS ---
const scoreEl = document.getElementById('score');
const cardsRemainingEl = document.getElementById('cards-remaining');
const cardContainerEl = document.getElementById('card-container');
const swipeHintEl = document.getElementById('swipe-hint');

// Modal elements
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const finalMessageEl = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-again-btn');

// Touch/swipe handling variables
let touchStartX = 0;
let touchStartY = 0;
let currentCard = null;
let isSwipeEnabled = false;

// --- GAME STATE ---
let state = {
    score: 0,
    cardIndex: 0,
    cards: [], // Array of { id: number, words: string[], status: 'hidden' | 'revealed' | 'success' | 'fail' }
};

// --- FUNCTIONS ---

/**
 * Gets N unique random words from the master list.
 */
function getRandomWords(numWords) {
    const shuffled = [...MASTER_WORD_LIST].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numWords);
}

/**
 * Initializes or resets the game.
 */
function initGame() {
    state.score = 0;
    state.cardIndex = 0;
    state.cards = [];
    for (let i = 0; i < 13; i++) {
        state.cards.push({
            id: i,
            words: getRandomWords(5),
            status: 'hidden',
        });
    }
    gameOverModal.classList.add('hidden');
    render();
}

/**
 * Renders the entire UI based on the current state.
 */
function render() {
    // Update score display
    scoreEl.textContent = state.score;

    // Update cards remaining
    cardsRemainingEl.textContent = 13 - state.cardIndex;

    // Clear and render card
    cardContainerEl.innerHTML = createCardHTML(state.cards[state.cardIndex]);

    // Show/hide swipe hint based on card status
    const currentCard = state.cards[state.cardIndex];
    if (currentCard && currentCard.status === 'guessing') {
        swipeHintEl.classList.remove('hidden');
        isSwipeEnabled = true;
    } else {
        swipeHintEl.classList.add('hidden');
        isSwipeEnabled = false;
    }

    // Set up touch listeners for the current card if swipeable
    setupTouchListeners();

    // Check for game over
    if (state.cardIndex === 13) {
        showGameOverModal();
    }
}

/**
 * Creates the HTML string for a single card based on its state.
 */
function createCardHTML(card) {
    if (!card) return '';

    let content = '';
    
    switch (card.status) {
        case 'hidden':
            content = `
                <div class="card card-hidden card-enter flex flex-col justify-center items-center p-6" data-id="${card.id}">
                    <div class="text-center">
                        <div class="text-6xl mb-4">🎴</div>
                        <h2 class="text-3xl font-bold mb-4">Card ${card.id + 1}</h2>
                        <p class="text-lg mb-6 opacity-90">Ready to reveal the words?</p>
                        <button data-id="${card.id}" data-action="reveal" class="btn-primary">
                            ✨ Reveal Words
                        </button>
                    </div>
                </div>
            `;
            break;

        case 'revealed':
            const wordsHTML = card.words.map((word, i) =>
                `<div class="word-item">
                    <span class="font-bold text-blue-300">${i + 1}.</span> ${word}
                </div>`
            ).join('');

            content = `
                <div class="card card-revealed card-enter flex flex-col p-6" data-id="${card.id}">
                    <div class="text-center mb-4">
                        <h3 class="text-xl font-bold text-white mb-2">Words for Card ${card.id + 1}</h3>
                        <p class="text-sm text-gray-300 opacity-80">Write your clues, then proceed</p>
                    </div>
                    <div class="flex-grow space-y-2 mb-6">
                        ${wordsHTML}
                    </div>
                    <button data-id="${card.id}" data-action="proceed" class="btn-primary">
                        🎯 Start Guessing Phase
                    </button>
                </div>
            `;
            break;

        case 'guessing':
            content = `
                <div class="card card-guessing card-enter flex flex-col justify-center items-center p-6" 
                     data-id="${card.id}" data-swipeable="true">
                    <div class="swipe-indicator left">❌</div>
                    <div class="swipe-indicator right">✅</div>
                    
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🤔</div>
                        <h3 class="text-2xl font-bold text-white mb-2">Time to Guess!</h3>
                        <p class="text-gray-300">Did the guesser get it right?</p>
                    </div>
                    
                    <div class="action-buttons">
                        <button data-id="${card.id}" data-action="fail" class="btn-danger">
                            ❌ Failed
                        </button>
                        <button data-id="${card.id}" data-action="success" class="btn-success">
                            ✅ Success
                        </button>
                    </div>
                    
                    <button data-id="${card.id}" data-action="reveal" 
                            class="mt-4 text-blue-300 hover:text-blue-200 transition-colors text-sm opacity-70">
                        👁️ Show Words Again
                    </button>
                </div>
            `;
            break;

        case 'success':
        case 'fail':
            // After success or fail, we immediately move to the next card or game over.
            // This state is transient.
            break;
    }
    return content;
}

/**
 * Shows the game over modal with the final score.
 */
function showGameOverModal() {
    finalScoreEl.textContent = state.score;
    
    let message = "Good effort! Keep practicing!";
    if (state.score === 13) message = "🏆 Perfect game! Absolutely incredible teamwork!";
    else if (state.score >= 12) message = "🌟 Almost perfect! Outstanding performance!";
    else if (state.score >= 10) message = "🎯 Amazing job! Excellent communication!";
    else if (state.score >= 8) message = "👏 Great teamwork! Well done!";
    else if (state.score >= 6) message = "👍 Good effort! Room for improvement!";
    else if (state.score >= 4) message = "💪 Keep trying! Practice makes perfect!";
    
    finalMessageEl.textContent = message;
    gameOverModal.classList.remove('hidden');
}

/**
 * Handles all clicks on the card container using event delegation.
 */
function handleCardClick(e) {
    const target = e.target.closest('button');
    if (!target) return; // Click wasn't on a button

    const action = target.dataset.action;
    const id = parseInt(target.dataset.id);
    
    handleCardAction(action, id);
}

/**
 * Handles card actions (from both clicks and swipes)
 */
function handleCardAction(action, id) {
    const card = state.cards.find(c => c.id === id);
    if (!card || !action) return;

    switch (action) {
        case 'reveal':
            card.status = 'revealed';
            render();
            break;
        case 'proceed':
            card.status = 'guessing';
            render();
            break;
        case 'success':
            card.status = 'success';
            state.score++;
            state.cardIndex++;
            showFeedback('success');
            setTimeout(() => render(), 800);
            break;
        case 'fail':
            card.status = 'fail';
            state.cardIndex++;
            showFeedback('fail');
            setTimeout(() => render(), 800);
            break;
    }
}

/**
 * Shows visual feedback for success/fail actions
 */
function showFeedback(type) {
    const cardElement = cardContainerEl.querySelector('.card');
    if (!cardElement) return;

    if (type === 'success') {
        cardElement.classList.add('swipe-success');
    } else {
        cardElement.classList.add('swipe-fail');
    }
}

/**
 * Sets up touch event listeners for swipe functionality
 */
function setupTouchListeners() {
    const cardElement = cardContainerEl.querySelector('[data-swipeable="true"]');
    if (!cardElement) return;

    currentCard = cardElement;

    // Remove existing listeners to prevent duplicates
    cardElement.removeEventListener('touchstart', handleTouchStart);
    cardElement.removeEventListener('touchmove', handleTouchMove);
    cardElement.removeEventListener('touchend', handleTouchEnd);

    // Add new listeners
    cardElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    cardElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: false });
}

/**
 * Handle touch start
 */
function handleTouchStart(e) {
    if (!isSwipeEnabled) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    currentCard.classList.add('swiping');
}

/**
 * Handle touch move
 */
function handleTouchMove(e) {
    if (!isSwipeEnabled || !currentCard) return;
    
    e.preventDefault(); // Prevent scrolling
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // Only handle horizontal swipes (ignore vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const rotation = deltaX * 0.1; // Subtle rotation effect
        currentCard.style.transform = `translateX(${deltaX * 0.5}px) rotate(${rotation}deg)`;
        
        // Show swipe indicators
        const leftIndicator = currentCard.querySelector('.swipe-indicator.left');
        const rightIndicator = currentCard.querySelector('.swipe-indicator.right');
        
        if (deltaX < -50) {
            leftIndicator.style.opacity = Math.min(1, Math.abs(deltaX) / 100);
            rightIndicator.style.opacity = 0;
            currentCard.style.background = 'var(--danger-gradient)';
        } else if (deltaX > 50) {
            rightIndicator.style.opacity = Math.min(1, deltaX / 100);
            leftIndicator.style.opacity = 0;
            currentCard.style.background = 'var(--success-gradient)';
        } else {
            leftIndicator.style.opacity = 0;
            rightIndicator.style.opacity = 0;
            currentCard.style.background = '';
        }
    }
}

/**
 * Handle touch end
 */
function handleTouchEnd(e) {
    if (!isSwipeEnabled || !currentCard) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const threshold = 100; // Minimum swipe distance
    
    currentCard.classList.remove('swiping');
    
    // Reset visual state
    currentCard.style.transform = '';
    currentCard.style.background = '';
    
    const leftIndicator = currentCard.querySelector('.swipe-indicator.left');
    const rightIndicator = currentCard.querySelector('.swipe-indicator.right');
    leftIndicator.style.opacity = 0;
    rightIndicator.style.opacity = 0;
    
    // Check if swipe was significant enough
    if (Math.abs(deltaX) > threshold) {
        const cardId = parseInt(currentCard.dataset.id);
        
        if (deltaX > 0) {
            // Swiped right - success
            handleCardAction('success', cardId);
        } else {
            // Swiped left - fail
            handleCardAction('fail', cardId);
        }
    }
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    cardContainerEl.addEventListener('click', handleCardClick);
    playAgainBtn.addEventListener('click', initGame);

    // Start the game on load
    initGame();
});