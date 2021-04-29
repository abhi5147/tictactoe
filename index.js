const cmode1 = document.getElementById('cmode1');
const cmode2 = document.getElementById('cmode2');

cmode1.addEventListener('click',compMode);
cmode2.addEventListener('click',playerMode);


function playerMode(){

document.getElementById('modemain').style.display='none';

document.getElementById('score1').innerText = '-';
document.getElementById('score2').innerText = '-';

const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATION = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const boxElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn ;

let player1=0;
let player2=0;

document.getElementById('restart').addEventListener('click',startGame);
document.getElementById('playAgain').addEventListener('click',startGame);

startGame();

function scoreUpdate(){
    document.getElementById('score1').innerText = player1;
    document.getElementById('score2').innerText = player2;
}

function startGame(){
    circleTurn = false;
    boxElements.forEach(box => {
        box.classList.remove(X_CLASS)
        box.classList.remove(CIRCLE_CLASS)
        box.removeEventListener('click',handleClick)
        box.addEventListener('click', handleClick, {once: true})
    })
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e){
    const box = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMarks(box,currentClass);
    if(checkWin(currentClass)){
        endGame(false)
    }
    else if(isDraw()){
        endGame(true)
    }
    swapTurn();
    setBoardHoverClass();
}
function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = 'Draw!'
    }
    else{
        winningMessageTextElement.innerText = `${circleTurn ? "Player2" : "Player1"} Win!`
        if(circleTurn)
            player2++;
        else
            player1++;
    }
	scoreUpdate();
    winningMessageElement.classList.add('show');
}
function isDraw(){
    return [...boxElements].every(box => {
        return box.classList.contains(X_CLASS)||box.classList.contains(CIRCLE_CLASS)
    })
}

function placeMarks(box,currentClass){
   box.classList.add(currentClass)
}

function swapTurn(){
    circleTurn = !circleTurn;
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if(circleTurn)
        board.classList.add(CIRCLE_CLASS)
    else
        board.classList.add(X_CLASS)
}

function checkWin(currentClass){
    return WINNING_COMBINATION.some(combination => {
        return combination.every(index => {
            return boxElements[index].classList.contains(currentClass)
        })
    })
}
}








function compMode(){

	document.getElementById('modemain').style.display='none';


var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
let you=0;
let comp=0;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.box');
document.getElementById('restart').addEventListener('click',startGame);
document.getElementById('playAgain').addEventListener('click',startGame);
startGame();

function scoreUpdate(){
    document.getElementById('score1').innerText = you;
    document.getElementById('score2').innerText = comp;
}

function startGame() {
	document.querySelector(".winning").classList.remove('show');
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].classList.remove('x');
		cells[i].classList.remove('circle');
		cells[i].addEventListener('click', turnClick, false);
	}
	setBoardHoverClass('X');
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		setBoardHoverClass(huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	if(player=='X')
		document.getElementById(squareId).classList.add('x');
	else
		document.getElementById(squareId).classList.add('circle');
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	if(gameWon.player == huPlayer)
		you++;
	else
		comp++;
	scoreUpdate();
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".winning").classList.add('show');
	document.querySelector(".text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function setBoardHoverClass(player){
	const board = document.getElementById('board');
    board.classList.remove('x')
	board.classList.remove('circle')
	if(player=='X')
    	board.classList.add('x')
}
}
