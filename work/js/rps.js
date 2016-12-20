"use strict";

// GAME OBJECTS
var game = {
  tieRound: " This round is a draw.",
  winRound: " You win this round.",
  loseRound: " You lose this round.",
  winGameHead: "Congratulations!",
  loseGameHead: "You lost this game.",
  winGameMsg: "You&rsquo;ve won the game!",
  loseGameMsg: "Better luck next time!",
  rockScissors: "Rock breaks scissors.",
  scissorsPaper: "Scissors cut paper.",
  paperRock: "Paper covers rock."
};

var player = {
  move: "?",
  score: 0
};

var oppo = {
  moves: ["rock", "paper", "scissors"],
  move: "?",
  score: 0
};

// DOM HANDLES
var playerMove = document.getElementById("playerMove");
var oppoMove = document.getElementById("oppoMove");
var playByPlay = document.getElementById("playByPlay");
var turnScore = document.getElementById("turnScore");
var playerPt = document.getElementsByClassName("playerPt");
var oppoPt = document.getElementsByClassName("oppoPt");
var gameOverBox = document.getElementById("gameOverBox");
var gameOverHead = document.getElementById("gameOverHead");
var gameOverMsg = document.getElementById("gameOverMsg");

// GAME FUNCTIONS
function getPlayerMove(move) {
  player.move = move;
  getOppoMove();
  displayMoves();
  resolveTurn();
  checkForWin();
}

function getOppoMove() {
  oppo.move = oppo.moves[ Math.floor(Math.random() * 3) ];
}

function displayMoves() {
  switch (player.move) {
    case "rock":
      playerMove.innerHTML = "<i class='fa fa-hand-rock-o'></i>";
      break;
    case "paper":
      playerMove.innerHTML = "<i class='fa fa-hand-paper-o'></i>";
      break;
    default: // "scissors"
      playerMove.innerHTML = "<i class='fa fa-hand-scissors-o'></i>";
      break;
    }

  switch (oppo.move) {
    case "rock":
      oppoMove.innerHTML = "<i class='fa fa-hand-rock-o fa-flip-horizontal'></i>";
      break;
    case "paper":
      oppoMove.innerHTML = "<i class='fa fa-hand-paper-o fa-flip-horizontal fa-flip-horizontal'></i>";
      break;
    default: // "scissors"
      oppoMove.innerHTML = "<i class='fa fa-hand-scissors-o fa-flip-horizontal'></i>";
      break;
    }
}

function resolveTurn() {
  if ( player.move === oppo.move ) {
    playByPlay.innerHTML = ( "Both players chose " + player.move + ".");
    turnScore.innerHTML = ( game.tieRound );
  }

  else {
    switch (player.move) {
      case "rock":
        if ( oppo.move === "paper" ) {
          playByPlay.innerHTML = ( game.paperRock );
          incOppoScore();
        }
        else {
          playByPlay.innerHTML = ( game.rockScissors );
          incPlayerScore();
        }
        break;

      case "paper":
        if ( oppo.move === "scissors" ) {
          playByPlay.innerHTML = ( game.scissorsPaper );
          incOppoScore();
        }
        else {
          playByPlay.innerHTML = ( game.paperRock);
          incPlayerScore();
        }
        break;

      default: // "scissors"
        if ( oppo.move === "rock" ) {
          playByPlay.innerHTML = ( game.rockScissors );
          incOppoScore();
        }
        else {
          playByPlay.innerHTML = ( game.scissorsPaper );
          incPlayerScore();
        }
    }
  }
}

function incPlayerScore() {
  turnScore.innerHTML = ( game.winRound );
  playerPt[player.score].setAttribute( "style", "background-color: royalblue;" );
  player.score++;
}

function incOppoScore() {
  turnScore.innerHTML = ( game.loseRound );
  oppoPt[oppo.score].setAttribute( "style", "background-color: orange;" );
  oppo.score++;
}

function checkForWin() {
  if (player.score === 3) {
    gameOverBox.setAttribute(
      "style",
      "display: block; background-color: lightgreen; border-color: darkgreen;"
    );
    gameOverHead.innerHTML = game.winGameHead;
    gameOverMsg.innerHTML = game.winGameMsg;
  }
  else if (oppo.score === 3) {
    gameOverBox.setAttribute(
      "style",
      "display: block; background-color: rgb(256,164,164); border-color: rgb(128,0,0);"
    );
    gameOverHead.innerHTML = game.loseGameHead;
    gameOverMsg.innerHTML = game.loseGameMsg;
  }
}

function playAgain() {
  gameOverBox.setAttribute("style", "display: none;");
  playByPlay.innerHTML = "Playing again?";
  turnScore.innerHTML = "Choose your first move.";
  for (var i = 0; i < 3; i++) {
    playerPt[i].setAttribute("style", "background-color: #ccc;");
    oppoPt[i].setAttribute("style", "background-color: #ccc;");
  }
  playerMove.innerHTML = ("<i class='fa fa-question'></i>");
  oppoMove.innerHTML = ("<i class='fa fa-question'></i>");
  player.score = 0;
  oppo.score = 0;
}
