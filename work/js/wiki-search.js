$(document).ready( function() {

  var Search = ( function() {
    var searchObject = {};

    function prepSearchStr(str) {
      return str.toLowerCase().split(" ").join("%20");
    }

    function prepUrlTitle(str) {
      return str.split(" ").join("_");
    }

    function formatListing( listing ) {
      var result = "";
      var url = "https://en.wikipedia.org/wiki/" + prepUrlTitle( listing.title );
      result =
        "<div class='search-result ph-col-12 tab-col-6 box'>" +
          "<h4>" +
            "<a href='" + url + "' target='_blank' title='See " + listing.title +
            " on Wikipedia'>" +
              listing.title +
            "</a>" +
          "</h4>" +
          "<p>" + listing.snippet + "...</p>" +
        "</div>";
      return result;
    }

    searchObject.enableRandomBtn = function() {
      console.log("Random button enabled");
      $("#randomBtn").on("click", function(event) {
        event.preventDefault();
        console.log("Click! Random Button");

        /*
        var apiString = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=10"

        $.getJSON( apiString ).done( function( response ) {
          console.log( response );
        });
        // */


        $.getJSON('https://en.wikipedia.org/w/api.php?format=json&action=query&list=random&utf8&callback=?', function(data){
            console.log( data );
        })

      });
    }

    searchObject.enableSearchBtn = function() {
      console.log("Search button enabled");
      $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        console.log("Click! Search Button!");

        var searchStr = prepSearchStr( $("#searchWords").val() );
        var apiStr = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=" + searchStr + "&srlimit=12&utf8&callback=?"

        $.getJSON( apiStr, function(data){
          var searchResults = data.query.search;
          console.log( searchResults );

          var resultsStr = "";

          var resultCount = searchResults.length;
          for( var i = 0; i < resultCount; i++ ) {
            //var parsedTitle = parseStr(searchResults[i]);

            // resultsStr += "<div class='search-result'>" +
            //   "<h4>" + searchResults[i].title + "</h4>" +
            //   "<p>" + searchResults[i].snippet + "...</p>" +
            //   "</div>";

            resultsStr += formatListing(searchResults[i]);

            // console.log( data.query.search[i].title );
            // console.log( data.query.search[i].snippet);
          }
          $("div#results").append( resultsStr );
        })

      });
    }

    return searchObject;

  })();



  //*
  Search.enableSearchBtn();
  Search.enableRandomBtn();
  // */


});