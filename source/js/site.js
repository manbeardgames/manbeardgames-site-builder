(function () {
    $(function () {
      $('#animtescroll').click(function (e) {
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
  
    function setSwap() {
      var sheight = $('#landing').css('height');
      $('#swap').height(sheight);
    }
  
    // function setAffix() {
    //   // $('.sidebar').affix({
    //   $('#topNav').affix({
    //     offset: {
    //       // top: $('.sidebar').offset().top
    //       top: $('#topNav').offset().top
    //     }
    //   });
    // }
  
    $(window).resize(function () {
      setSwap();
      // setAffix();
    });
  
    setSwap();
  
    // if ($('#topNav').length) {
    //   setAffix();
    // }
  
    // $('h1, h2, h3, h4, h5, h6').each(function () {
    //   if (this.id) {
    //     $(this).wrapInner('<a href="#' + this.id + '"></a>');
    //   }
    // });
  
    $('ul.nav a').click(function () {
      $('nav.navbar-collapse').height(1).removeClass('in');
    });
  
    $('body').click(function () {
      $('#menu').collapse('hide');
    });
  
    $('.content-section table').addClass('table'); // TODO Remove this after tables are styled in CSS
  
  })();
  