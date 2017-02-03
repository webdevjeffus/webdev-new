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
  result.string = capitalize( result.direction ) + " wind at " + result.speedMPH + "mph";
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

  result.icon = "wi-owm-" + weatherJSON.weather[0].id;
  result.temp = currentTemp(weatherJSON)[tempScale]; // + "\xB0F";

  return result;
}


var userIP,
    userLoc,
    userWeather,
    weatherKey = "d5751e1428d98c3e715937a745922aa3",
    tempScale = "c",
    weatherDataStrings = {};

function updateWeather() {
  $.getJSON("http://jsonip.com/?callback=?").done( function (jsonIP) {
    userIP = jsonIP.ip;

    $("#userIP").text( userIP );

    $.getJSON( "http://freegeoip.net/json/" + userIP ).done( function(jsonLoc) {

      userLoc = jsonLoc;

      $("#userTown").text( userLoc.city );

      var locationStr = "lat=" + userLoc.latitude + "&lon=" + userLoc.longitude;
      var weatherAPICall = "http://api.openweathermap.org/data/2.5/weather?" + locationStr + "&APPID=" + weatherKey;

      $.getJSON( weatherAPICall ).done( function(response) {
        console.log(response);
        var temp = currentTemp(response),
            wind = currentWind(response),
            conditions = currentCond(response),
            icon = response.weather[0].id;
            // isDay = isDaytime(response);   Not currently used

        weatherDataStrings = buildWeatherDataStrings( response );

        // $("#iconSpan").addClass( "wi-owm-" + response.weather[0].id );
        $("#iconSpan").addClass( weatherDataStrings.icon );
        // $("#tempSpan").text( temp.f + "\xB0F" );
        $("#tempSpan").text( weatherDataStrings.temp );
        $("#timeSpan").text( currentTime() );
        $("#condSpan").text( capitalize( conditions ) );
        $("#windSpan").text( wind );
        $("#sunriseSpan").text( " " + getSun(response).rise );
        $("#sunsetSpan").text( " " + getSun(response).set );
        $("#moonPhase").addClass( getMoonIcon() );

      }).fail( function(errors) {
        console.log("OpenWeather Errors:");
        console.log(errors);
      });

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
  updateWeather();
}, 600000 );

updateWeather();
