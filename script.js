const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_RADIUS = 8;

const FPS = 60;

const actionSpeeds = {
    easy: 4,
    medium: 6,
    hard: 8,
};

let difficulty = new URLSearchParams(window.location.search).get('difficulty');
if (!difficulty || !(difficulty in actionSpeeds)) {
    difficulty = 'easy';
}

const user = {
    x: 20,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    vy: 6,
};

const computer = {
    x: WIDTH - 30,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
};

const ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: Math.random() > 0.5 ? 5 : -5,
    vy: (Math.random() * 4 + 3) * (Math.random() > 0.5 ? 1 : -1),
};

let scoreUser = 0;
let scoreComputer = 0;

let keys = {};

function resetBall(direction) {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = (Math.random() * 2 + 4) * direction;
    ball.vy = (Math.random() * 4 + 3) * (Math.random() > 0.5 ? 1 : -1);
}

function drawPaddle(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.beginPath();
    ctx.arc(x + PADDLE_WIDTH / 2, y - 10, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}

function update() {
    if (keys.ArrowUp) user.y -= user.vy;
    if (keys.ArrowDown) user.y += user.vy;

    if (user.y < 0) user.y = 0;
    if (user.y + PADDLE_HEIGHT > HEIGHT) user.y = HEIGHT - PADDLE_HEIGHT;

    const aiSpeed = actionSpeeds[difficulty];
    if (computer.y + PADDLE_HEIGHT / 2 < ball.y) {
        computer.y += aiSpeed;
    } else if (computer.y + PADDLE_HEIGHT / 2 > ball.y) {
        computer.y -= aiSpeed;
    }
    if (computer.y < 0) computer.y = 0;
    if (computer.y + PADDLE_HEIGHT > HEIGHT) computer.y = HEIGHT - PADDLE_HEIGHT;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - BALL_RADIUS <= 0 || ball.y + BALL_RADIUS >= HEIGHT) {
        ball.vy *= -1;
    }

    if (
        ball.x - BALL_RADIUS <= user.x + PADDLE_WIDTH &&
        ball.y >= user.y &&
        ball.y <= user.y + PADDLE_HEIGHT &&
        ball.vx < 0
    ) {
        ball.vx = -ball.vx;
        ball.x = user.x + PADDLE_WIDTH + BALL_RADIUS;
    }

    if (
        ball.x + BALL_RADIUS >= computer.x &&
        ball.y >= computer.y &&
        ball.y <= computer.y + PADDLE_HEIGHT &&
        ball.vx > 0
    ) {
        ball.vx = -ball.vx;
        ball.x = computer.x - BALL_RADIUS;
    }

    if (ball.x - BALL_RADIUS <= 0) {
        scoreComputer++;
        resetBall(1);
    } else if (ball.x + BALL_RADIUS >= WIDTH) {
        scoreUser++;
        resetBall(-1);
    }

    scoreDiv.textContent = `${scoreUser} : ${scoreComputer}`;
}

function draw() {
    ctx.fillStyle = '#0a0';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = 'white';
    ctx.fillRect(WIDTH / 2 - 1, 0, 2, HEIGHT);

    drawPaddle(user.x, user.y);
    drawPaddle(computer.x, computer.y);
    drawBall();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

gameLoop();
