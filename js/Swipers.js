// JavaScript Document
'use strict';
(function (window, $) {
	
	
  let swiperSettings = {
    centeredSlides: true,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }
  }

  //////////////////////
  // Offensive Swiper //
  //////////////////////
  const offensiveSwiper = new Swiper('.offensiveSwiper', swiperSettings);

  offensiveSwiper.on('slideChange', function (offensiveSwiper) {
    let formationId = $(offensiveSwiper.slides[offensiveSwiper.activeIndex]).attr('data-formation-id');
    //				console.log("formationId: ", formationId);
    $('#picker_offense_formation').val(formationId).trigger('change');
  });

  //////////////////////
  // Defensive Swiper //
  //////////////////////
  const defensiveSwiper = new Swiper('.defensiveSwiper', swiperSettings);
  defensiveSwiper.on('slideChange', function (defensiveSwiper) {
    let formationId = $(defensiveSwiper.slides[defensiveSwiper.activeIndex]).attr('data-formation-id');
    console.log("formationId: ", formationId);
    $('#picker_defense_formation').val(formationId).trigger('change');
  });

  /////////////////////
  // Blocking Swiper //
  /////////////////////
  const blockingSwiper = new Swiper('.blockingSwiper', swiperSettings);
  blockingSwiper.on('slideChange', function (blockingSwiper) {
    let formationId = $(blockingSwiper.slides[blockingSwiper.activeIndex]).attr('data-formation-id');
    //				console.log("formationId: ", formationId);

    $('#picker_blocking_call').val(formationId).trigger('change');

  });

  /////////////////
  // Play Swiper //
  /////////////////
  const playSwiper = new Swiper('.playSwiper', swiperSettings);
  playSwiper.on('slideChange', function (playSwiper) {
    let formationId = $(playSwiper.slides[playSwiper.activeIndex]).attr('data-formation-id');
    console.log("formationId: ", formationId);

    $('#picker_play_call').val(formationId).trigger('change');

  });

  $("#picker_offense_formation").trigger('change');


})(window, jQuery);
