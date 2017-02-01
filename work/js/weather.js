function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function currentTemp(weatherJSON) {
  return {
    "f": Math.round( (1.8 * (weatherJSON.main.temp - 273.15)) + 32 ),
    "c": Math.round( weatherJSON.main.temp - 273.15 ),
  };
}

function currentClouds(weatherJSON) {
  var clouds = weatherJSON.clouds.all;

  if (clouds <= 10 ) { return "clear"; }
  else if (clouds <= 30) {return "mostly clear"; }
  else if (clouds <= 70) {return "partly cloudy"; }
  else if (clouds <= 90) {return "mostly cloudy"; }
  else { return "overcast"; }
}

function currentWind(weatherJSON) {
  var wind = weatherJSON.wind,
      result = {};

  if (wind.deg <= 25 || wind.deg > 335 ) { result.direction = "North"}
  else if ( wind.deg <=  65 ) { result.direction = "Northeast" }
  else if ( wind.deg <= 115 ) { result.direction = "East" }
  else if ( wind.deg <= 155 ) { result.direction = "Southeast" }
  else if ( wind.deg <= 205 ) { result.direction = "South"}
  else if ( wind.deg <= 245 ) { result.direction = "Southwest" }
  else if ( wind.deg <= 295 ) { result.direction = "West" }
  else                        { result.direction = "Northwest "}

  result.speedMPS = Math.round( wind.speed );
  result.speedMPH = Math.round( wind.speed * 2.23694 );

  return result;
}

var userIP,
    userLoc,
    userWeather,
    weatherKey = "0befa1dbfce1cc5b277b1fc36ecb3de1";

$.getJSON("http://jsonip.com/?callback=?", function (jsonIP, statusIP) {
  userIP = jsonIP.ip;
  console.log(userIP);
  if ( statusIP == "success" ) {
    $("#userIP").text( userIP );

    $.getJSON("http://freegeoip.net/json/" + userIP, function (jsonLoc, statusLoc) {
      console.log( jsonLoc );

      userLoc = jsonLoc;
      if ( statusLoc = "success" ) {
        $("#userTown").text( userLoc.city + ", " + userLoc.region_code + ", " + userLoc.country_code );
        $("#userLat").text( userLoc.latitude );
        $("#userLong").text( userLoc.longitude );

        var locationStr = "lat=" + Math.round(userLoc.latitude) + "&lon=" + Math.round(userLoc.longitude);

        console.log( locationStr );

        var weatherAPICall = "http://api.openweathermap.org/data/2.5/weather?" + locationStr + "&APPID=" + weatherKey;

        console.log( weatherAPICall );


        // $.getJSON( weatherAPICall, function( jsonWeather, status ) {
        //    userWeather = jsonWeather;
        //    console.log( userWeather );
        // });

        $.ajax({
          method: "GET",
          url: weatherAPICall,
        }).done( function(response) {
          console.log(response);
          var temp = currentTemp(response),
              skies = currentClouds(response),
              wind = currentWind(response)

          $("#tempSpan").text( temp.f + "\xB0 F, " + temp.c + "\xB0 C");
          $("#skiesSpan").text( capitalize( skies ) );
          $("#windSpan").text( wind.speedMPH + "mph/" + wind.speedMPS + "ms out of the " + wind.direction );


        }).fail( function(errors) {
          console.log(errors);
        })

      }
      else {
        $("#userTown").text( "Unavailable");
      }
    });

  }
  else {
    $("#userIP").text( "Unavailable");
  }
});




// var userLocation;

// var coffeeShopAPI = "http://rest.learncode.academy/api/learncode/wdj-coffee-shop-orders";

// var jsonip = "http://jsonip.com/?callback=?";

// $.ajax({
// type: "GET",
// url: "http://jsonip.com/?callback=?",
// success: function(json) {
//   console.log( "Success!");
//   // console.log( json.ip );
//   },
// });