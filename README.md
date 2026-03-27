♟️ Chess: Check & Checkmate Edition
A browser-based, two-player chess game built with vanilla HTML, CSS, and JavaScript. Enter player names, play turn by turn, and let the game detect check, checkmate, and illegal moves automatically.

✨ Features

Two-player local gameplay — prompts for both player names on load
Full move validation — enforces legal moves for all 6 piece types (Pawn, Rook, Knight, Bishop, Queen, King)
Check detection — highlights the king's square in red when in check
Checkmate detection — ends the game and announces the winner
Illegal move feedback — shakes the status bar and shows an error message
Selected piece highlight — yellow highlight on the active square
Responsive board — scales down cleanly on mobile screens


🕹️ How to Play

Open the game in your browser
Enter names for Player 1 (White) and Player 2 (Black) in the prompts
Click a piece to select it (highlighted in yellow), then click a destination square to move
The status bar shows whose turn it is at all times
If a move puts your own king in check, it is blocked with a warning
The game ends when Checkmate is reached — the winning player is announced


🏗️ Built With

HTML5 — Page structure and board container
CSS3 — Board layout (CSS Grid), animations, responsive scaling
Vanilla JavaScript — All game logic: move validation, check/checkmate detection, turn management

No libraries. No frameworks. Zero dependencies.

# 2. Navigate into the folder
cd chess-check-checkmate

# 3. Open in your browser
open index.html
Or just drag and drop index.html into any browser.

📁 Project Structure
chess-check-checkmate/
├── index.html      # Game shell and board container
├── style.css       # Board styling, animations, responsive layout
├── script.js       # All chess logic (move rules, check, checkmate)
└── README.md

🧠 Game Logic Overview
FeatureImplementationMove validationPer-piece rules (pawn direction, knight L-shape, path-clear for sliding pieces)Check detectionSimulates opponent attacks on the king's positionSafe move filteringTemporarily applies each move and checks if king remains safeCheckmate detectionChecks if the current player has zero legal moves while in checkTurn managementAlternates between white and black after each valid move

📱 Responsive Design
The board uses a CSS custom property (--size: 70px) for square size, which drops to 11.5vw on screens under 600px wide, keeping the board fully playable on mobile.

🎯 Purpose
This project was built to practice:

DOM manipulation and event handling in vanilla JS
CSS Grid for precise board layout
Implementing rule-based logic and game state management
Responsive UI without any external libraries
