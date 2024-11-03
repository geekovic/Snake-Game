// Initialize canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 600;
canvas.height = 600;

const boxSize = 20; // Size of each grid box
let snake = [{ x: boxSize * 5, y: boxSize * 5 }]; // Initial position of the snake
let direction = "RIGHT"; // Initial direction
let food = { x: randomCoordinate(), y: randomCoordinate() }; // Initial food position
let score = 0; // Initial score
let leaderboard = []; // Leaderboard array to store player scores

// Function to generate random coordinates for food
function randomCoordinate() {
    return Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
}

// Function to draw the game board
function drawBoard() {
    ctx.fillStyle = "#111"; // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Draw the board
}

// Function to draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#4CAF50" : "#8BC34A"; // Different color for the head and body

        ctx.save(); // Save current context state
        ctx.translate(snake[i].x + boxSize / 2, snake[i].y + boxSize / 2); // Move to snake segment position
        ctx.rotate(Math.PI / 4); // Rotate the snake segment
        ctx.fillRect(-8, -8, 16, 16); // Draw the snake segment
        ctx.restore(); // Restore previous context state
    }
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = "red"; // Set food color
    ctx.beginPath(); // Begin new path for food
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, 12, 0, Math.PI * 2); // Draw circular food
    ctx.fill(); // Fill the food
}

// Function to move the snake
function moveSnake() {
    let head = { ...snake[0] }; // Create a copy of the snake's head

    // Move the head based on the current direction
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;
    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;

    // Check if snake has eaten food
    if (head.x === food.x && head.y === food.y) {
        food = { x: randomCoordinate(), y: randomCoordinate() }; // Generate new food position
        score++; // Increment score
        document.getElementById("score").innerText = `Score: ${score}`; // Update score display
    } else {
        snake.pop(); // Remove the last segment of the snake
    }

    snake.unshift(head); // Add the new head to the front of the snake
}

// Function to check for collisions
function checkCollision() {
    const head = snake[0]; // Get the head of the snake

    // Check if the snake hits the walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Check if the snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false; // No collision
}

// Main game loop function
function gameLoop() {
    if (checkCollision()) { // Check for collisions
        alert("Game Over!"); // Alert player
        const playerName = prompt("Enter your name:"); // Prompt for player name
        if (playerName) {
            leaderboard.push({ name: playerName, score: score }); // Add score to leaderboard
            updateLeaderboard(); // Update leaderboard display
        }
        // Reset game state
        snake = [{ x: boxSize * 5, y: boxSize * 5 }];
        direction = "RIGHT";
        food = { x: randomCoordinate(), y: randomCoordinate() };
        score = 0;
        document.getElementById("score").innerText = `Score: ${score}`;
        return;
    }

    // Draw everything
    drawBoard();
    drawFood();
    drawSnake();
    moveSnake();
}

// Function to update the leaderboard display
function updateLeaderboard() {
    leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = ""; // Clear current leaderboard

    // Populate the leaderboard display
    leaderboard.forEach(item => {
        const entry = document.createElement("div");
        entry.classList.add("leaderboard-item");
        entry.innerText = `${item.name}: ${item.score}`; // Display name and score
        leaderboardList.appendChild(entry); // Add entry to leaderboard
    });
}

// Function to change snake direction based on keyboard input
function changeDirection(event) {
    const key = event.key;

    // Prevent the snake from reversing
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Event listener for keydown events to change direction
document.addEventListener("keydown", changeDirection);
// Start the game loop at an interval
setInterval(gameLoop, 230);