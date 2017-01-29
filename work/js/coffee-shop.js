var ordersList = $("#ordersList"),
    newOrderName = $("#name"),
    newOrderDrink = $("#drink");

var coffeeShopAPI = "http://rest.learncode.academy/api/learncode/wdj-coffee-shop-orders";

$.ajax({
  type: "GET",
  url: coffeeShopAPI,
  success: function(orders) {
    $.each( orders, function( i, order ) {
      ordersList.append(
        "<tr order-id='" + order.id + "'>" +
        "<td>" +
          "<span class='saved-mode name'>" + order.name + "</span> " +
          "<input type='text' class='edit-mode name'></input>" +
        "</td><td>" +
          "<span class='saved-mode drink'>" + order.drink + "</span> " +
          "<input type='text' class='edit-mode drink' autofocus></input>" +
        "</td><td>" +
          "<button class='btn editOrderBtn saved-mode'>Change Order</button>" +
          "<button id='" + order.id + "' class='btn closeOrderBtn saved-mode'>Close Order</button>" +
          "<button class='btn saveEditBtn edit-mode'>Save</button>" +
          "<button class='btn cancelEditBtn edit-mode'>Cancel</button>" +
          "</td>" +
        "</tr>"
      );
    });
  },
});

$("#placeOrderBtn").on("click", function(event) {
  event.preventDefault();

  var order = {
    "name": newOrderName.val(),
    "drink": newOrderDrink.val()
  };

  $.ajax({
    type: "POST",
    url: coffeeShopAPI,
    data: order,
    success: function(response) {
      ordersList.append(
        "<tr order-id='" + response.id + "'>" +
        "<td>" +
          "<span class='saved-mode name'>" + response.name + "</span> " +
          "<input type='text' class='edit-mode name'></input>" +
        "</td><td>" +
          "<span class='saved-mode drink'>" + response.drink + "</span> " +
          "<input type='text' class='edit-mode drink' autofocus></input>" +
        "</td><td>" +
          "<button class='btn editOrderBtn saved-mode'>Change Order</button>" +
          "<button id='" + response.id + "' class='btn closeOrderBtn saved-mode'>Close Order</button>" +
          "<button class='btn saveEditBtn edit-mode'>Save</button>" +
          "<button class='btn cancelEditBtn edit-mode'>Cancel</button>" +
          "</td>" +
        "</tr>"
      );
      newOrderName.val("");
      newOrderDrink.val("");
    }
  });
});

$("#ordersList").delegate( ".closeOrderBtn", "click", function(event) {
  event.preventDefault();

  var order = $(this).closest('tr');

  $.ajax({
    type: "DELETE",
    url: coffeeShopAPI + "/" + $(this).attr('id'),
    success: function() {
      order.fadeOut(250, function() {
        $(this).remove();
      });
    }
  });
})

$("#ordersList").delegate( ".editOrderBtn", "click", function(event) {
  event.preventDefault();

  var order = $(this).closest("tr");
  order.find("input.name").val( order.find("span.name").text() );
  order.find("input.drink").val( order.find("span.drink").text() );
  order.addClass('edit-mode');
})

$("#ordersList").delegate( ".cancelEditBtn", "click", function(event) {
  event.preventDefault();

  var order = $(this).closest("tr");
  order.removeClass('edit-mode');
})

$("#ordersList").delegate( ".saveEditBtn", "click", function(event) {
  event.preventDefault();

  var order = $(this).closest("tr");
  var updatedOrder = {
    name: order.find("input.name").val(),
    drink: order.find("input.drink").val()
  };

  $.ajax({
    type: 'PUT',
    url: coffeeShopAPI + "/" + order.attr('order-id'),
    data: updatedOrder,
    success: function() {
      order.find("span.name").text(order.find("input.name").val());
      order.find("span.drink").text(order.find("input.drink").val());
      order.removeClass("edit-mode");
    }
  })
});