const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let speed = 100;

function generateFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    clearCanvas();
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    checkFoodCollision();
    drawFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        if (index === 0) {
            // Draw eyes
            ctx.fillStyle = 'black';
            if (dx === 1) {
                ctx.fillRect((segment.x * gridSize) + 12, (segment.y * gridSize) + 4, 4, 4);
                ctx.fillRect((segment.x * gridSize) + 12, (segment.y * gridSize) + 12, 4, 4);
            } else if (dx === -1) {
                ctx.fillRect((segment.x * gridSize) + 4, (segment.y * gridSize) + 4, 4, 4);
                ctx.fillRect((segment.x * gridSize) + 4, (segment.y * gridSize) + 12, 4, 4);
            } else if (dy === 1) {
                ctx.fillRect((segment.x * gridSize) + 4, (segment.y * gridSize) + 12, 4, 4);
                ctx.fillRect((segment.x * gridSize) + 12, (segment.y * gridSize) + 12, 4, 4);
            } else if (dy === -1) {
                ctx.fillRect((segment.x * gridSize) + 4, (segment.y * gridSize) + 4, 4, 4);
                ctx.fillRect((segment.x * gridSize) + 12, (segment.y * gridSize) + 4, 4, 4);
            }
            ctx.fillStyle = '#4CAF50';
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score += 10;
        scoreElement.textContent = score;
        speed = Math.max(50, speed - 2);
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, speed);
        return true;
    }
    return false;
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 0;
    dy = 0;
    score = 0;
    speed = 100;
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    gameLoop = setInterval(drawGame, speed);
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

resetGame();