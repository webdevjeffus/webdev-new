$(document).ready( function() {
  console.log("Ready!");

  var Search = ( function() {
    console.log("Search function begun");
    var searchObject = {};

      searchObject.enableRandomBtn = function() {
        $("#randomBtn").on("click", function(event) {
          event.preventDefault();
          console.log("Click!");
  //*
          var apiString = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=10"

          $.getJSON( apiString ).done( function( response ) {
            console.log( response );
          });
  // */
        });
      }

    return searchObject;

  })();



  //*
  Search.enableRandomBtn();
  // */


});