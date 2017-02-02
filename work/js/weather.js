function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function currentTime() {
  var time = new Date(),
      hours = time.getHours(),
      mins = time.getMinutes(),
      ampm = hours >= 12 ? 'pm' : 'am'
      timeStr = "";

    hours = hours % 12;
    hours = hours ? hours : 12;
    mins = mins < 10 ? "0"+mins : mins;

    return hours + ":" + mins + " " + ampm;
}

function currentTemp(weatherJSON) {
  return {
    "f": Math.round( 1.8 * (weatherJSON.main.temp - 273.15 ) + 32 ),
    "c": Math.round( weatherJSON.main.temp - 273.15 ),
  };
}

function currentClouds(weatherJSON) {
  var clouds = weatherJSON.clouds.all;

  if      ( clouds <= 10 ) { return "clear"; }
  else if ( clouds <= 30 ) { return "mostly clear"; }
  else if ( clouds <= 70 ) { return "partly cloudy"; }
  else if ( clouds <= 90 ) { return "mostly cloudy"; }
  else                     { return "overcast"; }
}

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

  return result;
}

function currentCond(weatherJSON) {
  var result = weatherJSON.weather[0].description;
  if ( weatherJSON.weather.length > 1 ) {
    result += ( " and " + weatherJSON.weather[1].description );
  }
  return result;
}



var userIP,
    userLoc,
    userWeather,
    weatherKey = "d5751e1428d98c3e715937a745922aa3";

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
            conditions = currentCond(response);
            icon = response.weather[0].id;

        $("#iconSpan").addClass( "wi-owm-" + response.weather[0].id );
        $("#tempSpan").text( temp.f + "\xB0F" );
        $("#timeSpan").text( currentTime() );
        $("#condSpan").text( capitalize( conditions ) );
        $("#windSpan").text( wind.string );

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
