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
    //    console.log("Play created with $wrapper: ", $wrapper);


    //  #picker_play_call

  } // End window.Play

  /////////////////////
  // Extend Play //
  /////////////////////
  $.extend(window.Play.prototype, {

    moveBallCarrier: function (playCall) {
      console.log("moveBallCarrier()", playCall);
      //      console.log("playCall.ballCarrier", playCall.ballCarrier.appliesTo);
      // Get the ball carrier

      let ballCarrierID = playCall.ballCarrier.appliesTo;
      //      console.log("ballCarrierID: ", ballCarrierID);


      let $ballCarrier = $(ballCarrierID);

      // Add Ball Carrier's responsabilities
      let ballCarrierResponsabilities = playCall.ballCarrier.responsibility;

      $ballCarrier.attr('data-position-responsibilities', ballCarrierResponsabilities);


      $ballCarrier.addClass(['blocking-identifier--' + ballCarrierID.replace('#', '')]);
      //      console.log("$ballCarrier: ", $ballCarrier);


      // Clone the ballcarrier here
      let $ballCarrierClone = $ballCarrier.clone().removeAttr('id').addClass(['ima-clone']);
      // Get the clone's parent
      let $ballCarrierCloneParent = $ballCarrier.parent();
      //      console.log("$ballCarrierCloneParent: ", $ballCarrierCloneParent);

      // Place the clone here
      $ballCarrierCloneParent.append($ballCarrierClone);

      // Add ball carrier class to original
      $ballCarrier.addClass(['ball-carrier']);

      // Get the ballcarrier's destination coords
      let $destinationElm = $(playCall.ballCarrier.destination).parent().parent();
      //      console.log("$destinationElm: ", $destinationElm);
      //		let gridPositionSection = "offensive_los";
      let gridPositionX = $destinationElm.data('grid-position-x');
      //      console.log("gridPositionX: ", gridPositionX);
      let gridPositionY = "offensive_los";
      //      console.log("gridPositionY: ", gridPositionY);

      //		
      let gridPositionSelector = 'offense-' + gridPositionX + '-' + gridPositionY;
      //      console.log("gridPositionSelector: ", gridPositionSelector);

      let $finalDestination = $("[data-grid-coords|='" + gridPositionSelector + "']");
      //      console.log("$finalDestination: ", $finalDestination);
      // Move the original to the destination
      $finalDestination.find('.position-wrapper').append($ballCarrier);

      // Remove the ball image from the ball origin
      $("#ball-origin").addClass('after-snap');

    }

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
