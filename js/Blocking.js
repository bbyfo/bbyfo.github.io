// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   */
  window.Blocking = function ($wrapper, $blockingPositions) {
    console.log("Blocking instantiated.", $wrapper);
    this.$wrapper = $wrapper;
    // Event Handler for Picking the Blocking Call
    this.$wrapper.on(
      'change',
      '#picker_blocking_call',
      this.handlePickBlockingCall.bind(this)
    );

  };


  $.extend(window.Blocking.prototype, {

    validateField: function () {
      console.log("validateField() called");
      // Make sure there are 11 offensive positions and 11 defensive positions.
      var offensivePositionsCount = $(".position-node.position-offense").length;
      var defensivePositionsCount = $(".position-node.position-defense").length;
      console.log("offensivePositionsCount: ", offensivePositionsCount);
		 console.log("defensivePositionsCount: ", defensivePositionsCount)
    },

    handlePickBlockingCall: function (e) {
      console.log("handlePickBlockingCall()", e);
      this.validateField();

    }

  });
})(window, jQuery);
