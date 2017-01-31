$("#quoteBox").on("click", function(event) {
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
    quote.text("No one cares what QuoteMonster says. Click \u2018Get a Quote\u2019 to load something worth tweeting!");
  }

  else if( quote.text().length + author.text().length + 1 > 140 ) {
    quote.text("Sorry. That quote was too long to tweet. Please try another!");
    author.text("QuoteMonster");
  }

  else {
    function queryText(text) {
      text = text.split("");

      for( var i = 0; i < text.length; i++) {
        if ( text[i] === " " ) { text[i] = "%20"; }
        else if ( text[i] === ";" ) { text[i] = "%3B"; }
        else if ( text[i] === "%" ) { text[i] = "%25"; }
        else if ( text[i] === "+" ) { text[i] = "%2B"; }
      }
      return text.join("");
    }

    window.open( "https://twitter.com/intent/tweet?text=" + queryText( quote.text() ) + "%E2%80%94" + queryText( author.text() ) );
  }
});