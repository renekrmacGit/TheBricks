// Global variables
var canvas, ctx, WIDTH, HEIGHT;
var x, y, dx, dy, r = 8; // Ball properties
var paddlex, paddleh, paddlew; // Paddle properties
var rightDown = false, leftDown = false; // Keyboard state
var bricks, NROWS, NCOLS, BRICKWIDTH, BRICKHEIGHT, PADDING; // Brick grid
var intervalId, intTimer; // Timers
var score = 0; 
var seconds = 0, timerDisplay = "00:00"; 
var start = false; // Game active flag
var currentLevel = 1;
var destroyedBricks = 0;

// Initialize game on document ready
$(document).ready(function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    // Keyboard event listeners
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyDown);

    startLevel(1);
});

// Key down/up handlers
function onKeyDown(evt) {
    if (evt.type === "keydown") {
        if (evt.keyCode == 39) rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    } else if (evt.type === "keyup") {
        if (evt.keyCode == 39) rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
}

// Initialize bricks array
function initbricks() {
    NROWS = 5;
    NCOLS = 5;
    BRICKWIDTH = (WIDTH / NCOLS) - 4; 
    BRICKHEIGHT = 25; 
    PADDING = 4;
    bricks = new Array(NROWS);
    
    for (let i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (let j = 0; j < NCOLS; j++) {
            if (i === 0) bricks[i][j] = 3; // 3 HP
            else if (i <= 2) bricks[i][j] = 2; // 2 HP
            else bricks[i][j] = 1; // 1 HP
        }
    }
    destroyedBricks = 0;
}

// Start specific level
function startLevel(level) {
    clearInterval(intervalId); 
    clearInterval(intTimer);   

    currentLevel = level;
    $("#current-level").text(level);
    score = 0;
    seconds = 0;
    $("#score").html(score);
    $("#time").html("00:00");

    // Level difficulty settings
    if (level === 1) { dx = 2; dy = -3; paddlew = 120; } 
    else if (level === 2) { dx = 3.5; dy = -4.5; paddlew = 90; } 
    else { dx = 5; dy = -6; paddlew = 75; }

    // Ball initial position
    x = WIDTH / 2;
    y = HEIGHT - 30;
    
    // Paddle initial position
    paddleh = 10;
    paddlex = (WIDTH / 2) - (paddlew / 2);
    
    start = true;
    rightDown = false;
    leftDown = false;
    
    initbricks();
    
    // Start loops
    intTimer = setInterval(timer, 1000); 
    intervalId = setInterval(draw, 15);  
}

// Draw a circle with neon glow
function circle(x, y, r) {
    ctx.fillStyle = "#00d4ff"; 
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00d4ff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0; // Reset glow
}

// Draw a rectangle with neon glow
function rect(x, y, w, h, color) {
    ctx.fillStyle = color || "#00d4ff"; 
    ctx.shadowBlur = 15;
    ctx.shadowColor = color || "#00d4ff";
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0; // Reset glow
}

// Clear canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// Timer logic
function timer() {
    if(start) {
        seconds++;
        let displaySeconds = ((seconds % 60) > 9) ? (seconds % 60) : "0" + (seconds % 60);
        let displayMinutes = (Math.floor(seconds / 60) > 9) ? Math.floor(seconds / 60) : "0" + Math.floor(seconds / 60);
        timerDisplay = displayMinutes + ":" + displaySeconds;
        $("#time").html(timerDisplay);
    }
}

// Main game loop
function draw() {
    clear(); 
    
    // Move paddle
    if (rightDown) {
        if (paddlex + paddlew < WIDTH) paddlex += 5;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 5;
        else paddlex = 0;
    }
    
    // Draw paddle
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    // Draw bricks (neon blocks)
    for (let i = 0; i < NROWS; i++) {
        for (let j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                let blockColor;
                
                // Determine block color based on HP
                if (bricks[i][j] === 3) blockColor = "#2ecc71"; // Green (3 HP)
                else if (bricks[i][j] === 2) blockColor = "#3498db"; // Blue (2 HP)
                else blockColor = "#e74c3c"; // Red (1 HP)

                let currentX = (j * (BRICKWIDTH + PADDING)) + PADDING;
                let currentY = (i * (BRICKHEIGHT + PADDING)) + PADDING;
                
                // Draw block
                rect(currentX, currentY, BRICKWIDTH, BRICKHEIGHT, blockColor);
            }
        }
    }
    
    // Collision detection logic
    let rowheight = BRICKHEIGHT + PADDING;
    let colwidth = BRICKWIDTH + PADDING;
    let row = Math.floor(y / rowheight);
    let col = Math.floor(x / colwidth);
    
    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] > 0) {
        dy = -dy; // Bounce vertically
        bricks[row][col] -= 1; // Decrease HP
        
        // If brick is fully destroyed
        if (bricks[row][col] === 0) {
            score += 1;
            destroyedBricks += 1;
            $("#score").html(score);

            // Unlock levels
            if (currentLevel === 1 && score >= 5) {
                $("#btn-lvl2").prop("disabled", false).text("Level 2 (Unlocked!)");
            }
            if (currentLevel === 2 && score >= 10) {
                $("#btn-lvl3").prop("disabled", false).text("Level 3 (Unlocked!)");
            }

            // Check win condition
            if (destroyedBricks === NROWS * NCOLS) {
                start = false;
                clearInterval(intervalId);
                clearInterval(intTimer);
                
                ctx.font = "bold 25px Courier New";
                ctx.fillStyle = "#00d4ff";
                ctx.textAlign = "center";
                
                if (currentLevel === 3) {
                    ctx.fillText("MISSION ACCOMPLISHED!", WIDTH / 2, HEIGHT / 2);
                } else {
                    ctx.fillText("SECTOR CLEARED! NEXT LEVEL!", WIDTH / 2, HEIGHT / 2);
                }
            }
        }
    }
    
    // Wall bounce logic
    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
    
    if (y + dy < r) {
        dy = -dy;
    } else if (y + dy > HEIGHT - r) {
        // Check paddle collision
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
        } else {
            // Game Over
            start = false;
            clearInterval(intervalId);
            clearInterval(intTimer);
            
            ctx.font = "bold 40px Courier New";
            ctx.fillStyle = "#e74c3c";
            ctx.textAlign = "center";
            ctx.fillText("MISSION FAILED", WIDTH / 2, HEIGHT / 2);
        }
    }
    
    // Draw ball
    circle(x, y, r);
    
    // Move ball
    if (start) {
        x += dx;
        y += dy;
    }
}
