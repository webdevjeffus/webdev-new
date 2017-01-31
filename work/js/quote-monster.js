$("#quoteBtn").on("click", function(event) {
  event.preventDefault();

  $("#sorryBox").addClass("hidden");
  $("#quoteBox").removeClass("hidden");
  $("#quote-btn").html("Get another quote");


  $.ajax({
    type: "GET",
    url: "http://quotes.stormconsultancy.co.uk/random.json",
    success: function(json) {
      console.log( json );
      $("#quote").html(json.quote);
      $("#author").html(json.author);
    },
    error: function(error) {
      console.log( error );
    }
  });
});

$("#tweetBtn").on("click", function( event ) {
  event.preventDefault();

  $("#tweetBtn").html("<span class='fa fa-exclamation-triangle' aria-hidden='true'></span> Not yet!");

  var quote = $('#quote'),
      author = $('#author');

  if( author.text() === "QuoteMonster" ) {
    quote.text("You need to click \u2018Get a Quote\u2019 before you can \u2018Tweet it!\u2019");
  }

  else if( quote.text().length + author.text().length + 1 > 140 ) {
    $("#quoteBox").addClass("hidden");
    $("#sorryBox").removeClass("hidden");
    console.log( "Too long!" );
  }

  else {
    function prepText(text) {
      text = text.split("");
      var punctuations = ".,!? s";

      for( var i = 0; i < text.length; i++) {
        if ( (text[i] === "'" && i === 0) ||
             (text[i] === "'" && text[i-1]) === " " ||
             (text[i] === '"' && i === 0) ||
             (text[i] === '"' && text[i-1]) === " " ) {
          text[i] = "X";
        }
        if ( (text[i] === "'" && i === text.length-1) ||
             (text[i] === "'" && !(punctuations.includes(text[i+1])))  ||
             (text[i] === '"' && i === text.length-1) ||
             (text[i] === '"' && !(punctuations.includes(text[i+1]))) ) {
          text[i] = "\u2018";
        }
        if ( text[i] === ";" && text[i+1] === " ") {
          text[i] = "\u2014";
          text[i+1] = "";
        }
        if ( text[i] === "+" ) { text[i] = "%2B"; }
        if ( text[i] === " " ) { text[i] = "%20"; }
      }
      return text.join("");
    }

    var preppedQuote = prepText( $('#quote').text() ),
        preppedAuthor = prepText( $('#author').text() );


    var tweetHref = "https://twitter.com/intent/tweet?text=" + preppedAuthor + ":%20" + preppedQuote;

    console.log( tweetHref );

    window.open( tweetHref );

  }

});