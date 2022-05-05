// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   */
  window.FieldSettings = function ($wrapper) {
    this.$wrapper = $wrapper;
    console.log("FieldSettings", $wrapper);

    //	  $('.js-help-toggler')

    // Event Handler for clicking on the ball
    this.$wrapper.on(
      'click',
      '.js-help-toggler',
      this.helpToggler.bind(this)
    );

  };

  $.extend(window.FieldSettings.prototype, {

    helpToggler: function (e) {
      console.log("e", $(e.target));
      console.log(this);

      $(e.target).parent().next('.body-wrapper').toggleClass(['show-help']);
    }

  });

})(window, jQuery);
