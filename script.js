// =========================================================
// AI MAZE RUNNER - WEB VERSION
// Dynamic Pathfinding using BFS
// =========================================================


// =========================================================
// MAZE
// =========================================================

const maze = [
    "###########################",
    "#P      #       #         #",
    "### ### # ##### # ####### #",
    "#   #   #     # #       # #",
    "# ### ##### # # ####### # #",
    "#     #     # #       # #",
    "##### # ##### ####### # #",
    "#     # #           # # #",
    "# ### # # ######### # # #",
    "# #   # # #       #   # #",
    "# # ### # # ##### ##### #",
    "# #     # #     #       #",
    "# ##### # ##### ####### #",
    "#     # #     #         #",
    "##### # ##### ######### #",
    "#       #             E #",
    "###########################"
];


// =========================================================
// SETTINGS
// =========================================================

const CELL_SIZE = 36;

const ROWS = maze.length;
const COLS = maze[0].length;

const INFO_HEIGHT = 135;

const MAZE_WIDTH = COLS * CELL_SIZE;
const MAZE_HEIGHT = ROWS * CELL_SIZE;

const WIDTH = MAZE_WIDTH;
const HEIGHT = MAZE_HEIGHT + INFO_HEIGHT;


// =========================================================
// CANVAS
// =========================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;


// =========================================================
// POSITIONS
// =========================================================

const playerStart = {
    x: 1,
    y: 1
};

const enemyStart = {
    x: 25,
    y: 1
};

const exitPosition = {
    x: 22,
    y: 15
};

let playerX = playerStart.x;
let playerY = playerStart.y;

let enemyX = enemyStart.x;
let enemyY = enemyStart.y;


// =========================================================
// COLORS
// =========================================================

const COLORS = {
    background: "#070a12",
    wall: "#1e263e",
    wallBorder: "#465573",

    player: "#1e91ff",
    playerGlow: "#5acdff",

    enemy: "#eb2d41",
    enemyGlow: "#ff646e",

    exit: "#23e16e",
    exitDark: "#0f6437",

    yellow: "#ffd737",

    white: "#f5f8ff",
    gray: "#9aa6bd",

    panel: "#0e1320",
    panelBorder: "#414b64",

    green: "#32e678",

    button: "#af2837",
    buttonHover: "#e13746"
};


// =========================================================
// DIFFICULTY
// =========================================================

const difficulties = {
    easy: 700,
    medium: 420,
    hard: 240
};

let difficulty = "medium";


// =========================================================
// GAME VARIABLES
// =========================================================

let gameState = "menu";

let moves = 0;

let startTime = 0;
let finalTime = 0;

let lastEnemyMove = 0;

let enemyPath = [];


// =========================================================
// RESET GAME
// =========================================================

function resetGame() {

    playerX = playerStart.x;
    playerY = playerStart.y;

    enemyX = enemyStart.x;
    enemyY = enemyStart.y;

    moves = 0;

    startTime = performance.now();
    finalTime = 0;

    lastEnemyMove = performance.now();

    enemyPath = findBFSPath(
        enemyX,
        enemyY,
        playerX,
        playerY
    );

    gameState = "playing";
}


// =========================================================
// BFS PATHFINDING
// =========================================================

function findBFSPath(startX, startY, targetX, targetY) {

    const queue = [
        [[startX, startY]]
    ];

    const visited = new Set();

    visited.add(`${startX},${startY}`);

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    while (queue.length > 0) {

        const path = queue.shift();

        const current = path[path.length - 1];

        const currentX = current[0];
        const currentY = current[1];

        if (
            currentX === targetX &&
            currentY === targetY
        ) {
            return path;
        }

        for (const direction of directions) {

            const nextX =
                currentX + direction[0];

            const nextY =
                currentY + direction[1];

            if (
                nextX >= 0 &&
                nextX < COLS &&
                nextY >= 0 &&
                nextY < ROWS
            ) {

                if (
                    maze[nextY][nextX] !== "#" &&
                    !visited.has(`${nextX},${nextY}`)
                ) {

                    visited.add(`${nextX},${nextY}`);

                    queue.push([
                        ...path,
                        [nextX, nextY]
                    ]);
                }
            }
        }
    }

    return [];
}


// =========================================================
// DRAW MAZE
// =========================================================

function drawMaze() {

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            const cell = maze[y][x];

            const px = x * CELL_SIZE;
            const py = y * CELL_SIZE;

            if (cell === "#") {

                ctx.fillStyle = COLORS.wall;

                ctx.fillRect(
                    px,
                    py,
                    CELL_SIZE,
                    CELL_SIZE
                );

                ctx.strokeStyle = COLORS.wallBorder;

                ctx.lineWidth = 1;

                ctx.strokeRect(
                    px,
                    py,
                    CELL_SIZE,
                    CELL_SIZE
                );

            } else {

                ctx.fillStyle = COLORS.background;

                ctx.fillRect(
                    px,
                    py,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }
}


// =========================================================
// DRAW BFS PATH
// =========================================================

function drawBFSPath() {

    if (enemyPath.length < 2) {
        return;
    }

    for (let i = 1; i < enemyPath.length; i++) {

        const position = enemyPath[i];

        const x = position[0];
        const y = position[1];

        const centerX =
            x * CELL_SIZE + CELL_SIZE / 2;

        const centerY =
            y * CELL_SIZE + CELL_SIZE / 2;

        ctx.fillStyle = COLORS.yellow;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// =========================================================
// DRAW EXIT
// =========================================================

function drawExit() {

    const x = exitPosition.x * CELL_SIZE;
    const y = exitPosition.y * CELL_SIZE;

    ctx.fillStyle = COLORS.exitDark;

    ctx.fillRect(
        x + 7,
        y + 5,
        CELL_SIZE - 14,
        CELL_SIZE - 5
    );

    ctx.strokeStyle = COLORS.exit;

    ctx.lineWidth = 3;

    ctx.strokeRect(
        x + 7,
        y + 5,
        CELL_SIZE - 14,
        CELL_SIZE - 5
    );

    ctx.fillStyle = COLORS.exit;

    ctx.fillRect(
        x + 10,
        y + CELL_SIZE - 9,
        CELL_SIZE - 20,
        4
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 10px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "E",
        x + CELL_SIZE / 2,
        y + 21
    );
}


// =========================================================
// DRAW PLAYER
// =========================================================

function drawPlayer() {

    const centerX =
        playerX * CELL_SIZE + CELL_SIZE / 2;

    const centerY =
        playerY * CELL_SIZE + CELL_SIZE / 2;

    // Glow
    ctx.fillStyle = COLORS.playerGlow;

    ctx.globalAlpha = 0.25;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;

    // Player
    ctx.fillStyle = COLORS.player;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE / 2 - 5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // P
    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 16px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "P",
        centerX,
        centerY
    );

    ctx.textBaseline = "alphabetic";
}


// =========================================================
// DRAW ENEMY
// =========================================================

function drawEnemy() {

    const centerX =
        enemyX * CELL_SIZE + CELL_SIZE / 2;

    const centerY =
        enemyY * CELL_SIZE + CELL_SIZE / 2;

    // Radar ring
    ctx.strokeStyle = COLORS.enemyGlow;

    ctx.lineWidth = 2;

    ctx.globalAlpha = 0.35;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE / 2 + 5,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.globalAlpha = 1;

    // Enemy glow
    ctx.fillStyle = COLORS.enemyGlow;

    ctx.globalAlpha = 0.25;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;

    // Enemy body
    ctx.fillStyle = COLORS.enemy;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        CELL_SIZE / 2 - 5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Eyes
    ctx.fillStyle = COLORS.white;

    ctx.beginPath();

    ctx.arc(
        centerX - 6,
        centerY - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        centerX + 6,
        centerY - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// =========================================================
// DRAW INFO PANEL
// =========================================================

function drawInfo() {

    const panelY = MAZE_HEIGHT;

    ctx.fillStyle = COLORS.panel;

    ctx.fillRect(
        0,
        panelY,
        WIDTH,
        INFO_HEIGHT
    );

    ctx.strokeStyle = COLORS.panelBorder;

    ctx.lineWidth = 2;

    ctx.strokeRect(
        0,
        panelY,
        WIDTH,
        INFO_HEIGHT
    );

    let currentTime = finalTime;

    if (gameState === "playing") {

        currentTime =
            (performance.now() - startTime) / 1000;
    }

    const timeText =
        currentTime.toFixed(1);

    ctx.textAlign = "left";

    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 17px Arial";

    ctx.fillText(
        `TIME: ${timeText}s`,
        20,
        panelY + 28
    );

    ctx.fillText(
        `MOVES: ${moves}`,
        180,
        panelY + 28
    );

    ctx.fillText(
        `LEVEL: ${difficulty.toUpperCase()}`,
        330,
        panelY + 28
    );

    ctx.fillStyle = COLORS.green;

    ctx.font = "bold 15px Arial";

    ctx.fillText(
        `AI PATH: ${Math.max(0, enemyPath.length - 1)} steps`,
        20,
        panelY + 58
    );

    ctx.fillStyle = COLORS.yellow;

    ctx.fillText(
        "● BFS ACTIVE",
        220,
        panelY + 58
    );

    // Exit button
    const buttonX = WIDTH - 180;
    const buttonY = panelY + 75;
    const buttonW = 155;
    const buttonH = 42;

    ctx.fillStyle = COLORS.button;

    ctx.fillRect(
        buttonX,
        buttonY,
        buttonW,
        buttonH
    );

    ctx.strokeStyle = COLORS.buttonHover;

    ctx.strokeRect(
        buttonX,
        buttonY,
        buttonW,
        buttonH
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 14px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "EXIT GAME",
        buttonX + buttonW / 2,
        buttonY + 26
    );

    ctx.textAlign = "left";
}


// =========================================================
// DRAW MENU
// =========================================================

function drawMenu() {

    ctx.fillStyle = COLORS.background;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    ctx.textAlign = "center";

    ctx.fillStyle = COLORS.player;

    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "AI MAZE RUNNER",
        WIDTH / 2,
        150
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "20px Arial";

    ctx.fillText(
        "Dynamic Pathfinding using BFS",
        WIDTH / 2,
        195
    );

    ctx.fillStyle = COLORS.gray;

    ctx.font = "16px Arial";

    ctx.fillText(
        "Choose your difficulty",
        WIDTH / 2,
        250
    );

    drawDifficultyButton(
        "EASY",
        "easy",
        WIDTH / 2 - 180,
        300
    );

    drawDifficultyButton(
        "MEDIUM",
        "medium",
        WIDTH / 2 - 60,
        300
    );

    drawDifficultyButton(
        "HARD",
        "hard",
        WIDTH / 2 + 60,
        300
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "17px Arial";

    ctx.fillText(
        "Press 1, 2 or 3 to start",
        WIDTH / 2,
        400
    );

    ctx.fillStyle = COLORS.gray;

    ctx.font = "15px Arial";

    ctx.fillText(
        "Arrow Keys / WASD = Move",
        WIDTH / 2,
        445
    );

    ctx.fillText(
        "The red AI uses BFS to chase you",
        WIDTH / 2,
        475
    );

    ctx.fillText(
        "Reach the green EXIT before the AI catches you!",
        WIDTH / 2,
        505
    );
}


// =========================================================
// DIFFICULTY BUTTON
// =========================================================

function drawDifficultyButton(
    label,
    level,
    x,
    y
) {

    const width = 105;
    const height = 50;

    if (difficulty === level) {

        ctx.fillStyle = COLORS.player;

    } else {

        ctx.fillStyle = COLORS.panel;
    }

    ctx.fillRect(
        x,
        y,
        width,
        height
    );

    ctx.strokeStyle = COLORS.panelBorder;

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        width,
        height
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 15px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        label,
        x + width / 2,
        y + 31
    );
}


// =========================================================
// DRAW END SCREEN
// =========================================================

function drawEndScreen() {

    ctx.fillStyle = "rgba(5, 8, 16, 0.95)";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    ctx.textAlign = "center";

    if (gameState === "won") {

        ctx.fillStyle = COLORS.exit;

        ctx.font = "bold 48px Arial";

        ctx.fillText(
            "YOU WIN!",
            WIDTH / 2,
            190
        );

        ctx.fillStyle = COLORS.white;

        ctx.font = "20px Arial";

        ctx.fillText(
            "You reached the exit!",
            WIDTH / 2,
            240
        );

    } else {

        ctx.fillStyle = COLORS.enemy;

        ctx.font = "bold 48px Arial";

        ctx.fillText(
            "GAME OVER",
            WIDTH / 2,
            190
        );

        ctx.fillStyle = COLORS.white;

        ctx.font = "20px Arial";

        ctx.fillText(
            "The AI caught you!",
            WIDTH / 2,
            240
        );
    }

    ctx.fillStyle = COLORS.gray;

    ctx.font = "18px Arial";

    ctx.fillText(
        `Time: ${finalTime.toFixed(1)} seconds`,
        WIDTH / 2,
        300
    );

    ctx.fillText(
        `Moves: ${moves}`,
        WIDTH / 2,
        335
    );

    ctx.fillStyle = COLORS.white;

    ctx.font = "bold 18px Arial";

    ctx.fillText(
        "Press R to restart",
        WIDTH / 2,
        410
    );

    ctx.fillText(
        "Press ESC for menu",
        WIDTH / 2,
        450
    );
}


// =========================================================
// PLAYER MOVEMENT
// =========================================================

function movePlayer(dx, dy) {

    if (gameState !== "playing") {
        return;
    }

    const newX = playerX + dx;
    const newY = playerY + dy;

    if (
        newX < 0 ||
        newX >= COLS ||
        newY < 0 ||
        newY >= ROWS
    ) {
        return;
    }

    if (maze[newY][newX] === "#") {
        return;
    }

    playerX = newX;
    playerY = newY;

    moves++;

    updateBFS();

    checkGameStatus();
}


// =========================================================
// UPDATE BFS
// =========================================================

function updateBFS() {

    enemyPath = findBFSPath(
        enemyX,
        enemyY,
        playerX,
        playerY
    );
}


// =========================================================
// MOVE ENEMY
// =========================================================

function updateEnemy(currentTime) {

    if (gameState !== "playing") {
        return;
    }

    const moveDelay =
        difficulties[difficulty];

    if (
        currentTime - lastEnemyMove <
        moveDelay
    ) {
        return;
    }

    lastEnemyMove = currentTime;

    updateBFS();

    if (enemyPath.length > 1) {

        const nextPosition =
            enemyPath[1];

        enemyX = nextPosition[0];
        enemyY = nextPosition[1];
    }

    checkGameStatus();
}


// =========================================================
// CHECK WIN / LOSS
// =========================================================

function checkGameStatus() {

    // AI catches player
    if (
        playerX === enemyX &&
        playerY === enemyY
    ) {

        finalTime =
            (performance.now() - startTime) / 1000;

        gameState = "lost";

        return;
    }

    // Player reaches exit
    if (
        playerX === exitPosition.x &&
        playerY === exitPosition.y
    ) {

        finalTime =
            (performance.now() - startTime) / 1000;

        gameState = "won";
    }
}


// =========================================================
// SET DIFFICULTY
// =========================================================

function setDifficulty(level) {

    difficulty = level;

    resetGame();
}


// =========================================================
// KEYBOARD CONTROLS
// =========================================================

window.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        // MENU
        if (gameState === "menu") {

            if (key === "1") {
                setDifficulty("easy");
            }

            if (key === "2") {
                setDifficulty("medium");
            }

            if (key === "3") {
                setDifficulty("hard");
            }

            return;
        }


        // PLAYING
        if (gameState === "playing") {

            if (key === "r") {

                resetGame();

                return;
            }

            let dx = 0;
            let dy = 0;

            if (
                key === "arrowup" ||
                key === "w"
            ) {
                dy = -1;
            }

            if (
                key === "arrowdown" ||
                key === "s"
            ) {
                dy = 1;
            }

            if (
                key === "arrowleft" ||
                key === "a"
            ) {
                dx = -1;
            }

            if (
                key === "arrowright" ||
                key === "d"
            ) {
                dx = 1;
            }

            if (dx !== 0 || dy !== 0) {

                event.preventDefault();

                movePlayer(dx, dy);
            }

            return;
        }


        // WIN / LOSS
        if (
            gameState === "won" ||
            gameState === "lost"
        ) {

            if (key === "r") {

                resetGame();

                return;
            }

            if (key === "escape") {

                gameState = "menu";

                return;
            }
        }
    }
);


// =========================================================
// MOUSE CONTROLS
// =========================================================

canvas.addEventListener(
    "click",
    function(event) {

        const rect =
            canvas.getBoundingClientRect();

        const scaleX =
            canvas.width / rect.width;

        const scaleY =
            canvas.height / rect.height;

        const mouseX =
            (event.clientX - rect.left) * scaleX;

        const mouseY =
            (event.clientY - rect.top) * scaleY;


        // MENU BUTTONS
        if (gameState === "menu") {

            const buttonY = 300;
            const buttonWidth = 105;
            const buttonHeight = 50;

            const buttons = [
                {
                    level: "easy",
                    x: WIDTH / 2 - 180
                },
                {
                    level: "medium",
                    x: WIDTH / 2 - 60
                },
                {
                    level: "hard",
                    x: WIDTH / 2 + 60
                }
            ];

            for (const button of buttons) {

                if (
                    mouseX >= button.x &&
                    mouseX <=
                    button.x + buttonWidth &&
                    mouseY >= buttonY &&
                    mouseY <=
                    buttonY + buttonHeight
                ) {

                    setDifficulty(
                        button.level
                    );

                    return;
                }
            }
        }


        // EXIT GAME BUTTON
        if (gameState === "playing") {

            const buttonX =
                WIDTH - 180;

            const buttonY =
                MAZE_HEIGHT + 75;

            const buttonWidth = 155;
            const buttonHeight = 42;

            if (
                mouseX >= buttonX &&
                mouseX <=
                buttonX + buttonWidth &&
                mouseY >= buttonY &&
                mouseY <=
                buttonY + buttonHeight
            ) {

                gameState = "menu";

                return;
            }
        }


        // END SCREEN
        if (
            gameState === "won" ||
            gameState === "lost"
        ) {

            gameState = "menu";
        }
    }
);


// =========================================================
// DRAW EVERYTHING
// =========================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (gameState === "menu") {

        drawMenu();

        return;
    }

    drawMaze();

    drawBFSPath();

    drawExit();

    drawPlayer();

    drawEnemy();

    drawInfo();

    if (
        gameState === "won" ||
        gameState === "lost"
    ) {

        drawEndScreen();
    }
}


// =========================================================
// MAIN GAME LOOP
// =========================================================

function gameLoop(currentTime) {

    updateEnemy(currentTime);

    draw();

    requestAnimationFrame(gameLoop);
}


// =========================================================
// START GAME
// =========================================================

requestAnimationFrame(gameLoop);