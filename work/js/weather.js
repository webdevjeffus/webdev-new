var Weather = ( function() {

  var tempScale = "f";
  var weatherKey = "d5751e1428d98c3e715937a745922aa3";
  var userIP;
  var userLoc;
  var weatherDataStrings = {};
  var weatherObject = {};


  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  function formatTime(time) {
    var hours = time.getHours();
    var mins = time.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;
    mins = mins < 10 ? "0" + mins : mins;

    return hours + ":" + mins + " " + ampm;
  }


  function dragElement(event) {
    var dragData = {};
    dragData.pageX = event.pageX;
    dragData.pageY = event.pageY;
    dragData.element = this;
    dragData.offset = $(this).offset();

    function onMousemove(event){
      var left = dragData.offset.left + (event.pageX - dragData.pageX);
      var top = dragData.offset.top + (event.pageY - dragData.pageY);
      $(dragData.element).offset({top: top, left: left});
    }

    function onMouseup(event){
      $("body").off("mousemove", onMousemove).off("mouseup", onMouseup);
    }

    $("body").on("mousemove", onMousemove).on("mouseup", onMouseup);
  }


  function currentTime() {
    return formatTime( new Date() );
  }


  function currentTemp(weatherJSON) {
    return {
      "f": Math.round( 1.8 * (weatherJSON.main.temp - 273.15 ) + 32 ) + "\xB0F",
      "c": Math.round( weatherJSON.main.temp - 273.15 ) + "\xB0C"
    };
  }


  function currentWind(weatherJSON) {
    var wind = weatherJSON.wind;
    var result = {};

    if      ( wind.deg >  335 ||
              wind.deg <=  25 ) { result.direction = "north"; }
    else if ( wind.deg <=  65 ) { result.direction = "northeast"; }
    else if ( wind.deg <= 115 ) { result.direction = "east"; }
    else if ( wind.deg <= 155 ) { result.direction = "southeast"; }
    else if ( wind.deg <= 205 ) { result.direction = "south"; }
    else if ( wind.deg <= 245 ) { result.direction = "southwest"; }
    else if ( wind.deg <= 295 ) { result.direction = "west"; }
    else                        { result.direction = "northwest"; }

    result.speedMPH = Math.round( wind.speed * 2.25 );
    result.speedMPS = Math.round( wind.speed );
    if( wind.gust ) {
      result.gustMPH  = Math.round( wind.gust * 2.25 );
      result.gustMPS  = Math.round( wind.gust );
    }

    if ( tempScale === "f" ) {
      result.string = result.direction + " wind at " + result.speedMPH + "mph";
      if ( wind.gust && wind.gust >= (wind.speed * 1.25) ) {
        result.string += ( ",<br>gusting to " + result.gustMPH + "mph" );
      }
    }
    else {
      result.string = result.direction + " wind at " + result.speedMPS + "m/s";
      if ( wind.gust && wind.gust >= (wind.speed * 1.25) ) {
        result.string += ( ",<br>gusting to " + result.gustMPS + "m/s" );
      }
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
      set: formatTime( new Date(weatherJSON.sys.sunset * 1000) )
    };
  }


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


  function getDayNight(weatherJSON) {
    var time = new Date();
    var sunrise = new Date(weatherJSON.sys.sunrise * 1000);
    var sunset = new Date(weatherJSON.sys.sunset * 1000);

    if (time > sunrise && time <= sunset) { return "day"; }
    else { return "night"; }
  }


  function selectWeatherBG(weatherJSON) {
    var clouds = weatherJSON.clouds.all || 0;
    var time = getDayNight(weatherJSON);
    var skies = "";
    var bgClass = "";

    if      (clouds <= 10 ) { skies = "clear"; }
    else if (clouds <= 30 ) { skies = "mostly-clear"; }
    else if (clouds <= 70 ) { skies = "partly-cloudy"; }
    else if (clouds <= 90 ) { skies = "mostly-cloudy"; }
    else                    { skies = "overcast"; }

    bgClass = " " + time + "-" + skies;

    $(".weather-header").addClass( bgClass );
    $(".weather-body").addClass( bgClass);
  }


  function changeTempScale() {
    if ( tempScale === "f" ) { tempScale = "c"; }
    else { tempScale = "f"; }

    Weather.updateWeatherData();
  }


  function buildWeatherDataStrings(weatherJSON) {
    var result = {};

    result.icon =       "wi-owm-" + getDayNight(weatherJSON) + "-" + weatherJSON.weather[0].id;
    result.temp =       currentTemp(weatherJSON)[tempScale];
    result.time =       formatTime( new Date() );
    result.conditions = capitalize( currentCond(weatherJSON) );
    result.wind =       capitalize( currentWind(weatherJSON) );
    result.sunrise =    " " + getSun(weatherJSON).rise;
    result.sunset =     " " + getSun(weatherJSON).set;
    result.phase =      getMoonIcon();

    return result;
  }

  function displayWeatherData(weatherJSON) {
    weatherDataStrings = buildWeatherDataStrings(weatherJSON);

    $("#iconSpan").addClass ( weatherDataStrings.icon );
    $("#tempSpan").text     ( weatherDataStrings.temp );
    $("#condSpan").text     ( weatherDataStrings.conditions );
    $("#windSpan").html     ( weatherDataStrings.wind );
    $("#sunriseSpan").text  ( weatherDataStrings.sunrise );
    $("#sunsetSpan").text   ( weatherDataStrings.sunset );
    $("#moonPhase").addClass( weatherDataStrings.phase );

    selectWeatherBG(weatherJSON);
  }

  weatherObject.updateWeatherData = function() {
    var locationStr = "lat=" + userLoc.latitude + "&lon=" + userLoc.longitude;
    var weatherAPICall = "http://api.openweathermap.org/data/2.5/weather?" +
            locationStr + "&APPID=" + weatherKey;

    $.getJSON( weatherAPICall ).done( function(response) {
      /*
      console.log(response); // remove for production
      // */
      displayWeatherData( response );
    }).fail( function(errors) {
      console.log("OpenWeather Errors:");
      console.log(errors);
    });
  };

  weatherObject.updateTime = function() {
    $("#timeSpan").text( currentTime() );
  };


  weatherObject.displayStartingWeatherData = function() {
    $.getJSON("http://jsonip.com/?callback=?").done( function (jsonIP) {
      userIP = jsonIP.ip;

      $("#userIP").text( userIP );

      $.getJSON( "http://freegeoip.net/json/" + userIP ).done( function(jsonLoc) {

        userLoc = jsonLoc;

        $("#userTown").text( userLoc.city );

        Weather.updateWeatherData();
        Weather.updateTime();

      }).fail( function( errors ) {
        console.log("FreeGeoIP Errors:");
        console.log(errors);
      });

    }).fail( function( errors ) {
      console.log("jsonip.com API Errors:");
      console.log(errors);
    });
  };


  weatherObject.startTempScaleChanger = function () {
    $("#tempSpan").on("click", function(event) {
      event.preventDefault();

      changeTempScale();
    });
  };


  weatherObject.enableDraggableBox = function() {
    $("#weatherBox").mousedown(dragElement);
  };


  return weatherObject;

})();


setInterval( function() {
  Weather.updateTime();
}, 60000);

setInterval( function() {
  Weather.updateWeatherData();
}, 600000 );

Weather.displayStartingWeatherData();
Weather.startTempScaleChanger();
Weather.enableDraggableBox();
