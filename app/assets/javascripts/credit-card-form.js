$(document).on("turbolinks:load", () => {
  var show_error, stripeResponseHandler, submitHandler;

  submitHandler = (e) => {
    var $form = $(e.target);
    $form.find("input[type=submit]").prop("disabled", true);

    if (Stripe){
      Stripe.card.createToken($form, stripeResponseHandler);
    } else {
      show_error("Failed to load credit card processing functionality. Please reload this page in your browser.")
    }
    return false;
  }

  $(".cc_form").on("submit", submitHandler);

  stripeResponseHandler = (status, res) => {
    var token, $form

    $form = $(".cc_form");

    if (res.error){
      console.log(res.error.message);
      show_error(res.error.message);
      $form.find("input[type=submit]").prop("disabled", false);
    } else {
      token = res.id;
      $form.append($("<input type=\"hidden\" name=\"payment[token]\" />").val(token));
      $("[data-stripe=number]").remove();
      $("[data-stripe=cvc]").remove();
      $("[data-stripe=year]").remove();
      $("[data-stripe=month]").remove();
      $("[data-stripe=label]").remove();
      $form.get(0).submit();
    }

    return false;
  };

  show_error = (m) => {
    if ($("#flash-messages").size() < 1){
      $("div.container.main div:first").prepend("<div id='flash-messages'></div>");
    }
    $("#flash-messages").html("<div class='alert alert-warning'><a class='close' data-dismiss='alert'>×</a><div id='flash_alert'>"+m+"</div></div>");
    $(".alert").delay(5000).fadeOut(3000);
    return false;
  };
});