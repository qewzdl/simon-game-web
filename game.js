const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

var isGameStarted = false;

var levelTimeInterval = 1;
var animationTimeInterval = 0.5;
var animationDuration = animationTimeInterval / 2;
var currentLevel = 1;

var currentHistory = [];
var gameHistory = [];

var bestScore = 0;

const gameModes = ['classic', 'hard'];
var currentGameMode = gameModes[0];

const body = document.body;
const textToStartLabel = document.getElementById('text-to-start');
const levelLabel = document.getElementById('level-label');
const bestScoreLabel = document.getElementById('best-score-label');

updateStartGameTextLabel();

setChangeGameModeEvent();
changeGameMode(currentGameMode);

setStartGameEvent();

function startGame() {
    isGameStarted = true;

    resetLevel();
    updateBestScoreLabel();

    clearHistories();
    body.classList.add('active-game');

    handleLevel();
}

function gameOver() {
    clearHistories();

    body.classList.remove('active-game');

    setStartGameEvent();
    
    isGameStarted = false;
}

function handleLevel() {
    currentHistory = [];

    let randomBoxNum = Math.floor(Math.random() * 4 + 1);

    gameHistory.push(randomBoxNum);

    switch (currentGameMode) {
        case gameModes[0]:
            for (let i = 0; i < gameHistory.length; i++) {
                setTimeout(
                    animateActiveBox, 
                    animationTimeInterval * 1000 * (i + 1),
                    getBoxById(gameHistory[i])
                );
            }
            
            setTimeout(handleChoice, animationTimeInterval * 1000 * (gameHistory.length + 1));
            break;

        case gameModes[1]:
            setTimeout(
                animateActiveBox, 
                animationTimeInterval * 1000,
                getBoxById(gameHistory[gameHistory.length - 1])
            );
            
            handleChoice();
            break;
        
        default:
            console.log('Unknown game mode.');
    }
}

function handleChoice() {
    let isChosen = false;

    for (let i = 1; i < 5; i++) {
        getBoxById(i).classList.add('clickable');
        getBoxById(i).addEventListener('click', function eventHandler() {
            if (!isChosen) {
                isChosen = true;

                animateActiveBox(this);

                currentHistory.push(i);

                for(let j = 1; j < 5; j++) {
                    getBoxById(j).classList.remove('clickable');
                    getBoxById(j).removeEventListener('click', eventHandler);
                }
                
                matchHistories();
            }
        });
    }
}

function matchHistories() {
    for (let i = 0; i < currentHistory.length; i++) {
        if (currentHistory[i] !== gameHistory[i]) {
            animateActiveBox(getBoxById(currentHistory[i]));

            setTimeout(gameOver, levelTimeInterval * 1000);

            return;
        }
    }
    
    if (currentHistory.length < gameHistory.length) {
        handleChoice();
        return;
    }
    
    currentLevel++;
    updateLevelLabel();
    updateBestScoreLabel();

    setTimeout(handleLevel, levelTimeInterval * 1000);
}

function setStartGameEvent() {
    const eventType = (isMobile) ? 'touchstart' : 'keydown';

    document.addEventListener(eventType, function eventHandler() {
        if (!isGameStarted) {
            startGame();
    
            this.removeEventListener(eventType, eventHandler);
        }
    });
}

function clearHistories() {
    currentHistory = [];
    gameHistory = [];
}

function updateLevelLabel() {
    levelLabel.innerText = `Level ${currentLevel}`;
}

function updateBestScoreLabel() {
    if (currentLevel <= bestScore) return; 

    bestScore = currentLevel;
    bestScoreLabel.innerText = `Best Score: ${bestScore}`;
}

function updateStartGameTextLabel() {
    textToStartLabel.innerText = (isMobile) ? 'Tap the screen to start' : 'Press any button to start';
}

function resetLevel() {
    currentLevel = 1;
    updateLevelLabel();
}

function getBoxById(id) {
    return document.getElementById('box' + id);
}

function animateActiveBox(box) {
    box.classList.add('active');
    setTimeout(() => {
        box.classList.remove('active');
    }, animationDuration * 1000);
}

function setChangeGameModeEvent() {
    for (let i = 0; i < gameModes.length; i++) {
        let gameModeButton = document.getElementById(`game-mode-` + gameModes[i]);

        gameModeButton.addEventListener('click', () => changeGameMode(gameModes[i]));
    }
}

function changeGameMode(newMode) {
    document.getElementById(`game-mode-${currentGameMode}`).classList.remove('active');

    currentGameMode = newMode;
    document.getElementById(`game-mode-${currentGameMode}`).classList.add('active');
}