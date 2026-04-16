// Global Variables
var canvas, ctx, WIDTH, HEIGHT;
var x, y, dx, dy, r = 10; // Ball properties
var paddlex, paddleh, paddlew; // Paddle properties
var rightDown = false, leftDown = false; // Keyboard flags
var bricks, NROWS, NCOLS, BRICKWIDTH, BRICKHEIGHT, PADDING; // Brick properties
var intervalId, intTimer; // Interval IDs
var tocke = 0; // Total Score for the level
var sekunde = 0, izpisTimer = "00:00"; // Timer variables
var start = false; // Game state
var currentLevel = 1;
var destroyedBricks = 0; // Track how many bricks are fully destroyed

$(document).ready(function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

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

// Initialize bricks with different Health Points (1, 2, or 3)
function initbricks() {
    NROWS = 5;
    NCOLS = 5;
    BRICKWIDTH = (WIDTH / NCOLS) - 2; 
    BRICKHEIGHT = 20;
    PADDING = 2;
    bricks = new Array(NROWS);
    
    for (let i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (let j = 0; j < NCOLS; j++) {
            // Top row = 3 HP, Middle 2 rows = 2 HP, Bottom 2 rows = 1 HP
            if (i === 0) bricks[i][j] = 3; 
            else if (i <= 2) bricks[i][j] = 2; 
            else bricks[i][j] = 1; 
        }
    }
    destroyedBricks = 0; // Reset destroyed counter
}

// Function to handle level setups
function startLevel(level) {
    clearInterval(intervalId); 
    clearInterval(intTimer);   

    currentLevel = level;
    $("#current-level").text(level);

    // Reset score and timer for the new level
    tocke = 0;
    sekunde = 0;
    $("#tocke").html(tocke);
    $("#cas").html("00:00");

    // Level-specific configurations
    if (level === 1) {
        dx = 2; dy = -3;     // Slow
        paddlew = 120;       // Long paddle
    } else if (level === 2) {
        dx = 3.5; dy = -4.5; // Faster
        paddlew = 90;        // Medium paddle
    } else if (level === 3) {
        dx = 5; dy = -6;     // Fastest
        paddlew = 75;        // Short paddle
    }

    x = WIDTH / 2;
    y = HEIGHT - 30;
    paddleh = 10;
    paddlex = (WIDTH / 2) - (paddlew / 2);
    
    start = true;
    rightDown = false;
    leftDown = false;
    
    initbricks();
    
    intTimer = setInterval(timer, 1000); 
    intervalId = setInterval(draw, 15);  
}

function circle(x, y, r) {
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h, color) {
    ctx.fillStyle = color || "#000000";
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function timer() {
    if(start) {
        sekunde++;
        let sekundeI = ((sekunde % 60) > 9) ? (sekunde % 60) : "0" + (sekunde % 60);
        let minuteI = (Math.floor(sekunde / 60) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);
        izpisTimer = minuteI + ":" + sekundeI;
        $("#cas").html(izpisTimer);
    }
}

// Main game loop
function draw() {
    clear();
    
    if (rightDown) {
        if (paddlex + paddlew < WIDTH) paddlex += 5;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 5;
        else paddlex = 0;
    }
    
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh, "#2c3e50");

    // Draw bricks dynamically based on their current Health
    for (let i = 0; i < NROWS; i++) {
        for (let j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                let brickColor;
                if (bricks[i][j] === 3) brickColor = "#222222"; // Black (3 HP)
                else if (bricks[i][j] === 2) brickColor = "#FF1C0A"; // Red (2 HP)
                else if (bricks[i][j] === 1) brickColor = "#0000FF"; // Blue (1 HP)

                let currentX = (j * (BRICKWIDTH + PADDING)) + PADDING;
                let currentY = (i * (BRICKHEIGHT + PADDING)) + PADDING;
                rect(currentX, currentY, BRICKWIDTH, BRICKHEIGHT, brickColor);
            }
        }
    }
    
    let rowheight = BRICKHEIGHT + PADDING;
    let colwidth = BRICKWIDTH + PADDING;
    let row = Math.floor(y / rowheight);
    let col = Math.floor(x / colwidth);
    
    // Collision with Brick logic
    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] > 0) {
        dy = -dy; // Bounce
        bricks[row][col] -= 1; // Reduce HP by 1
        
        // If brick HP reaches 0, it's destroyed
        if (bricks[row][col] === 0) {
            tocke += 1;
            destroyedBricks += 1;
            $("#tocke").html(tocke);

            // Level Unlock Logic
            if (currentLevel === 1 && tocke >= 5) {
                $("#btn-lvl2").prop("disabled", false).text("Level 2 (Unlocked!)");
            }
            if (currentLevel === 2 && tocke >= 10) {
                $("#btn-lvl3").prop("disabled", false).text("Level 3 (Unlocked!)");
            }

            // Win Condition Logic (All 25 bricks destroyed)
            if (destroyedBricks === NROWS * NCOLS) {
                start = false;
                clearInterval(intervalId);
                clearInterval(intTimer);
                
                ctx.font = "bold 25px 'Segoe UI'";
                ctx.fillStyle = "#27ae60";
                ctx.textAlign = "center";
                
                if (currentLevel === 3) {
                    ctx.fillText("CONGRATULATIONS! YOU WON!", WIDTH / 2, HEIGHT / 2);
                } else {
                    ctx.fillText("YOU WON! TRY NEXT LEVEL!", WIDTH / 2, HEIGHT / 2);
                }
            }
        }
    }
    
    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;
    if (y + dy < r) dy = -dy;
    else if (y + dy > HEIGHT - r) {
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
        } else {
            // Game Over
            start = false;
            clearInterval(intervalId);
            clearInterval(intTimer);
            
            ctx.font = "bold 40px 'Segoe UI'";
            ctx.fillStyle = "#e74c3c";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);
        }
    }
    
    circle(x, y, r);
    
    if (start) {
        x += dx;
        y += dy;
    }
}