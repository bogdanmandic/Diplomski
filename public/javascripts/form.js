$(document).ready(function () {

$('#kursevi').DataTable();
$('#useri').DataTable();

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};

var failLogin = getUrlParameter('failLogin');
var failSignup = getUrlParameter('failSignup');

if(failLogin == 1) {
  $('#loginModal').modal('show');
}
if(failSignup == 1) {
  $('#signupModal').modal('show');
}

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

function aaa() {
  $('#signupModal').modal('hide');
  $('#loginModal').modal('hide');
}

$('#a').on('click', () => {
  $('#signupModal').modal('hide');
  $('#loginModal').modal('hide');
})

$('#b').on('click', () => {
  $('#signupModal').modal('hide');
  $('#loginModal').modal('hide');
})

if($('#success-alert').length ) {
window.setTimeout(function() {
  $("#success-alert").fadeTo(1500, 0).slideUp(500, function(){
      $(this).remove(); 
  });
}, 1000);
}

if($('#error-alert').length ) {
  window.setTimeout(function() {
    $("#error-alert").fadeTo(1500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
  }, 1000);
}

$("#userEdit #button1").click(function () {
  $("#list1 > option:selected").each(function () {
      $(this).remove().appendTo("#list2");
  });
});

$("#userEdit #button2").click(function () {
  $("#list2 > option:selected").each(function () {
      $(this).remove().appendTo("#list1");
  });
});


});