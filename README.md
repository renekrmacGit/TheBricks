# 🧱 The Bricks - Arcade Web Game

Welcome to **The Bricks**! This is a web-based game inspired by classic brick-breaker mechanics, developed for a school project. Control the paddle, bounce the ball, and destroy the bricks across multiple dynamic levels!

## 🚀 Features

* **3 Progressive Levels:** The difficulty scales up! Level 1 features a slow ball and a long paddle. Levels 2 and 3 increase the ball's speed and shrink the paddle.
* **Point-Based Unlock System:** Players must earn points to unlock higher difficulties (5 points for Level 2, 10 points for Level 3).
* **Dynamic Brick Health (HP):** Bricks require different amounts of hits to be destroyed. Black (3 HP), Red (2 HP), and Blue (1 HP). Bricks change color as they take damage!
* **Real-time Stats:** A live dashboard tracks your current score, active level, and features a running timer.
* **Smooth Canvas Rendering:** Uses the HTML5 `<canvas>` API with a high-refresh game loop for fluid movement and accurate collision detection.

## 🛠️ Tech Stack

* **HTML5** (Structure, UI overlay, and Canvas API)
* **CSS3** (Modern dark-theme styling, Flexbox layout)
* **JavaScript & jQuery** (Game loop, physics, collision detection, DOM manipulation)

## 🎮 How to Play

1. Open `index.html` in your web browser.
2. Use the **Left** and **Right Arrow Keys** to move your paddle horizontally.
3. Bounce the ball to hit the bricks. Don't let the ball fall past the bottom edge!
4. Earn enough points to unlock the next stage, and destroy all 25 bricks on Level 3 to win the game.

## 📁 Project Structure

```text
├── index.html   # Main layout, canvas, and UI elements
├── style.css    # Styling, colors, and layout rules
├── script.js    # Canvas rendering, game logic, and physics
└── README.md    # Project documentation
