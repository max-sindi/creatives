'use strict';

$(document).ready(function () {
  navTogglerCreate();

  function navTogglerCreate() {
    var toggler = $('#top-nav__toggler'),
        toggleTarget = $('#top-nav'),
        wind = $(window),
        togglerIsVisible = void 0; // boolean in next steps


    checkWidth();
    wind.on('resize', checkWidth);

    function checkWidth() {
      var needShow = windowIsSmall();

      // first time will not work because togglerIsVisible is empty yet
      // and will checked when window.resize
      if (needShow === togglerIsVisible) {
        return;
      }

      if (needShow) {
        showToggler();
      } else {
        hideToggler();
      }
    }

    function windowIsSmall() {
      if (wind.width() <= 992) {
        return true;
      } else {
        return false;
      }
    }

    function hideToggler() {
      toggler.hide();
      toggleTarget.show();
      togglerIsVisible = false;
    }

    function showToggler() {
      toggler.show();
      toggleTarget.hide();
      togglerIsVisible = true;
    }
  }

  toggleNavVisibility();

  function toggleNavVisibility() {
    $('#js-nav-toggler').click(toggleVisible);

    function toggleVisible() {
      var targetToggle = $('#top-nav'),
          isTargetHidden = $('#top-nav:hidden')[0],
          targetBackSide = $('.top-section__main');

      if (isTargetHidden) {
        targetToggle.fadeIn('fast');
        targetBackSide.addClass('small-visibility');
      } else {
        targetToggle.fadeOut('fast');
        targetBackSide.removeClass('small-visibility');
      }
    }
  }

  topScrollDown();

  function topScrollDown() {

    $('#scroll-down-l').show();
    $('#scroll-down-button').click(doScroll);

    function doScroll() {
      var page = $(window),
          sectionHeight = $('#top-section').outerHeight(),
          currentScroll = page.scrollTop(),
          needScroll = sectionHeight - currentScroll,
          i = 0,
          i_max = 100,
          // fluency
      interval = 5,
          // frequency of scroll
      part = needScroll / i_max,
          timer = null;

      timer = setInterval(function () {
        page.scrollTop(currentScroll + part * ++i);

        if (i === i_max) {
          clearInterval(timer);
        }
      }, interval);
    }
  }
});