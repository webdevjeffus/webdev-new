$("#quoteBtn").on("click", function(event) {
  event.preventDefault();

  $("#quote-btn").html("Get another quote");
  $.getJSON("./js/quote-monster.json", function(json) {
    var i = Math.floor( (Math.random() * json.length));
    $("#quote").html(json[i].quote);
    $("#author").html(json[i].author);
  });
});

$("#tweetBtn").on("click", function( event ) {
  event.preventDefault();
  $("#tweetBtn").html("<span class='fa fa-exclamation-triangle' aria-hidden='true'></span> Not yet!");
});