const shapes = ['triangle', 'square', 'circle'];
let shapeHistory = [];
let correctAnswers = 0;
let currentTurn = 0;
let gameStarted = false;
let gameEnded = false;
let answerReceived = false; // 새로운 플래그 추가
let totalTurns;
let shapeDisplayTime;
let timerInterval;
let initialDisplayCount = 0;
const initialDisplays = 3;

function getRandomShape() {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function displayShape(shape) {
    const shapeContainer = document.getElementById('shape');
    shapeContainer.className = ''; // Clear previous shape
    shapeContainer.style.backgroundImage = ''; // Clear previous background image
    shapeContainer.style.width = '200px'; // Reset width
    shapeContainer.style.height = '200px'; // Reset height
    shapeContainer.style.backgroundColor = ''; // Clear background color
    shapeContainer.style.borderRadius = ''; // Clear border radius

    if (shape === 'triangle') {
        shapeContainer.style.backgroundImage = 'url("images/triangle.png")';
    } else if (shape === 'square') {
        shapeContainer.style.backgroundImage = 'url("images/square.png")';
    } else if (shape === 'circle') {
        shapeContainer.style.backgroundImage = 'url("images/circle.png")';
    }
}

function updateShapeHistory(shape) {
    shapeHistory.push(shape);
    if (shapeHistory.length > 4) {
        shapeHistory.shift(); // Keep only the last 4 shapes
    }
}

function updateQuestionNumber() {
    const questionNumber = document.getElementById('question-number');
    questionNumber.textContent = `${currentTurn + 1}`;
}

function updateRemainingQuestions() {
    const remainingQuestions = document.getElementById('remaining-questions');
    remainingQuestions.textContent = `남은 문항 ${totalTurns - currentTurn - 1}`;
}

function updateTimer(seconds) {
    const timer = document.getElementById('timer');
    timer.textContent = seconds;
}

function handleAnswer(answer) {
    if (answerReceived) return; // 이미 답변이 처리된 경우 무시
    answerReceived = true; // 플래그 설정

    const twoBackMatch = shapeHistory[shapeHistory.length - 3] === shapeHistory[shapeHistory.length - 1];
    const threeBackMatch = shapeHistory[shapeHistory.length - 4] === shapeHistory[shapeHistory.length - 1];

    let isCorrect = false;
    if (answer === '2-back' && twoBackMatch && !threeBackMatch) {
        isCorrect = true;
    } else if (answer === '3-back' && threeBackMatch && !twoBackMatch) {
        isCorrect = true;
    } else if (answer === 'none' && !twoBackMatch && !threeBackMatch) {
        isCorrect = true;
    }

    if (isCorrect) {
        correctAnswers++;
    }

    highlightAnswer(answer);
}

function removeHighlight() {
    const controls = document.querySelectorAll('.control-button');
    controls.forEach(control => control.classList.remove('highlight'));
}

function highlightAnswer(answer) {
    removeHighlight();
    
    if (answer === '2-back') {
        document.getElementById('same-2-back').classList.add('highlight');
    } else if (answer === '3-back') {
        document.getElementById('same-3-back').classList.add('highlight');
    } else if (answer === 'none') {
        document.getElementById('different').classList.add('highlight');
    }
}

function nextTurn() {
    answerReceived = false; // 새로운 턴에서 다시 입력 받을 수 있게 플래그 초기화
    const newShape = getRandomShape();
    displayShape(newShape);
    updateShapeHistory(newShape);

    if (initialDisplayCount < initialDisplays) {
        initialDisplayCount++;
        document.getElementById('instructions').textContent = '제시되는 도형을 기억해 주세요.';
        startInitialTimer();
        // setTimeout(nextTurn, shapeDisplayTime * 1000);
    } else {
        gameStarted = true;
        document.getElementById('question-number').style.display = 'flex';
        document.getElementById('remaining-questions').style.display = 'flex';
        document.getElementById('instructions').textContent = '화면에 제시되는 도형이 몇 번째 전 도형과 같은지 키보드로 판단해 주세요.';
        document.getElementById('controls').style.display = 'flex'; // Show controls when initial display is over
        startTimer();
    }
}

function startInitialTimer() {
    let timeLeft = shapeDisplayTime;
    updateTimer(timeLeft);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer('timeout'); // Timeout counts as 'none'
            setTimeout(() => {
                clearShapeAndControls();
                setTimeout(nextTurn, 500);
            }, 500);
        }
    }, 1000);
}

function startTimer() {
    let timeLeft = shapeDisplayTime;
    updateTimer(timeLeft);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleAnswer('timeout'); // Timeout counts as 'none'
            setTimeout(() => {
                removeHighlight();
                clearShapeAndControls();
                if (currentTurn < totalTurns - 1) {
                    currentTurn++;
                    updateQuestionNumber();
                    updateRemainingQuestions();
                    setTimeout(nextTurn, 500);
                } else {
                    endGame();
                }
            }, 500);
        }
    }, 1000);
}

function clearShapeAndControls() {
    const shapeContainer = document.getElementById('shape');
    shapeContainer.className = ''; // Clear previous shape
    shapeContainer.style.backgroundImage = ''; // Clear previous background image
    document.getElementById('controls').style.display = 'none'; // Hide controls
}

function endGame() {
    gameEnded = true; // 게임 종료
    document.getElementById('game-container').innerHTML = `<div>게임 종료! 맞춘 갯수: ${correctAnswers} / ${totalTurns}</div><button onclick="restartGame()">돌아가기</button>`;
}

function restartGame() {
    gameStarted = false;
    gameEnded = false;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('settings-container').style.display = 'block';
    shapeHistory = [];
    correctAnswers = 0;
    currentTurn = 0;
    initialDisplayCount = 0;
    document.getElementById('game-container').innerHTML = `
        <div id="header">
            <div id="question-number"></div>
            <div id="header-right">
                <div id="remaining-questions"></div>
                <div id="timer"></div>
            </div>
        </div>
        <hr />
        <div id="instructions"></div>
        <div id="question-container">
            <div id="shape"></div>
            <div id="controls">
                <button class="control-button" id="different">
                    <span class="spacebar" id="keyboard-btn">SPACE BAR</span>
                    <span> 다름 (둘 다 아님)</span>
                </button>
                <button class="control-button" id="same-2-back">
                    <span class="arrow" id="keyboard-btn">⭠</span>
                    <span> 같음 (2번째 전)</span>
                </button>
                <button class="control-button" id="same-3-back">
                    <span class="arrow" id="keyboard-btn">⭢</span>
                    <span> 같음 (3번째 전)</span>
                </button>
            </div>
        </div>
    `;
    updateQuestionNumber();
    updateRemainingQuestions();
}

function startGame() {
    const numQuestionsInput = document.getElementById('num-questions');
    const timerSecondsInput = document.getElementById('timer-seconds');

    totalTurns = parseInt(numQuestionsInput.value, 10);
    shapeDisplayTime = parseInt(timerSecondsInput.value, 10);

    document.getElementById('settings-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    document.getElementById('controls').style.display = 'none'; // Hide controls initially
    updateQuestionNumber();
    updateRemainingQuestions();
    nextTurn();
}

document.addEventListener('keydown', (event) => {
    if (gameStarted && !gameEnded && !answerReceived) {
        if (event.key === 'ArrowLeft') {
            handleAnswer('2-back');
        } else if (event.key === 'ArrowRight') {
            handleAnswer('3-back');
        } else if (event.key === ' ') {
            handleAnswer('none');
        }
    }
});