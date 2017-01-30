$("#quoteBtn").on("click", function(event) {
  event.preventDefault();

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
});