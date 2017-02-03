function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(time) {
  hours = time.getHours(),
  mins = time.getMinutes(),
  ampm = hours >= 12 ? 'pm' : 'am'
  timeStr = "";

  hours = hours % 12;
  hours = hours ? hours : 12;
  mins = mins < 10 ? "0"+mins : mins;

  return hours + ":" + mins + " " + ampm;
}

function currentTime() {
  return formatTime( new Date() );
}

function currentTemp(weatherJSON) {
  return {
    "f": Math.round( 1.8 * (weatherJSON.main.temp - 273.15 ) + 32 ) + "\xB0F",
    "c": Math.round( weatherJSON.main.temp - 273.15 ) + "\xB0C",
  };
}


// Not currently in use; consider deleting
// function currentClouds(weatherJSON) {
//   var clouds = weatherJSON.clouds.all;
//   if      ( clouds <= 10 ) { return "clear"; }
//   else if ( clouds <= 30 ) { return "mostly clear"; }
//   else if ( clouds <= 70 ) { return "partly cloudy"; }
//   else if ( clouds <= 90 ) { return "mostly cloudy"; }
//   else                     { return "overcast"; }
// }

function currentWind(weatherJSON) {
  var wind = weatherJSON.wind,
      result = {};

  if      ( wind.deg >  335 ||
            wind.deg <=  25 ) { result.direction = "north"}
  else if ( wind.deg <=  65 ) { result.direction = "northeast" }
  else if ( wind.deg <= 115 ) { result.direction = "east" }
  else if ( wind.deg <= 155 ) { result.direction = "southeast" }
  else if ( wind.deg <= 205 ) { result.direction = "south"}
  else if ( wind.deg <= 245 ) { result.direction = "southwest" }
  else if ( wind.deg <= 295 ) { result.direction = "west" }
  else                        { result.direction = "northwest "}

  result.speedMPH = Math.round( wind.speed * 2.25 );
  result.speedMPS = Math.round( wind.speed );
  if( wind.gust ) {
    result.gustMPH  = Math.round( wind.gust * 2.25 );
    result.gustMPS  = Math.round( wind.gust );
  }
  result.string = result.direction + " wind at " + result.speedMPH + "mph";
  if ( wind.gust && wind.gust >= (wind.speed * 1.25) ) {
    result.string += ( ",<br>gusting to " + result.gustMPH + "mph" );
  }

  return result.string;
}

function currentCond(weatherJSON) {
  var result = weatherJSON.weather[0].description;
  if ( weatherJSON.weather.length > 1 ) {
    result += ( " and " + weatherJSON.weather[1].description );
  }
  return result;
}

function getSun(weatherJSON) {
  return {
    rise: formatTime( new Date(weatherJSON.sys.sunrise * 1000) ),
    set: formatTime( new Date(weatherJSON.sys.sunset * 1000) ),
  }
}

// Not currently in use
// function isDaytime(weatherJSON) {
//   if ( weatherJSON.dt >= weatherJSON.sys.sunrise && weatherJSON.dt < weatherJSON.sys.sunset) {
//     return true;
//   }
//   else { return false; }
// }

function getMoonPhase() {
  var lunarCycle = 2551443;
  var now = new Date();
  var new_moon = new Date(1970, 0, 7, 20, 35, 0);
  var phase = ((now.getTime() - new_moon.getTime())/1000) % lunarCycle;
  return Math.floor(phase /(24*3600)) + 1;
}

function getMoonIcon() {
  var phase = getMoonPhase();

  if      ( phase <= 1 ) { return "wi-moon-new"; }
  else if ( phase <= 2 ) { return "wi-moon-waxing-crescent-1"; }
  else if ( phase <= 3 ) { return "wi-moon-waxing-crescent-2"; }
  else if ( phase <= 4 ) { return "wi-moon-waxing-crescent-3"; }
  else if ( phase <= 5 ) { return "wi-moon-waxing-crescent-4"; }
  else if ( phase <= 6 ) { return "wi-moon-waxing-crescent-5"; }
  else if ( phase <= 8 ) { return "wi-moon-first-quarter"; }
  else if ( phase <= 9 ) { return "wi-moon-waxing-gibbous-1"; }
  else if ( phase <=10 ) { return "wi-moon-waxing-gibbous-2"; }
  else if ( phase <=11 ) { return "wi-moon-waxing-gibbous-3"; }
  else if ( phase <=12 ) { return "wi-moon-waxing-gibbous-4"; }
  else if ( phase <=13 ) { return "wi-moon-waxing-gibbous-5"; }
  else if ( phase <=16 ) { return "wi-moon-full"; }
  else if ( phase <=17 ) { return "wi-moon-waning-crescent-1"; }
  else if ( phase <=18 ) { return "wi-moon-waning-crescent-2"; }
  else if ( phase <=19 ) { return "wi-moon-waning-crescent-3"; }
  else if ( phase <=20 ) { return "wi-moon-waning-crescent-4"; }
  else if ( phase <=21 ) { return "wi-moon-waning-crescent-5"; }
  else if ( phase <=23 ) { return "wi-moon-first-quarter"; }
  else if ( phase <=24 ) { return "wi-moon-waning-gibbous-1"; }
  else if ( phase <=25 ) { return "wi-moon-waning-gibbous-2"; }
  else if ( phase <=26 ) { return "wi-moon-waning-gibbous-3"; }
  else if ( phase <=27 ) { return "wi-moon-waning-gibbous-4"; }
  else if ( phase <=28 ) { return "wi-moon-waning-gibbous-5"; }
  else                   { return "wi-moon"; }
}

function buildWeatherDataStrings(weatherJSON) {
  var result = {};

  result.icon =       "wi-owm-" + weatherJSON.weather[0].id;
  result.temp =       currentTemp(weatherJSON)[tempScale];
  result.time =       formatTime( new Date() );
  result.conditions = capitalize( currentCond(weatherJSON) );
  result.wind =       capitalize( currentWind( weatherJSON ) );
  result.sunrise =    " " + getSun( weatherJSON ).rise;
  result.sunset =     " " + getSun( weatherJSON ).set;
  result.phase =      getMoonIcon();

  return result;
}

function displayWeatherData( weatherJSON ) {
  var weatherDataStrings = buildWeatherDataStrings( weatherJSON );

  $("#iconSpan").addClass ( weatherDataStrings.icon );
  $("#tempSpan").text     ( weatherDataStrings.temp );
  $("#timeSpan").text     ( weatherDataStrings.time );
  $("#condSpan").text     ( weatherDataStrings.conditions );
  $("#windSpan").text     ( weatherDataStrings.wind );
  $("#sunriseSpan").text  ( weatherDataStrings.sunrise );
  $("#sunsetSpan").text   ( weatherDataStrings.sunset );
  $("#moonPhase").addClass( weatherDataStrings.phase );
}

function updateWeatherData() {
  var locationStr = "lat=" + userLoc.latitude + "&lon=" + userLoc.longitude;
  var weatherAPICall = "http://api.openweathermap.org/data/2.5/weather?" + locationStr + "&APPID=" + weatherKey;

  $.getJSON( weatherAPICall ).done( function(response) {
    console.log(response); // remove for production
    displayWeatherData( response );
  }).fail( function(errors) {
    console.log("OpenWeather Errors:");
    console.log(errors);
  });
}


var userIP,
    userLoc,
    userWeather,
    weatherKey = "d5751e1428d98c3e715937a745922aa3",
    tempScale = "f",
    weatherDataStrings = {};

function displayStartingWeatherData() {
  $.getJSON("http://jsonip.com/?callback=?").done( function (jsonIP) {
    userIP = jsonIP.ip;

    $("#userIP").text( userIP );

    $.getJSON( "http://freegeoip.net/json/" + userIP ).done( function(jsonLoc) {

      userLoc = jsonLoc;

      $("#userTown").text( userLoc.city );

      updateWeatherData();

    }).fail( function( errors ) {
      console.log("FreeGeoIP Errors:");
      console.log(errors);
    });

  }).fail( function( errors ) {
    console.log("jsonip.com API Errors:")
    cosole.log(errors);
  });
}



window.setInterval( function() {
  $("#timeSpan").text( currentTime() );
}, 60000);

window.setInterval( function() {
  updateWeatherData();
}, 600000 );

displayStartingWeatherData();
