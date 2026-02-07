// --- NEW PLAYER INPUT SECTION ---
let player1 = prompt("Enter Name for Player 1 (White):") || "Player 1";
let player2 = prompt("Enter Name for Player 2 (Black):") || "Player 2";

console.log("Game Starting...");
console.log("White Pieces: " + player1);
console.log("Black Pieces: " + player2);
// --------------------------------

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

let selectedSq = null;
let turn = 'white';
let gameActive = true;

const board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

// Helper functions (Same as before)
function isWhite(p) { return '♖♘♗♕♔♙'.includes(p); }
function isBlack(p) { return '♜♞♝♛♚♟'.includes(p); }

function isPathClear(sr, sc, er, ec, currentBoard) {
    const rStep = er === sr ? 0 : (er > sr ? 1 : -1);
    const cStep = ec === sc ? 0 : (ec > sc ? 1 : -1);
    let currR = sr + rStep;
    let currC = sc + cStep;
    while (currR !== er || currC !== ec) {
        if (currentBoard[currR][currC] !== '') return false;
        currR += rStep; currC += cStep;
    }
    return true;
}

function isValidMove(piece, startR, startC, endR, endC, currentBoard) {
    const target = currentBoard[endR][endC];
    if (target !== '' && ((isWhite(piece) && isWhite(target)) || (isBlack(piece) && isBlack(target)))) return false;
    const dr = Math.abs(endR - startR), dc = Math.abs(endC - startC);

    switch (piece) {
        case '♙': 
            if (startC === endC && target === '') {
                if (endR - startR === -1) return true;
                if (startR === 6 && endR - startR === -2 && currentBoard[5][startC] === '') return true;
            }
            return (dr === 1 && dc === 1 && target !== '' && isBlack(target));
        case '♟': 
            if (startC === endC && target === '') {
                if (endR - startR === 1) return true;
                if (startR === 1 && endR - startR === 2 && currentBoard[2][startC] === '') return true;
            }
            return (dr === 1 && dc === 1 && target !== '' && isWhite(target));
        case '♖': case '♜': return (startR === endR || startC === endC) && isPathClear(startR, startC, endR, endC, currentBoard);
        case '♘': case '♞': return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
        case '♗': case '♝': return (dr === dc) && isPathClear(startR, startC, endR, endC, currentBoard);
        case '♕': case '♛': return (dr === dc || startR === endR || startC === endC) && isPathClear(startR, startC, endR, endC, currentBoard);
        case '♔': case '♚': return dr <= 1 && dc <= 1;
    }
    return false;
}

function findKing(color, currentBoard) {
    const kingChar = color === 'white' ? '♔' : '♚';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) if (currentBoard[r][c] === kingChar) return { r, c };
    }
}

function isKingInCheck(color, currentBoard) {
    const kingPos = findKing(color, currentBoard);
    if (!kingPos) return false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = currentBoard[r][c];
            if (piece !== '' && (color === 'white' ? isBlack(piece) : isWhite(piece))) {
                if (isValidMove(piece, r, c, kingPos.r, kingPos.c, currentBoard)) return true;
            }
        }
    }
    return false;
}

function wouldMoveResultInCheck(sr, sc, er, ec, color) {
    const tempBoard = board.map(row => [...row]);
    tempBoard[er][ec] = tempBoard[sr][sc];
    tempBoard[sr][sc] = '';
    return isKingInCheck(color, tempBoard);
}

function hasAnyLegalMoves(color) {
    for (let sr = 0; sr < 8; sr++) {
        for (let sc = 0; sc < 8; sc++) {
            const piece = board[sr][sc];
            if (piece !== '' && (color === 'white' ? isWhite(piece) : isBlack(piece))) {
                for (let er = 0; er < 8; er++) {
                    for (let ec = 0; ec < 8; ec++) {
                        if (isValidMove(piece, sr, sc, er, ec, board) && !wouldMoveResultInCheck(sr, sc, er, ec, color)) return true;
                    }
                }
            }
        }
    }
    return false;
}

function updateStatusMessage() {
    const currentPlayerName = turn === 'white' ? player1 : player2;
    statusElement.innerText = `${currentPlayerName.toUpperCase()}'S TURN (${turn.toUpperCase()})`;
}

function showError(msg) {
    statusElement.innerText = `⚠️ ${msg}`;
    statusElement.classList.add('error-active');
    setTimeout(() => {
        if(gameActive) {
            statusElement.classList.remove('error-active');
            updateStatusMessage();
        }
    }, 1500);
}

function render() {
    boardElement.innerHTML = '';
    const whiteInCheck = isKingInCheck('white', board);
    const blackInCheck = isKingInCheck('black', board);
    const whiteKingPos = findKing('white', board);
    const blackKingPos = findKing('black', board);

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = `square ${(r+c)%2===0?'white-sq':'black-sq'}`;
            if (selectedSq && selectedSq.r === r && selectedSq.c === c) sq.classList.add('selected');
            if (whiteInCheck && whiteKingPos.r === r && whiteKingPos.c === c) sq.classList.add('check-warning');
            if (blackInCheck && blackKingPos.r === r && blackKingPos.c === c) sq.classList.add('check-warning');
            sq.innerText = board[r][c];
            sq.onclick = () => handleClick(r, c);
            boardElement.appendChild(sq);
        }
    }
}

function handleClick(r, c) {
    if (!gameActive) return;
    const piece = board[r][c];

    if (selectedSq) {
        const { r: sr, c: sc } = selectedSq;
        if (isValidMove(board[sr][sc], sr, sc, r, c, board)) {
            if (wouldMoveResultInCheck(sr, sc, r, c, turn)) {
                showError("KING IS IN DANGER!");
            } else {
                board[r][c] = board[sr][sc];
                board[sr][sc] = '';
                turn = turn === 'white' ? 'black' : 'white';
                updateStatusMessage();
                
                if (isKingInCheck(turn, board)) {
                    if (!hasAnyLegalMoves(turn)) {
                        gameActive = false;
                        const winner = turn === 'white' ? player2 : player1;
                        statusElement.innerText = `CHECKMATE! ${winner.toUpperCase()} WINS`;
                        statusElement.classList.add('game-over');
                    } else {
                        showError("CHECK!");
                    }
                }
            }
            selectedSq = null;
            render();
        } else {
            showError("INCORRECT MOVE!");
            selectedSq = null;
            render();
        }
    } else {
        if (piece === '' || (turn === 'white' && !isWhite(piece)) || (turn === 'black' && !isBlack(piece))) return;
        selectedSq = { r, c };
        render();
    }
}

// Set initial message and start
updateStatusMessage();
render();