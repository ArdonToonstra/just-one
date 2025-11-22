// Get the current word list based on user preference or game state
function getCurrentWordList() {
    // Format is "language-difficulty", e.g., "english-easy" or "dutch-hard"
    // Default fallback to english-easy
    const selection = state.wordDeck || localStorage.getItem('justOneWordDeck') || 'english-easy';
    
    // Parse the selection string (e.g., "english-hard" -> lang: english, diff: hard)
    let [lang, diff] = selection.split('-');
    
    // Handle legacy saved values if any exist (e.g., "english" -> "english-easy")
    if (!diff) {
        if (lang === 'english' || lang === 'dutch') {
            diff = 'easy';
        } else {
            // If it's completely invalid, default to english-easy
            lang = 'english';
            diff = 'easy';
        }
    }
    
    // Handle old advanced format
    if (selection === 'english-advanced') { lang = 'english'; diff = 'hard'; }
    if (selection === 'dutch-advanced') { lang = 'dutch'; diff = 'hard'; }

    // Access the data from WORD_PACKS object in words.js
    if (typeof WORD_PACKS !== 'undefined' && WORD_PACKS[lang] && WORD_PACKS[lang][diff]) {
        return WORD_PACKS[lang][diff];
    }
    
    // Fallback - check if WORD_PACKS is available
    if (typeof WORD_PACKS !== 'undefined' && WORD_PACKS.english && WORD_PACKS.english.easy) {
        return WORD_PACKS.english.easy;
    }
    
    // Final fallback if words.js isn't loaded yet
    console.error('WORD_PACKS not available, using emergency fallback');
    return [
        "Apple", "Music", "River", "Mountain", "Ocean", "Star", "Sun", "Moon",
        "Book", "Key", "Tree", "Flower", "Bridge", "Road", "Car", "Train",
        "Boat", "Plane", "Bird", "Cat", "Dog", "Fish", "Lion", "Tiger"
    ];
}

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
    gameMode: 'classic', // 'classic' or 'digital'
    digitalModeData: {
        currentWord: '',
        clues: [], // Array of { player: string, clue: string }
        currentPlayerIndex: 0,
        players: [], // Array of player names
        duplicatesRemoved: []
    }
};

// --- FUNCTIONS ---

/**
 * Gets N unique random words from the selected word list.
 */
function getRandomWords(numWords) {
    const wordList = getCurrentWordList();
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numWords);
}

/**
 * Saves the current game state to localStorage
 */
function saveGameState() {
    try {
        localStorage.setItem('justOneGameState', JSON.stringify(state));
    } catch (e) {
        console.warn('Could not save game state:', e);
    }
}

/**
 * Loads game state from localStorage
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem('justOneGameState');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Could not load game state:', e);
    }
    return null;
}

/**
 * Initializes or resets the game.
 */
function initGame(loadSaved = false) {
    // Check if we should load a saved game
    const urlParams = new URLSearchParams(window.location.search);
    const shouldResume = urlParams.get('resume') === 'true' || loadSaved;
    
    if (shouldResume) {
        const savedState = loadGameState();
        if (savedState) {
            state = savedState;
            gameOverModal.classList.add('hidden');
            render();
            showResumeMessage();
            return;
        }
    }
    
    // Start new game
    state.score = 0;
    state.cardIndex = 0;
    state.cards = [];
    state.wordDeck = localStorage.getItem('justOneWordDeck') || 'english-easy';
    state.gameMode = localStorage.getItem('justOneGameMode') || 'classic';
    
    // Initialize digital mode data
    state.digitalModeData = {
        currentWord: '',
        clues: [],
        currentPlayerIndex: 0,
        players: [],
        duplicatesRemoved: []
    };
    
    for (let i = 0; i < 13; i++) {
        if (state.gameMode === 'classic') {
            state.cards.push({
                id: i,
                words: getRandomWords(5),
                status: 'hidden',
            });
        } else {
            // Digital mode - one word per card
            state.cards.push({
                id: i,
                words: [getRandomWords(1)[0]], // Single word
                status: 'hidden',
            });
        }
    }
    gameOverModal.classList.add('hidden');
    
    // Clear any saved state when starting new game
    localStorage.removeItem('justOneGameState');
    
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
    
    // Set up digital mode input handlers if in collecting mode
    if (state.gameMode === 'digital' && currentCard && currentCard.status === 'collecting') {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => setupDigitalModeInputHandlers(), 10);
    }

    // Save game state (but not when game is over)
    if (state.cardIndex < 13) {
        saveGameState();
    }

    // Check for game over
    if (state.cardIndex === 13) {
        showGameOverModal();
        // Clear saved state when game is complete
        localStorage.removeItem('justOneGameState');
    }
}

/**
 * Creates the HTML string for a single card based on its state.
 */
function createCardHTML(card) {
    if (!card) return '';

    let content = '';
    const isDigitalMode = state.gameMode === 'digital';
    
    console.log('createCardHTML called with card status:', card.status, 'digital mode:', isDigitalMode);
    
    switch (card.status) {
        case 'hidden':
            const modeText = isDigitalMode ? 'Ready to see the word?' : 'Ready to reveal the words?';
            const buttonText = isDigitalMode ? '👁️ Show Word' : '✨ Reveal Words';
            
            content = `
                <div class="card card-hidden card-enter flex flex-col justify-center items-center p-6" data-id="${card.id}">
                    <div class="text-center">
                        <div class="text-6xl mb-4">${isDigitalMode ? '💻' : '🎴'}</div>
                        <h2 class="text-3xl font-bold mb-4">Card ${card.id + 1}</h2>
                        <p class="text-lg mb-6 opacity-90">${modeText}</p>
                        <div class="mode-indicator mb-4">
                            <span class="text-sm text-gray-300 opacity-70">
                                ${isDigitalMode ? '📱 Digital Mode' : '🎴 Classic Mode'}
                            </span>
                        </div>
                        <button data-id="${card.id}" data-action="reveal" class="btn-primary">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            `;
            break;

        case 'revealed':
            if (isDigitalMode) {
                content = createDigitalModeRevealedCard(card);
            } else {
                content = createClassicModeRevealedCard(card);
            }
            break;

        case 'collecting':
            if (isDigitalMode) {
                content = createDigitalModeCollectingCard(card);
            }
            break;

        case 'guessing':
            if (isDigitalMode) {
                content = createDigitalModeGuessingCard(card);
            } else {
                content = createClassicModeGuessingCard(card);
            }
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
 * Creates classic mode revealed card HTML
 */
function createClassicModeRevealedCard(card) {
    const wordsHTML = card.words.map((word, i) =>
        `<div class="word-item">
            <span class="font-bold text-blue-300">${i + 1}.</span> ${word}
        </div>`
    ).join('');

    return `
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
}

/**
 * Creates digital mode revealed card HTML
 */
function createDigitalModeRevealedCard(card) {
    const word = card.words[0];
    
    return `
        <div class="card card-revealed card-enter flex flex-col p-6" data-id="${card.id}">
            <div class="text-center mb-4">
                <h3 class="text-xl font-bold text-white mb-2">Word for Card ${card.id + 1}</h3>
                <p class="text-sm text-gray-300 opacity-80">All players (except guesser) should see this</p>
            </div>
            <div class="mystery-word-display mb-6">
                <div class="text-4xl font-bold text-center text-white p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    ${word}
                </div>
            </div>
            <button data-id="${card.id}" data-action="setup-players" class="btn-primary">
                👥 Set Up Players
            </button>
        </div>
    `;
}

/**
 * Creates digital mode collecting clues card HTML
 */
function createDigitalModeCollectingCard(card) {
    // Ensure digital mode data is initialized
    if (!state.digitalModeData) {
        initializeDigitalModeData();
    }
    
    // Ensure card has words
    if (!card || !card.words || card.words.length === 0) {
        return '<div class="card card-error">Error: No words available</div>';
    }
    
    const { clues, currentPlayerIndex, players } = state.digitalModeData;
    const currentPlayer = players[currentPlayerIndex];
    const word = card.words[0];
    
    const cluesListHTML = clues.map((clue, i) =>
        `<div class="clue-item">
            <span class="clue-player">${clue.player}:</span>
            <span class="clue-text">${clue.clue}</span>
        </div>`
    ).join('');

    return `
        <div class="card card-collecting card-enter flex flex-col p-6" data-id="${card.id}">
            <div class="text-center mb-4">
                <div class="mystery-word-display mb-4">
                    <div class="text-3xl font-bold text-center text-white p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                        ${word}
                    </div>
                </div>
            </div>
            
            <div class="clues-counter mb-4">
                <div class="text-center" style="background: rgba(79, 172, 254, 0.1); border: 1px solid rgba(79, 172, 254, 0.3); border-radius: 8px; padding: 0.75rem;">
                    <p class="text-sm text-gray-300">Clues collected: <strong class="text-blue-300">${clues.length}</strong></p>
                    <p class="text-xs text-gray-400 mt-1">🤫 Hidden until guessing phase</p>
                </div>
            </div>
            
            <div class="clue-input-section mb-4">
                <label class="text-sm text-gray-300 mb-2 block font-medium">💭 Add Your Clue (one word only):</label>
                <div class="input-wrapper">
                    <input type="text" id="clue-input" class="clue-input" placeholder="Enter one word clue..." maxlength="25" autocomplete="off">
                    <div class="input-help">
                        <span class="text-xs text-gray-400">One word only - help the guesser!</span>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons mb-3">
                <button data-id="${card.id}" data-action="add-clue" class="btn-primary w-full" id="add-clue-btn">
                    ✏️ Add My Clue & Pass Device
                </button>
            </div>
            
            ${clues.length > 0 ? `
                <button data-id="${card.id}" data-action="start-guessing" class="btn-primary w-full">
                    🎯 Start Guessing (${clues.length} clues)
                </button>
            ` : `
                <p class="text-center text-xs text-gray-400">Collect at least one clue to start guessing</p>
            `}
        </div>
    `;
}

/**
 * Creates classic mode guessing card HTML
 */
function createClassicModeGuessingCard(card) {
    return `
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
                    ❌ Wrong Guess
                </button>
                <button data-id="${card.id}" data-action="success" class="btn-success">
                    ✅ Correct
                </button>
            </div>
            
            <button data-id="${card.id}" data-action="pass" 
                    class="mt-3 btn-secondary w-full">
                ⏭️ Pass (Skip Card)
            </button>
            
            <button data-id="${card.id}" data-action="reveal" 
                    class="mt-2 text-blue-300 hover:text-blue-200 transition-colors text-sm opacity-70">
                👁️ Show Words Again
            </button>
        </div>
    `;
}

/**
 * Creates digital mode guessing card HTML
 */
function createDigitalModeGuessingCard(card) {
    // Ensure digital mode data is initialized
    if (!state.digitalModeData) {
        initializeDigitalModeData();
    }
    
    // Ensure card has words
    if (!card || !card.words || card.words.length === 0) {
        return '<div class="card card-error">Error: No words available</div>';
    }
    
    const { clues, duplicatesRemoved } = state.digitalModeData;
    const word = card.words[0];
    
    // Remove duplicates and get unique clues
    const uniqueClues = removeDuplicateClues(clues);
    const finalClues = uniqueClues.filter(clue => clue.clue.trim() !== '');
    
    const cluesHTML = finalClues.map((clue, i) =>
        `<div class="final-clue-item">
            ${clue.clue}
        </div>`
    ).join('');

    const duplicatesHTML = duplicatesRemoved.length > 0 ? `
        <div class="duplicates-section mb-4">
            <h4 class="text-sm text-red-300 mb-2">Removed duplicates:</h4>
            <div class="duplicates-list">
                ${duplicatesRemoved.map(dup => `<span class="duplicate-clue">${dup}</span>`).join('')}
            </div>
        </div>
    ` : '';

    return `
        <div class="card card-guessing card-enter flex flex-col justify-center items-center p-6" 
             data-id="${card.id}" data-swipeable="true">
            <div class="swipe-indicator left">❌</div>
            <div class="swipe-indicator right">✅</div>
            
            <div class="text-center mb-4">
                <div class="text-4xl mb-2">🤔</div>
                <h3 class="text-xl font-bold text-white mb-2">Time to Guess!</h3>
                <p class="text-gray-300 text-sm">Use the clues to guess the mystery word</p>
            </div>
            
            <div class="final-clues-section mb-6">
                <div class="clues-reveal-header mb-3">
                    <h4 class="text-lg font-bold text-white text-center mb-1">🔓 Clues Revealed!</h4>
                    <p class="text-xs text-gray-300 text-center">After removing duplicates:</p>
                </div>
                <div class="final-clues-grid">
                    ${cluesHTML}
                </div>
            </div>
            
            ${duplicatesHTML}
            
            <div class="action-buttons">
                <button data-id="${card.id}" data-action="fail" class="btn-danger">
                    ❌ Wrong Guess
                </button>
                <button data-id="${card.id}" data-action="success" class="btn-success">
                    ✅ Correct
                </button>
            </div>
            
            <button data-id="${card.id}" data-action="pass" 
                    class="mt-3 btn-secondary w-full">
                ⏭️ Pass (Skip Card)
            </button>
        </div>
    `;
}

/**
 * Removes duplicate clues and tracks them
 */
function removeDuplicateClues(clues) {
    const clueCount = new Map();
    const duplicates = new Set();
    
    // Count occurrences of each clue
    clues.forEach(clueObj => {
        const clueText = clueObj.clue.toLowerCase().trim();
        const count = clueCount.get(clueText) || 0;
        clueCount.set(clueText, count + 1);
        
        // If this clue appears more than once, mark it as duplicate
        if (count >= 1) {
            duplicates.add(clueObj.clue);
        }
    });
    
    // Remove ALL instances of duplicate clues
    const unique = clues.filter(clueObj => {
        const clueText = clueObj.clue.toLowerCase().trim();
        return clueCount.get(clueText) === 1;
    });
    
    state.digitalModeData.duplicatesRemoved = Array.from(duplicates);
    return unique;
}

/**
 * Initialize digital mode data structure
 */
function initializeDigitalModeData() {
    if (!state.digitalModeData) {
        state.digitalModeData = {
            players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'], // Default players
            currentPlayerIndex: 0,
            clues: [],
            duplicatesRemoved: []
        };
    }
}

/**
 * Reset digital mode data for new card (clears clues but keeps players)
 */
function resetDigitalModeData() {
    if (!state.digitalModeData) {
        initializeDigitalModeData();
    } else {
        // Keep players but reset clues for new card
        state.digitalModeData.currentPlayerIndex = 0;
        state.digitalModeData.clues = [];
        state.digitalModeData.duplicatesRemoved = [];
    }
}

/**
 * Add clue from input field
 */
function addClueFromInput(card) {
    const input = document.getElementById('clue-input');
    if (!input) return;
    
    const clue = input.value.trim();
    if (clue === '') {
        showFeedback('fail', 'Please enter a clue!');
        return;
    }
    
    // Validate clue (should be one word, no spaces)
    if (clue.includes(' ')) {
        showFeedback('fail', 'Clues should be one word only!');
        return;
    }
    
    const { players, currentPlayerIndex } = state.digitalModeData;
    const currentPlayer = players[currentPlayerIndex];
    
    // Add the clue
    state.digitalModeData.clues.push({
        player: currentPlayer,
        clue: clue
    });
    
    // Clear input
    input.value = '';
    
    // Move to next player
    nextPlayer();
    
    // Show success feedback
    showFeedback('success', `Clue "${clue}" added!`);
    
    // Re-render the card
            setTimeout(() => render(), 800);
}

/**
 * Setup digital mode input handlers after rendering
 */
function setupDigitalModeInputHandlers() {
    const input = document.getElementById('clue-input');
    const addBtn = document.getElementById('add-clue-btn');
    
    if (!input || !addBtn) return;
    
    // Handle Enter key press
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBtn.click();
        }
    });
    
    // Auto-focus the input
    input.focus();
    
    // Update button state based on input
    const updateButtonState = () => {
        const hasValue = input.value.trim().length > 0;
        addBtn.disabled = !hasValue;
        addBtn.style.opacity = hasValue ? '1' : '0.6';
    };
    
    input.addEventListener('input', updateButtonState);
    updateButtonState(); // Initial check
}/**
 * Move to next player in digital mode
 */
function nextPlayer() {
    if (!state.digitalModeData) return;
    
    state.digitalModeData.currentPlayerIndex = 
        (state.digitalModeData.currentPlayerIndex + 1) % state.digitalModeData.players.length;
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
 * Shows a brief message when game is resumed
 */
function showResumeMessage() {
    const message = document.createElement('div');
    message.className = 'resume-message';
    
    // Get deck info for display
    const deckName = getDeckDisplayName(state.wordDeck || 'english-easy');
    
    message.innerHTML = `
        <div class="resume-content">
            <div class="text-2xl mb-2">↩️</div>
            <div class="text-sm font-semibold">Game Resumed</div>
            <div class="text-xs opacity-80">Card ${state.cardIndex + 1} of 13 • Score: ${state.score}</div>
            <div class="text-xs opacity-60">${deckName}</div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => message.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

/**
 * Get display name for deck selection
 */
function getDeckDisplayName(deckCode) {
    const [lang, diff] = deckCode.split('-');
    const langMap = { english: '🇺🇸 English', dutch: '🇳🇱 Dutch' };
    const diffMap = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
    
    return `${langMap[lang] || lang} - ${diffMap[diff] || diff}`;
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
            showFeedback('success', 'Correct! +1 point');
            setTimeout(() => render(), 1000);
            break;
        case 'fail':
            // Wrong guess: discard current card AND next card (2 cards total)
            card.status = 'fail';
            const cardsLost = Math.min(2, 13 - state.cardIndex); // Don't go beyond available cards
            state.cardIndex += cardsLost;
            showFeedback('fail', `Wrong guess! Lost ${cardsLost} card${cardsLost > 1 ? 's' : ''}`);
            setTimeout(() => render(), 1200);
            break;
        case 'pass':
            // Pass: only discard current card (1 card)
            card.status = 'pass';
            state.cardIndex++;
            showFeedback('pass', 'Passed - Lost 1 card');
            setTimeout(() => render(), 1000);
            break;
        case 'setup-players':
            // Digital mode: start collecting clues
            if (state.gameMode === 'digital') {
                console.log('Setting up digital mode - card:', card);
                // Reset digital mode data for new card
                resetDigitalModeData();
                card.status = 'collecting';
                console.log('Card status set to collecting, digital data:', state.digitalModeData);
                render();
            }
            break;
        case 'add-clue':
            // Digital mode: add a clue from current player
            if (state.gameMode === 'digital') {
                addClueFromInput(card);
            }
            break;

        case 'start-guessing':
            // Digital mode: move to guessing phase
            if (state.gameMode === 'digital') {
                card.status = 'guessing';
                render();
            }
            break;
    }
}

/**
 * Shows visual feedback for success/fail/pass actions
 */
function showFeedback(type, message = '') {
    const cardElement = cardContainerEl.querySelector('.card');
    if (!cardElement) return;

    // Create feedback overlay
    const overlay = document.createElement('div');
    overlay.className = 'feedback-overlay';
    
    let emoji, bgClass, textMessage;
    
    switch (type) {
        case 'success':
            emoji = '🎉';
            bgClass = 'swipe-success';
            textMessage = message || 'Correct!';
            break;
        case 'fail':
            emoji = '💔';
            bgClass = 'swipe-fail';
            textMessage = message || 'Wrong guess!';
            break;
        case 'pass':
            emoji = '⏭️';
            bgClass = 'swipe-pass';
            textMessage = message || 'Passed';
            break;
    }
    
    overlay.innerHTML = `
        <div class="feedback-content">
            <div class="feedback-emoji">${emoji}</div>
            <div class="feedback-message">${textMessage}</div>
        </div>
    `;
    
    cardElement.classList.add(bgClass);
    cardElement.appendChild(overlay);
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
    
    // Handle both horizontal and vertical swipes
    const leftIndicator = currentCard.querySelector('.swipe-indicator.left');
    const rightIndicator = currentCard.querySelector('.swipe-indicator.right');
    
    // Reset all indicators
    leftIndicator.style.opacity = 0;
    rightIndicator.style.opacity = 0;
    currentCard.style.background = '';
    currentCard.style.transform = '';
    
    // Determine primary swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        const rotation = deltaX * 0.1;
        currentCard.style.transform = `translateX(${deltaX * 0.5}px) rotate(${rotation}deg)`;
        
        if (deltaX < -50) {
            // Swipe left - Wrong guess
            leftIndicator.style.opacity = Math.min(1, Math.abs(deltaX) / 100);
            currentCard.style.background = 'var(--danger-gradient)';
        } else if (deltaX > 50) {
            // Swipe right - Success
            rightIndicator.style.opacity = Math.min(1, deltaX / 100);
            currentCard.style.background = 'var(--success-gradient)';
        }
    } else if (Math.abs(deltaY) > 50) {
        // Vertical swipe
        if (deltaY < 0) {
            // Swipe up - Pass
            currentCard.style.transform = `translateY(${deltaY * 0.5}px)`;
            currentCard.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
            
            // Show pass indicator in center
            const passIndicator = currentCard.querySelector('.pass-indicator') || 
                (() => {
                    const indicator = document.createElement('div');
                    indicator.className = 'swipe-indicator pass-indicator';
                    indicator.style.cssText = 'top: 20px; left: 50%; transform: translateX(-50%); font-size: 2rem; font-weight: bold; color: #9ca3af;';
                    indicator.textContent = '⏭️';
                    currentCard.appendChild(indicator);
                    return indicator;
                })();
            
            passIndicator.style.opacity = Math.min(1, Math.abs(deltaY) / 100);
        }
    }
}

/**
 * Handle touch end
 */
function handleTouchEnd(e) {
    if (!isSwipeEnabled || !currentCard) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const threshold = 100; // Minimum swipe distance
    
    currentCard.classList.remove('swiping');
    
    // Reset visual state
    currentCard.style.transform = '';
    currentCard.style.background = '';
    
    const leftIndicator = currentCard.querySelector('.swipe-indicator.left');
    const rightIndicator = currentCard.querySelector('.swipe-indicator.right');
    const passIndicator = currentCard.querySelector('.pass-indicator');
    
    leftIndicator.style.opacity = 0;
    rightIndicator.style.opacity = 0;
    if (passIndicator) passIndicator.style.opacity = 0;
    
    const cardId = parseInt(currentCard.dataset.id);
    
    // Determine which swipe was performed
    if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical swipe takes priority if both are above threshold
        if (deltaY < 0) {
            // Swiped up - pass
            handleCardAction('pass', cardId);
        }
    } else if (Math.abs(deltaX) > threshold) {
        // Horizontal swipe
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
    // Ensure WORD_PACKS is loaded before initializing
    if (typeof WORD_PACKS === 'undefined') {
        console.error('words.js not loaded properly!');
        // Try to reload after a short delay
        setTimeout(() => {
            if (typeof WORD_PACKS !== 'undefined') {
                initGame();
            } else {
                alert('Error: Word lists not loaded. Please refresh the page.');
            }
        }, 100);
        return;
    }

    cardContainerEl.addEventListener('click', handleCardClick);
    playAgainBtn.addEventListener('click', initGame);

    // Start the game on load
    initGame();
});