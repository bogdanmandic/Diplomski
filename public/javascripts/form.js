$(document).ready(function () {
  $('#courses').DataTable();

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
    console.log('a');
    $('#signupModal').modal('hide');
    $('#loginModal').modal('hide');
  }

  $('#a').on('click', () => {
    console.log('a');
    $('#signupModal').modal('hide');
    $('#loginModal').modal('hide');
  })

  $('#b').on('click', () => {
    console.log('a');
    $('#signupModal').modal('hide');
    $('#loginModal').modal('hide');
  })

  if ($('#success-alert').length) {
    window.setTimeout(function () {
      $("#success-alert").fadeTo(1500, 0).slideUp(500, function () {
        $(this).remove();
      });
    }, 5000);
  }

  if ($('#error-alert').length) {
    window.setTimeout(function () {
      $("#error-alert").fadeTo(1500, 0).slideUp(500, function () {
        $(this).remove();
      });
    }, 5000);
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