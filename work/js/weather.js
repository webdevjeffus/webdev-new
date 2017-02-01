function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  result.string = "Out of the " + result.direction + " at " + result.speedMPH + "mph/" + result.speedMPS + "m/s";
  if ( wind.gust && wind.gust >= (wind.speed * 1.25) ) {
    result.string += ( ", with gusts to " + result.gustMPH + "mph/" + result.gustMPS + "m/s" );
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
    weatherKey = "0befa1dbfce1cc5b277b1fc36ecb3de1";

$.getJSON("http://jsonip.com/?callback=?").done( function (jsonIP) {
  userIP = jsonIP.ip;

  $("#userIP").text( userIP );

  $.getJSON( "http://freegeoip.net/json/" + userIP ).done( function(jsonLoc) {

    userLoc = jsonLoc;

    $("#userTown").text( userLoc.city + ", " + userLoc.region_code + ", " + userLoc.country_code );
    $("#userLat").text( userLoc.latitude );
    $("#userLong").text( userLoc.longitude );

    var locationStr = "lat=" + userLoc.latitude + "&lon=" + userLoc.longitude;
    var weatherAPICall = "http://api.openweathermap.org/data/2.5/weather?" + locationStr + "&APPID=" + weatherKey;

    $.getJSON( weatherAPICall ).done( function(response) {
      console.log(response);
      var temp = currentTemp(response),
          skies = currentClouds(response),
          wind = currentWind(response),
          conditions = currentCond(response);
          icon = response.weather[0].id;

      $("#tempSpan").text( temp.f + "\xB0 F, " + temp.c + "\xB0 C");
      $("#condSpan").text( capitalize( conditions ) );
      $("#skiesSpan").text( capitalize( skies ) );
      $("#windSpan").text( wind.string );
      $("#iconSpan").addClass( "wi-owm-" + response.weather[0].id );

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
