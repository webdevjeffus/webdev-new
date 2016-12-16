console.log("Script loaded");

const GAME_LENGTH = 20,
      BONUS_GOAL = 7,
      BONUS_TIME = 5;

var timer = GAME_LENGTH,
    score = 0,
    bonusCounter = 0,
    lastBonus = 0,
    gameOver = false,
    fading = false;

var scoreDisplay =  document.getElementById("scoreDisplay"),
    timerDisplay =  document.getElementById("timerDisplay"),
    gameOverMsg =   document.getElementById("gameOverMsg"),
    startGameBtn =  document.getElementById("startGameBtn"),
    quitGameBtn =   document.getElementById("quitGameBtn"),
    target =        document.getElementById("target");

var randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - (min-1) )) + min;
}

var displayScore = function() {
  if (score < 10) {
    scoreDisplay.innerHTML = "Score: <span class='hidden-char'>0</span>" + score;
  } else {
    scoreDisplay.innerHTML = "Score: " + score;
  }
  if (timer < 10) {
    timerDisplay.innerHTML = "Time: <span class='hidden-char'>0</span>" + timer;
  } else {
    timerDisplay.innerHTML = "Time: " + timer;
  }
}

var newSecond = function() {
  if ( gameOver == false ) {
    timer--;
    displayScore();
    if (timer > 0) {
      setTimeout(newSecond, 1000);
    } else {
      endGame();
    }
  }
}

var startGame = function() {
  gameOver = false;
  score = 0;
  timer = GAME_LENGTH;

  gameOverMsg.style.display="none";
  startGameBtn.style.display="none";
  quitGameBtn.style.display="block";

  newTarget();
  timer = GAME_LENGTH;
  newSecond();
}

var endGame = function() {
  gameOver = true;
  target.style.display="none";
  gameOverMsg.style.display="block";
  quitGameBtn.style.display="none";
  startGameBtn.style.display="block";
}

var targetColors = function() {
  var bgColors =    [ "#f00", "#0f0", "#00f", "#fd0", "#c0f", "#f60" ];
  var brdrColors =  [ "#800", "#080", "#008", "#c80", "#608", "#b40" ];

  var colorIndex = randomNumber(0,bgColors.length-1);
  return ( [ bgColors[colorIndex], brdrColors[colorIndex] ] );
}


var newTarget = function() {
  var size = randomNumber(75,150),
      colors = targetColors();

  target.style.width=size + "px";
  target.style.height=size + "px";
  target.style.top=randomNumber(10, 390-size) + "px";
  target.style.left=randomNumber(10, 590-size) + "px";
  target.style.backgroundColor = colors[0];
  target.style.borderColor = colors[1];

  if (randomNumber(0,1) == 1) {
    target.style.borderRadius="5px";
  } else {
    target.style.borderRadius="50%";
  }

  target.style.display="block";
  fading = setTimeout(fadeTarget, randomNumber(500,1250));
}

var fadeTarget = function() {
  target.style.display = "none";
  setTimeout(refreshTarget, randomNumber(500, 1000));
}

var refreshTarget = function() {
  if(gameOver == false && target.style.display == "none") {
    newTarget();
  }
}

var newGame = function() {
  timer = GAME_LENGTH,
  score = 0,
  bonusCounter = 0,
  lastBonus = 0,
  gameOver = false,
  fading = false;

  displayScore();
}

// Test Button
// document.getElementById("testBtn").onclick = function() {
//   console.log(randomNumber(10,15));
//   newSecond();
// }

// Start Game
startGameBtn.onclick = function() {
  newGame();
  startGame();
}

// Quit Game
quitGameBtn.onclick = function() {
  endGame();
}

// Click target
target.onclick = function() {
  target.style.display="none";
  clearTimeout(fading);
  score++;
  displayScore();
  if ( score == lastBonus + BONUS_GOAL + bonusCounter ) {
    lastBonus += BONUS_GOAL + bonusCounter;
    bonusCounter++;
    timer += BONUS_TIME;
  }
  setTimeout(refreshTarget, randomNumber(250,1000) );
}

newGame();