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
      'click',
      '#show_blocking_all',
      this.handleShowBlockingAll.bind(this)
    );

  };


  $.extend(window.Blocking.prototype, {

    validateFieldForBlocking: function () {
      //      console.log("validateField() called");
      // Make sure there are 11 offensive positions and 11 defensive positions.
      var offensivePositionsCount = $(".position-node.position-offense").length;
      var defensivePositionsCount = $(".position-node.position-defense").length;
      var blockingAssignment = $('#picker_blocking_call').val();
      // console.log("blockingAssignment: ", blockingAssignment);
      // console.log("offensivePositionsCount: ", offensivePositionsCount);
      // console.log("defensivePositionsCount: ", defensivePositionsCount);
      if ((offensivePositionsCount == 11 && defensivePositionsCount == 11) && blockingAssignment != '--default--') {
        return true;
      } else {
        return false;
      }

    },

    handleShowBlockingAll: function (e) {
      //      console.log("handleShowBlockingAll()", e);

      // Make sure the field is set up properly and a Blocking Call is selected
      if (this.validateFieldForBlocking()) {
        //        console.log("Field is Valid for Blocking: ", e);
        var blockingAssignment = $('#picker_blocking_call').val();
        //        console.log("blockingAssignment: ", blockingAssignment);
        // Load the Blocking Call file

        fetch("data/offense/" + blockingAssignment + ".json")
          .then(Response => Response.json())
          .then(blockingCall => {

            //            console.log("blockingCall: ", blockingCall);

            // Loop over the assignments and send them off to the ...
            blockingCall.blockingAssignments.forEach((blockingAssignment) => {

              //              console.log("blockingAssignment: ", blockingAssignment);
              this.processBlockingAssignment(blockingAssignment);

            });


            // We set gaps here to make sure that all the Offensive positions have been set.
            //setGaps();
          });


      } else {
        // Looks like this Field isn't valid, or a Blocking Call hasn't been selected.
        console.log("Field is NOT Valid for Blocking: ");
      }
    },
    showBlockingAll: function () {
      console.log("showBlockingAll() called");
    },
    showBlockingSingle: function () {

    },
    processBlockingAssignment: function (blockingAssignment) {
      console.log("processBlockingAssignment() called", blockingAssignment);
      blockingAssignment.appliesTo.forEach((position) => {
        console.log("position: ", $(position));
      });
    }

  });
})(window, jQuery);
