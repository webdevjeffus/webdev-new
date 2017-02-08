$(document).ready( function() {

  var Search = ( function() {
    var searchObject = {};

    function prepQueryStr(str) {
      return str.toLowerCase().split(" ").join("%20");
    }

    function prepUrlTitle(str) {
      return str.split(" ").join("_");
    }

    function prepResultsHeader(str) {
      if (str) { return "Search results for <em>" + str + "</em>"; }
      else { return "12 random topics on from Wikipedia"; }
    }

    function getSearchResults( apiStr ) {
      $.getJSON( apiStr, function(data) {
        var searchResults = data.query.search ? data.query.search : data.query.random;
        var resultCount = searchResults.length;
        var resultsStr = "";

        for( var i = 0; i < resultCount; i++ ) {
          resultsStr += formatListing( searchResults[i] );
        }

        $("div#results").empty().append( resultsStr );
      });
    }

    function updateTextElements( searchStr ) {
      $("#searchWords").val("");
      $("#resultsHeading").
        empty().
        append(prepResultsHeader(searchStr)).
        removeClass("hidden");
      $("#emptySearchWarning").addClass("hidden");
    }

    function formatListing( listing ) {
      var result = "";
      var url = "https://en.wikipedia.org/wiki/" + prepUrlTitle( listing.title );

      result =
        "<div class='search-result box'>" +
          "<h4>" +
            "<a href='" + url + "' target='_blank' title='See " + listing.title +
            " on Wikipedia'>" +
              listing.title +
            "</a>" +
          "</h4>";
      if (listing.snippet) { result += "<p>" + listing.snippet + "...</p>"; }
      result += "</div>";

      return result;
    }

    searchObject.enableRandomBtn = function() {
      $("#randomBtn").on("click", function(event) {
        event.preventDefault();

        var apiStr = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=random&rnlimit=12&rnnamespace=0&utf8&callback=?"

        updateTextElements();
        getSearchResults( apiStr );
      });
    }

    searchObject.enableSearchBtn = function() {
      $("#searchBtn").on("click", function(event) {
        event.preventDefault();

        var searchStr = ( $("#searchWords").val() )

        if ( searchStr ) {
          var queryStr = prepQueryStr( searchStr );
          var apiStr = "https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=" + queryStr + "&srlimit=12&srprop=snippet&utf8&callback=?"

          updateTextElements( searchStr );
          getSearchResults( apiStr );
        }
        else { $("#emptySearchWarning").removeClass("hidden"); }
      });
    }

    return searchObject;
  })();

  Search.enableSearchBtn();
  Search.enableRandomBtn();

});
