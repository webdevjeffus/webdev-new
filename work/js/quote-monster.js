$("#quoteBtn").on("click", function(event) {
  event.preventDefault();

  function prepText(text) {
      text = text.split("");

      for( var i = 0; i < text.length; i++) {
        // Open quotes - convert all to left single quote
        if ( (text[i] === "'" && i === 0) ||            // Single quote, 1st char
             (text[i] === "'" && text[i-1]) === " " ||  // Single quote preceded by space
             (text[i] === '"' && i === 0) ||            // Double quote, 1st char
             (text[i] === '"' && text[i-1]) === " " ||  // Double quote preceded by space
             (text[i] === "\u201C") ) {                 // Left double quote
          text[i] = "\u2018";                           // Convert to left single quote
        }
        // Close quotes and apostrophes - convert all to right single quote
        if ( (text[i] === "'" ) ||                      // Single quote
             (text[i] === '"' ) ||                      // Double quote
             (text[i] === "\u201D") ) {                 // Right double quote
          text[i] = "\u2019";                           // Convert to right single quote
        }
      }
      return text.join("");
    }

  $("#sorryBox").addClass("hidden");
  $("#quoteBox").removeClass("hidden");
  $("#quote-btn").html("Get another quote");


  $.ajax({
    type: "GET",
    url: "http://quotes.stormconsultancy.co.uk/random.json",
    success: function(json) {
      console.log( json );
      $("#quote").html( prepText( json.quote ) );
      $("#author").html( prepText( json.author ) );
    },
    error: function(error) {
      console.log( error );
    }
  });
});

$("#tweetBtn").on("click", function( event ) {
  event.preventDefault();

  var quote = $("#quote"),
      author = $("#author");

  if( author.text() === "QuoteMonster" ) {
    quote.text("You need to click \u2018Get a Quote\u2019 before you can \u2018Tweet it!\u2019");
    author.text("QuoteMonster");
  }

  else if( quote.text().length + author.text().length + 1 > 140 ) {
    $("#quoteBox").addClass("hidden");
    $("#sorryBox").removeClass("hidden");
  }

  else {
    function queryText(text) {
      text = text.split("");

      for( var i = 0; i < text.length; i++) {
        if ( text[i] === ";" ) { text[i] = "%3B"; }
        else if ( text[i] === "+" ) { text[i] = "%2B"; }
        else if ( text[i] === " " ) { text[i] = "%20"; }
      }
      return text.join("");
    }

    var queryQuote = queryText( $("#quote").text() ),
        queryAuthor = queryText( $("#author").text() );

    var tweetHref = "https://twitter.com/intent/tweet?text=" + queryQuote + "%E2%80%94" + queryAuthor;

    window.open( tweetHref );
  }

});