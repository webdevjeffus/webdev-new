$(document).ready( function() {
  console.log("Ready!");

  var Search = ( function() {
    console.log("Search function begun");
    var searchObject = {};

    searchObject.enableRandomBtn = function() {
      $("#randomBtn").on("click", function(event) {
        event.preventDefault();
        console.log("Click! Random Button");

        /*
        var apiString = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=10"

        $.getJSON( apiString ).done( function( response ) {
          console.log( response );
        });
        // */
      });
    }

    searchObject.enableSearchBtn = function() {
      $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        console.log("Click! Search Button!");

      });
    }

    return searchObject;

  })();



  //*
  Search.enableSearchBtn();
  Search.enableRandomBtn();
  // */


});