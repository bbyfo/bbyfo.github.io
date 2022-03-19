// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   * 
   */
  window.Play = function ($wrapper) {
    this.$wrapper = $wrapper;
    console.log("Play created with $wrapper: ", $wrapper);

	  
	//  #picker_play_call
	  
  } // End window.Play

  /////////////////////
  // Extend Play //
  /////////////////////
  $.extend(window.Play.prototype, {

  });
  /////////////////
  // Play Helper //
  /////////////////
  window.PlayHelper = function ($wrapper) {
    this.$wrapper = $wrapper;
    console.log("PlayHelper created with $wrapper: ", $wrapper);
  }
  
  
  ////////////////////////////
  // Extend PLay Helper //
  ////////////////////////////
  $.extend(PlayHelper.prototype, {

  });

})(window, jQuery);
