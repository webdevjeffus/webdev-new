var calculateRolls = function(dice, sides) {
  var rolls = [];

  for (var n = dice; n <= dice * sides; n++ ) {
    rolls[n] = 0;
  }

  if ( dice == 1 ) {
    for (var i = 1; i <= sides; i++) {
      rolls[i]++;
    }
  }

  else if ( dice == 2) {
    for (var i = 1; i <= sides; i++) {
      for (var j = 1; j <= sides; j++) {
        rolls[i+j]++;
      }
    }
  }

  else if ( dice == 3 ) {
    for (var i = 1; i <= sides; i++) {
      for (var j = 1; j <= sides; j++) {
        for (var k = 1; k <= sides; k++) {
          rolls[i+j+k]++;
        }
      }
    }
  }

  else if ( dice == 4 ) {
    for (var i = 1; i <= sides; i++) {
      for (var j = 1; j <= sides; j++) {
        for (var k = 1; k <= sides; k++) {
          for (var g = 1; g <= sides; g++) {
            rolls[i+j+k+g]++;
          }
        }
      }
    }
  }

  else if ( dice == 5 ) {
    for (var i = 1; i <= sides; i++) {
      for (var j = 1; j <= sides; j++) {
        for (var k = 1; k <= sides; k++) {
          for (var g = 1; g <= sides; g++) {
            for (var h = 1; h <= sides; h++) {
              rolls[i+j+k+g+h]++;
            }
          }
        }
      }
    }
  }

  else {
    rolls = "This calculator only handles 1 to 5 dice."
  }

  return ( rolls );
}

var rollPercents = function (dice, sides) {
  var rolls = calculateRolls(dice, sides);

  if ( typeof(rolls) !== "string" ) {

    var totalRolls = 0,
      percentsToRoll = [];

    for (var n = dice; n <= dice * sides; n++ ) {
      percentsToRoll[n] = (100 - ( totalRolls / Math.pow(sides, dice) ) * 100).toFixed(2);
      totalRolls += rolls[n];
    }

    return percentsToRoll;
  }

  else {
    return rolls;
  }
}


var showPercentRolls = function(dice, sides) {
  var results = rollPercents(dice, sides);

  if ( typeof(results) !== "string") {

    console.log("On " + dice + "d" + sides + ", your chance to roll...");

    for ( var n = dice; n <= dice * sides; n++) {
      console.log( n + " or better: " + results[n] + "%");
    }
  }

  else {
    console.log( results );
  }
}


document.getElementById("calcBtn").onclick = function() {
  event.preventDefault();
  var dice = document.getElementById("dice").value;
  var sides = document.getElementById("sides").value;

  var percentages = rollPercents(dice, sides);

  document.getElementById("textDisplay").innerText="On " + dice + "d" + sides + ", your chance to roll...";

  document.getElementById("resultsTableBody").innerHTML="";

  for ( var n = dice; n <= dice * sides; n++) {
    document.getElementById("resultsTableBody").innerHTML+=
      "<tr><td>" + n + " or better</td><td>" + percentages[n] + "%</td></tr>";
  }

  document.getElementById("textDisplay").style.display = "block";
  document.getElementById("resultsTable").style.display = "table";

}