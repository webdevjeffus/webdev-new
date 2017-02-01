var userIP,
    userLoc;

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
      }
      else {
        $("#userTown").text( "Unavailable");
      }
    })

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