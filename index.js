document.addEventListener('DOMContentLoaded', () => {
    const gameTagInputArea = document.getElementById('gameTagInputArea');
    const gameArea = document.getElementById('gameArea');
    const TagInput = document.getElementById('gameTag');
    const TagDisplay = document.getElementById('gameTagDisplay');
    const proceedButton = document.getElementById('proceedButton');
    const basket = document.getElementById('basket');
    const object = document.getElementById('object');
    const message = document.getElementById('message');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const scoreBoard = document.getElementById('scoreBoard');
\
    
    let score = 0;
    let triesLeft = 15;
    let objectSpeed = 0.8;
    let gameActive = false;
    let isGameOver = false;
    let objectY = 0;
    let basketPosition = 50; // Center position

    function startGame() {
        if (isGameOver) resetGame();
        gameActive = true;
        isGameOver = false;
        score = 0;
        triesLeft = 15;
        objectY = 0;
        basketPosition = 50;
        updateScoreBoard();
        dropObject();
    }

    function dropObject() {
        objectY = 0;
        updateObjectPosition();
    }

    function updateObjectPosition() {
        if (!gameActive || isGameOver) return;

        objectY += objectSpeed;
        object.style.top = objectY + 'vh';

        if (objectY >= 90) {
            objectY = 0;
            object.style.left = Math.random() * 90 + 'vw';

            if (!checkCatch()) {
                triesLeft--;
                displayMessage('Oh no! Missed!', 'miss');
                missSound.play();
            } else {
                score++;
                displayMessage('Nice Catch!', 'catch');
                catchSound.play();
            }

            if (triesLeft <= 0) {
                displayMessage(score >= 10 ? 'You Win!' : 'Game Over!', 'end');
                isGameOver = true;
                gameActive = false;
                updateLeaderboard();
                return;
            }

            updateScoreBoard();
            setTimeout(dropObject, 100); // Drop object again
        } else {
            requestAnimationFrame(updateObjectPosition); // Continue animation
        }
    }

    function updateScoreBoard() {
        scoreBoard.innerHTML = `Score: ${score} | Tries Left: ${triesLeft}`;
    }

    function displayMessage(text, type) {
        message.textContent = text;
        message.style.display = 'block';
        message.style.color = type === 'catch' ? '#32CD32' : (type === 'miss' ? '#FF6347' : 'white');
        setTimeout(() => {
            message.style.display = 'none';
        }, 1500);
    }

    function checkCatch() {
        const objectRect = object.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();
        return !(objectRect.right < basketRect.left ||
            objectRect.left > basketRect.right ||
            objectRect.bottom < basketRect.top ||
            objectRect.top > basketRect.bottom);
    }

    function resetGame() {
        score = 0;
        triesLeft = 15;
        updateScoreBoard();
        isGameOver = false;
        gameActive = false;
    }

    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(score);
        leaderboard.sort((a, b) => b - a);
        leaderboard.splice(10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        leaderboardDisplay.innerHTML = '<h2>Leaderboard</h2>';
        leaderboard.forEach((score, index) => {
            leaderboardDisplay.innerHTML += `<p>${index + 1}. ${score}</p>`;
        });
    }

    // Event Listeners
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', () => gameActive = false);

    document.addEventListener('keydown', (event) => {
        if (!gameActive || isGameOver) return;

        if (event.key === 'ArrowLeft' && basketPosition > 0) {
            basketPosition -= 5;
            basket.style.left = basketPosition + 'vw';
        } else if (event.key === 'ArrowRight' && basketPosition < 90) {
            basketPosition += 5;
            basket.style.left = basketPosition + 'vw';
        }
    });

    difficultySelect.addEventListener('change', () => {
        switch (difficultySelect.value) {
            case 'easy':
                objectSpeed = 0.5;
                break;
            case 'medium':
                objectSpeed = 0.8;
                break;
            case 'hard':
                objectSpeed = 1.2;
                break;
        }
    });
});