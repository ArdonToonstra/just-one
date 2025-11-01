const ENGLISH_WORD_LIST = [
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

const DUTCH_WORD_LIST = [
    "Appel", "Muziek", "Rivier", "Berg", "Oceaan", "Ster", "Zon", "Maan",
    "Boek", "Sleutel", "Boom", "Bloem", "Brug", "Weg", "Auto", "Trein",
    "Boot", "Vliegtuig", "Vogel", "Kat", "Hond", "Vis", "Leeuw", "Tijger",
    "Beer", "Paard", "Koe", "Varken", "Schaap", "Geit", "Eend", "Kikker",
    "Slang", "Spin", "Mier", "Bij", "Vlieg", "Baby", "Kind", "Man",
    "Vrouw", "Dokter", "Politie", "Vuur", "Water", "Aarde", "Lucht",
    "Liefde", "Haat", "Oorlog", "Vrede", "Leven", "Dood", "Tijd", "Ruimte",
    "Kunst", "Kleur", "Rood", "Groen", "Blauw", "Geel", "Zwart", "Wit",
    "Eten", "Brood", "Kaas", "Melk", "Ei", "Vlees", "Fruit", "Pizza",
    "Hart", "Geest", "Ziel", "Lichaam", "Hand", "Voet", "Oog", "Oor",
    "Neus", "Mond", "Tand", "Haar", "Bloed", "Bot", "Huid", "Goud",
    "Zilver", "IJzer", "Staal", "Hout", "Glas", "Papier", "Steen", "Rots",
    "Zand", "Klei", "Doek", "Zijde", "Wol", "Katoen", "Geld", "Munt",
    "Koning", "Koningin", "Prins", "Prinses", "Kasteel", "Zwaard", "Schild", "Oorlog",
    "School", "Leraar", "Student", "Bureau", "Stoel", "Deur", "Raam", "Muur",
    "Vloer", "Dak", "Kamer", "Thuis", "Huis", "Stad", "Dorp", "Gehucht",
    "Boerderij", "Veld", "Bos", "Woestijn", "Eiland", "Strand", "Golf", "Lucht",
    "Wolk", "Regen", "Sneeuw", "Wind", "Storm", "Zon", "Licht", "Donker",
    "Dag", "Nacht", "Ochtend", "Avond", "Week", "Maand", "Jaar", "Datum",
    "Klok", "Horloge", "Telefoon", "Computer", "TV", "Radio", "Foto", "Verf",
    "Lied", "Dans", "Film", "Spel", "Sport", "Bal", "Doel", "Team",
    "Winst", "Verlies", "Spelen", "Werk", "Slapen", "Droom", "Praten", "Zingen",
    "Lezen", "Schrijven", "Tekenen", "Rennen", "Lopen", "Springen", "Zwemmen", "Vliegen",
    "Glimlach", "Lachen", "Huilen", "Verdriet", "Blij", "Boos", "Angst", "Vreugde",
    "Fiets", "Bakker", "Winkel", "Markt", "Haven", "Kerk", "Museum", "Park",
    "Bibliotheek", "Ziekenhuis", "Restaurant", "Café", "Hotel", "Station", "Luchthaven", "Taxi",
    "Bus", "Metro", "Tram", "Snelweg", "Rotonde", "Stoplicht", "Zebrapad", "Parkeerplaats",
    "Benzine", "Garage", "Werkplaats", "Fabriek", "Kantoor", "Vergadering", "Computer", "Printer",
    "Toetsenbord", "Muis", "Monitor", "Laptop", "Tablet", "Smartphone", "Internet", "Website",
    "Email", "Bericht", "Foto", "Video", "Muziek", "Podcast", "Nieuws", "Krant",
    "Tijdschrift", "Boek", "Roman", "Gedicht", "Verhaal", "Brief", "Kaart", "Cadeau",
    "Verjaardag", "Feest", "Bruiloft", "Vakantie", "Weekend", "Uitstapje", "Reis", "Koffer",
    "Paspoort", "Ticket", "Reservering", "Camping", "Tent", "Rugzak", "Wandeling", "Natuur",
    "Dier", "Insect", "Vlinder", "Libel", "Kever", "Wesp", "Hommel", "Rups",
    "Bloem", "Plant", "Struik", "Gras", "Blad", "Tak", "Wortel", "Zaad",
    "Groente", "Wortel", "Ui", "Aardappel", "Tomaat", "Komkommer", "Sla", "Peper",
    "Knoflook", "Peterselie", "Basilicum", "Oregano", "Rozemarijn", "Tijm", "Zout", "Suiker",
    "Meel", "Boter", "Olie", "Azijn", "Mosterd", "Ketchup", "Mayonaise", "Saus",
    "Soep", "Salade", "Sandwich", "Pasta", "Rijst", "Aardappel", "Vlees", "Kip",
    "Rundvlees", "Varkensvlees", "Vis", "Zalm", "Tonijn", "Garnaal", "Mosselen", "Oesters",
    "Ijs", "Chocola", "Koekje", "Taart", "Gebak", "Snoep", "Fruit", "Appel",
    "Banaan", "Sinaasappel", "Citroen", "Aardbei", "Framboos", "Blauwe", "Druif", "Meloen"
];

const ENGLISH_ADVANCED_WORD_LIST = [
    "Algorithm", "Paradigm", "Synergy", "Leverage", "Cryptocurrency", "Blockchain", "Metadata", "Infrastructure",
    "Optimization", "Scalability", "Bandwidth", "Protocol", "Architecture", "Framework", "Middleware", "Interface",
    "Ecosystem", "Analytics", "Stakeholder", "Methodology", "Derivative", "Portfolio", "Volatility", "Equity",
    "Benchmark", "Virtualization", "Encryption", "Authentication", "Authorization", "Firewall", "Malware", "Phishing",
    "Compliance", "Governance", "Arbitration", "Litigation", "Jurisdiction", "Amendment", "Statute", "Precedent",
    "Hypothesis", "Theorem", "Axiom", "Quantum", "Entropy", "Catalyst", "Isotope", "Molecule",
    "Chromosome", "Genome", "Enzyme", "Metabolism", "Mitochondria", "Photosynthesis", "Ecosystem", "Biodiversity",
    "Democracy", "Bureaucracy", "Diplomacy", "Sovereignty", "Ideology", "Propaganda", "Referendum", "Coalition",
    "Renaissance", "Enlightenment", "Revolution", "Imperialism", "Feudalism", "Colonialism", "Capitalism", "Socialism",
    "Philosophy", "Metaphysics", "Epistemology", "Ethics", "Aesthetics", "Logic", "Dialectic", "Empiricism",
    "Psychology", "Cognition", "Perception", "Consciousness", "Motivation", "Intelligence", "Personality", "Behavior",
    "Sociology", "Anthropology", "Ethnography", "Culture", "Institution", "Stratification", "Urbanization", "Globalization",
    "Economy", "Inflation", "Recession", "Deficit", "Monopoly", "Oligopoly", "Supply", "Demand",
    "Marketing", "Branding", "Segmentation", "Demographics", "Consumer", "Revenue", "Profit", "Margin",
    "Entrepreneurship", "Innovation", "Disruption", "Startup", "Venture", "Investment", "Acquisition", "Merger",
    "Engineering", "Thermodynamics", "Mechanics", "Fluid", "Electromagnetic", "Semiconductor", "Circuit", "Resistance",
    "Medicine", "Diagnosis", "Prognosis", "Symptom", "Syndrome", "Pathology", "Anatomy", "Physiology",
    "Pharmacology", "Antibiotic", "Vaccine", "Immunity", "Inflammation", "Chronic", "Acute", "Therapy",
    "Literature", "Narrative", "Protagonist", "Antagonist", "Metaphor", "Symbolism", "Allegory", "Irony",
    "Linguistics", "Phonetics", "Syntax", "Semantics", "Morphology", "Pragmatics", "Discourse", "Dialect",
    "Mathematics", "Calculus", "Algebra", "Geometry", "Trigonometry", "Statistics", "Probability", "Variable",
    "Physics", "Relativity", "Gravity", "Momentum", "Energy", "Matter", "Particle", "Wave"
];

const DUTCH_ADVANCED_WORD_LIST = [
    "Algoritme", "Paradigma", "Synergie", "Hefboom", "Cryptocurrency", "Blockchain", "Metadata", "Infrastructuur",
    "Optimalisatie", "Schaalbaarheid", "Bandbreedte", "Protocol", "Architectuur", "Framework", "Middleware", "Interface",
    "Ecosysteem", "Analytics", "Belanghebbende", "Methodologie", "Derivaat", "Portfolio", "Volatiliteit", "Aandelen",
    "Benchmark", "Virtualisatie", "Encryptie", "Authenticatie", "Autorisatie", "Firewall", "Malware", "Phishing",
    "Naleving", "Governance", "Arbitrage", "Rechtszaak", "Jurisdictie", "Amendement", "Statuut", "Precedent",
    "Hypothese", "Stelling", "Axioma", "Quantum", "Entropie", "Katalysator", "Isotoop", "Molecuul",
    "Chromosoom", "Genoom", "Enzym", "Metabolisme", "Mitochondriën", "Fotosynthese", "Ecosysteem", "Biodiversiteit",
    "Democratie", "Bureaucratie", "Diplomatie", "Soevereiniteit", "Ideologie", "Propaganda", "Referendum", "Coalitie",
    "Renaissance", "Verlichting", "Revolutie", "Imperialisme", "Feodalisme", "Kolonialisme", "Kapitalisme", "Socialisme",
    "Filosofie", "Metafysica", "Epistemologie", "Ethiek", "Esthetica", "Logica", "Dialectiek", "Empirisme",
    "Psychologie", "Cognitie", "Perceptie", "Bewustzijn", "Motivatie", "Intelligentie", "Persoonlijkheid", "Gedrag",
    "Sociologie", "Antropologie", "Etnografie", "Cultuur", "Instituut", "Stratificatie", "Verstedelijking", "Globalisering",
    "Economie", "Inflatie", "Recessie", "Tekort", "Monopolie", "Oligopolie", "Aanbod", "Vraag",
    "Marketing", "Branding", "Segmentatie", "Demografie", "Consument", "Omzet", "Winst", "Marge",
    "Ondernemerschap", "Innovatie", "Disruptie", "Startup", "Onderneming", "Investering", "Overname", "Fusie",
    "Engineering", "Thermodynamica", "Mechanica", "Vloeistof", "Elektromagnetisch", "Halfgeleider", "Circuit", "Weerstand",
    "Geneeskunde", "Diagnose", "Prognose", "Symptoom", "Syndroom", "Pathologie", "Anatomie", "Fysiologie",
    "Farmacologie", "Antibioticum", "Vaccin", "Immuniteit", "Ontsteking", "Chronisch", "Acuut", "Therapie",
    "Literatuur", "Verhaal", "Protagonist", "Antagonist", "Metafoor", "Symboliek", "Allegorie", "Ironie",
    "Taalkunde", "Fonetiek", "Syntaxis", "Semantiek", "Morfologie", "Pragmatiek", "Discours", "Dialect",
    "Wiskunde", "Calculus", "Algebra", "Geometrie", "Goniometrie", "Statistiek", "Waarschijnlijkheid", "Variabele",
    "Fysica", "Relativiteit", "Zwaartekracht", "Momentum", "Energie", "Materie", "Deeltje", "Golf"
];

// Get the current word list based on user preference or game state
function getCurrentWordList() {
    // If we're in a game, use the deck from the game state
    const selectedDeck = state.wordDeck || localStorage.getItem('justOneWordDeck') || 'english';
    
    if (selectedDeck === 'dutch') {
        return DUTCH_WORD_LIST;
    } else if (selectedDeck === 'dutch-advanced') {
        return DUTCH_ADVANCED_WORD_LIST;
    } else if (selectedDeck === 'english-advanced') {
        return ENGLISH_ADVANCED_WORD_LIST;
    } else {
        return ENGLISH_WORD_LIST;
    }
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
    state.wordDeck = localStorage.getItem('justOneWordDeck') || 'english'; // Store which deck is being used
    
    for (let i = 0; i < 13; i++) {
        state.cards.push({
            id: i,
            words: getRandomWords(5),
            status: 'hidden',
        });
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
 * Shows a brief message when game is resumed
 */
function showResumeMessage() {
    const message = document.createElement('div');
    message.className = 'resume-message';
    message.innerHTML = `
        <div class="resume-content">
            <div class="text-2xl mb-2">↩️</div>
            <div class="text-sm font-semibold">Game Resumed</div>
            <div class="text-xs opacity-80">Card ${state.cardIndex + 1} of 13 • Score: ${state.score}</div>
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
    cardContainerEl.addEventListener('click', handleCardClick);
    playAgainBtn.addEventListener('click', initGame);

    // Start the game on load
    initGame();
});