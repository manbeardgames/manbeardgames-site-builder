(function () {

  //  Animates the scrolling when the "game" button is clicked in the landing. Scrolls down to be
  //  positioned at the first game in the list
  $(function () {
    $('#animatescroll').click(function (e) {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 750);

          e.preventDefault();
        }
      }
    });
  });


  // Sets the swap div to be the height of the landing div
  function setSwap() {
    var sheight = $('#landing').css('height');
    $('#swap').height(sheight);
  }


  //  When the window resizes, we need to re-set the swap
  $(window).resize(function () {
    setSwap();
  });

  //  Set initial swap
  setSwap();


  //  When a link in the navbar is clicked, collapse the navbar
  $('#navbarNav a').click(function () {
    $('#navbarNav').collapse('hide');
  });

  //  When the body is clicked, collapse the navbar
  $('body').click(function () {
    $('#navbarNav').collapse('hide');
  });

  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
  });


})();
