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

// Modal elements
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const finalMessageEl = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-again-btn');

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
    let baseClasses = 'card rounded-xl shadow-lg flex flex-col justify-between items-center p-3 min-h-[350px] w-[450px] transition-all';

    switch (card.status) {
        case 'hidden':
            content = `
                <div class="${baseClasses} bg-cyan-600 cursor-pointer hover:bg-cyan-500">
                    <span class="text-3xl font-bold">Card ${card.id + 1}</span>
                    <button data-id="${card.id}" data-action="reveal" 
                            class="bg-white text-cyan-700 font-semibold py-2 px-4 rounded-lg w-full">
                        Reveal
                    </button>
                </div>
            `;
            break;

        case 'revealed':
            const wordsHTML = card.words.map((word, i) =>
                `<li class="text-lg py-1 px-2 rounded bg-gray-700 word-item">
                    <span class="font-bold text-cyan-300">${i + 1}.</span> ${word}
                </li>`
            ).join('');

            content = `
                <div class="${baseClasses} bg-gray-800 border border-gray-700">
                    <ol class="list-none space-y-2 w-full mb-3">
                        ${wordsHTML}
                    </ol>
                    <button data-id="${card.id}" data-action="proceed" 
                            class="bg-cyan-600 hover:bg-cyan-700 font-bold py-2 px-3 rounded-lg w-full">
                        Proceed to Guessing
                    </button>
                </div>
            `;
            break;

        case 'guessing':
            content = `
                <div class="${baseClasses} bg-gray-800 border border-gray-700">
                    <div class="flex flex-col items-center justify-center h-full">
                        <p class="text-2xl text-gray-400 mb-4">Guesser, make your guess!</p>
                        <div class="grid grid-cols-2 gap-2 w-full">
                            <button data-id="${card.id}" data-action="success" 
                                    class="bg-green-600 hover:bg-green-500 font-bold py-2 px-3 rounded-lg w-full">
                                Success
                            </button>
                            <button data-id="${card.id}" data-action="fail" 
                                    class="bg-red-600 hover:bg-red-500 font-bold py-2 px-3 rounded-lg w-full">
                                Fail
                            </button>
                        </div>
                        <button data-id="${card.id}" data-action="reveal" 
                                class="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors">
                            Show Words Again
                        </button>
                    </div>
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
    let message = "Good effort!";
    if (state.score >= 12) message = "Perfect game! Incredible!";
    else if (state.score >= 10) message = "Amazing job!";
    else if (state.score >= 8) message = "Great teamwork!";
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
            render();
            break;
        case 'fail':
            card.status = 'fail';
            state.cardIndex++;
            render();
            break;
    }
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    cardContainerEl.addEventListener('click', handleCardClick);
    playAgainBtn.addEventListener('click', initGame);

    // Start the game on load
    initGame();
});