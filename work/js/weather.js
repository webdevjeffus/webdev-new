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

        var weatherAPICall = "https://api.openweathermap.org/data/2.5/weather?" + locationStr + "&APPID=d5751e1428d98c3e715937a745922aa3";

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