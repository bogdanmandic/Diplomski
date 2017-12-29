// toggle function
$('.toggle').click(function(){
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

