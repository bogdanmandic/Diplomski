$(document).ready(function () {

// toggle function
$('.toggle').click(function () {
  // switch icon
  $(this).children('i').toggleClass('fa-pencil');
  // switch form
  $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "medium");
});

if($('#success-alert').length ) {
window.setTimeout(function() {
  $("#success-alert").fadeTo(1500, 0).slideUp(500, function(){
      $(this).remove(); 
  });
}, 5000);
}

if($('#error-alert').length ) {
  window.setTimeout(function() {
    $("#error-alert").fadeTo(1500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
  }, 5000);
}


});