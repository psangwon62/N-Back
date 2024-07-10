const shapes = ['triangle', 'square', 'circle'];
let shapeHistory = [];
let correctAnswers = 0;
let currentTurn = 0;
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
    shapeContainer.classList.add(shape);
}

function updateShapeHistory(shape) {
    shapeHistory.push(shape);
    if (shapeHistory.length > 4) {
        shapeHistory.shift(); // Keep only the last 4 shapes
    }
}

function updateQuestionNumber() {
    const questionNumber = document.getElementById('question-number');
    questionNumber.textContent = `문제: ${currentTurn + 1} / ${totalTurns}`;
}

function updateRemainingQuestions() {
    const remainingQuestions = document.getElementById('remaining-questions');
    remainingQuestions.textContent = `남은 문항: ${totalTurns - currentTurn - 1}`;
}

function updateTimer(seconds) {
    const timer = document.getElementById('timer');
    timer.textContent = seconds;
}

function handleAnswer(answer) {
    if (currentTurn < totalTurns) {
        const twoBackMatch = shapeHistory[shapeHistory.length - 3] === shapeHistory[shapeHistory.length - 1];
        const threeBackMatch = shapeHistory[shapeHistory.length - 4] === shapeHistory[shapeHistory.length - 1];

        if (answer === '2-back' && twoBackMatch && !threeBackMatch) {
            correctAnswers++;
        } else if (answer === '3-back' && threeBackMatch && !twoBackMatch) {
            correctAnswers++;
        } else if (answer === 'none' && !twoBackMatch && !threeBackMatch) {
            correctAnswers++;
        }

        if (currentTurn < totalTurns - 1) {
            currentTurn++;
            updateQuestionNumber();
            updateRemainingQuestions();
            nextTurn();
        } else {
            endGame();
        }
    }
}

function nextTurn() {
    const newShape = getRandomShape();
    displayShape(newShape);
    updateShapeHistory(newShape);

    if (initialDisplayCount < initialDisplays) {
        initialDisplayCount++;
        document.getElementById('instructions').textContent = '제시되는 도형을 기억해 주세요.';
        setTimeout(nextTurn, shapeDisplayTime * 1000);
    } else {
        document.getElementById('instructions').textContent = '화면에 제시되는 도형이 두 번째 전 혹은 세 번째 전의 도형과 같은지 판단해 주세요.';
        document.getElementById('controls').style.display = 'flex'; // Show controls when initial display is over
        startTimer();
    }
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
            handleAnswer('none'); // Timeout counts as 'none'
        }
    }, 1000);
}

function endGame() {
    document.getElementById('game-container').innerHTML = `<div>게임 종료! 맞춘 갯수: ${correctAnswers} / ${totalTurns}</div><button onclick="restartGame()">돌아가기</button>`;
}

function restartGame() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('settings-container').style.display = 'block';
    shapeHistory = [];
    correctAnswers = 0;
    currentTurn = 0;
    initialDisplayCount = 0;
    document.getElementById('game-container').innerHTML = `
        <div id="header">
            <div id="question-number"></div>
            <div id="remaining-questions"></div>
        </div>
        <div id="instructions"></div>
        <div id="timer">3</div>
        <div id="shape"></div>
        <div id="controls">
            <button class="control-button" id="same-2-back">같음 (2번째 전)<br><span>←</span></button>
            <button class="control-button" id="same-3-back">같음 (3번째 전)<br><span>→</span></button>
            <button class="control-button" id="different">다름 (둘 다 아님)<br><span>SPACE BAR</span></button>
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
    if (event.key === 'ArrowLeft') {
        handleAnswer('2-back');
    } else if (event.key === 'ArrowRight') {
        handleAnswer('3-back');
    } else if (event.key === ' ') {
        handleAnswer('none');
    }
});