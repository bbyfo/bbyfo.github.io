// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   */
  window.Blocking = function ($wrapper, $blockingPositions) {
    //    console.log("Blocking instantiated.", $wrapper);
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
              this.processBlockingAssignments(blockingAssignment);

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
    processBlockingAssignments: function (blockingAssignment) {
      console.log("processBlockingAssignments() called with: ", blockingAssignment);

      //      console.log("blockingAssignment.appliesTo: ", blockingAssignment.appliesTo);
      let blockingAssignmentClassNumber = 1;

      blockingAssignment.appliesTo.forEach((positionClass) => {
        //        console.log("positionClass: ", positionClass);

        let $positionsByClass = $(positionClass);
        //        console.log("$positionsByClass: ", $positionsByClass);

        $positionsByClass.each((i, position) => {
          //          console.log("position: ", position);
          let $thisPosition = $(position);
          let positionHelper = new PositionHelper();
          let rules = blockingAssignment.rules;
          console.log("-----------");
          console.log("$thisPosition: ", $thisPosition.attr('id'));
          // Find my X
          let myX = $thisPosition.parent().css("grid-column-start");
          // Find my Inside
          let myInside = positionHelper.whereIsMyInside(myX);

          console.log("myX: ", myX);
          console.log("myInside: ", myInside);
          //          console.log(rules);
          // Loop through rules and stop at the first 'yes'
          // @todo The big 'ol switch statement has to manually match all possible values in the blocking_call__XXXXX.json files.
          // Not optimal, but it's what we've got for now.
          // sanityCounter keeps us from eternally looping and crashing stuff if we miss something.
          let foundAssignment = false;

          rules.forEach((rule) => {
            let assignmentX = null;
            let assignmentY = null;
            let $targetToCheck = null;
            console.log("blockingAssignmentClassNumber: ", blockingAssignmentClassNumber);
            if (foundAssignment === false) {
              console.log(`Processing rule: ${rule.name}`);

              // Get the X coord for the rule
              switch (rule.name) {
                case 'gap_inside':
                  if (myInside == "higher") {
                    assignmentX = Number(myX) + Number(1);
                  } else if (myInside == "lower") {
                    assignmentX = Number(myX) - Number(1);

                  } else if (myInside == "onball") {
                    assignmentX = myX;
                  } else {

                  }

                  break;
                case 'on_me':
                  assignmentX = myX;

                  break;
                case 'linebacker':

					  
                  break;
              }


              // Get the X coord for the rule
              // the Y is defined in the blocking call and so its set directly.  *phew*
              assignmentY = rule.depth;

              console.log("assignmentX: ", assignmentX);
              console.log("assignmentY: ", assignmentY);


              // Check those coords for a position
              // Build the coord selector
              // js-defense-15 depth--defensive_los
              $targetToCheck = $(`.js-defense-${assignmentX}.depth--${assignmentY}`);

              console.log("$targetToCheck: ", $targetToCheck);
              if ($targetToCheck.children(".position-node").length > Number(0)) {
                console.log("Umm...I think we have a target!!");
                foundAssignment = true;

                $thisPosition.parent().children(".position-node").addClass(`blocking-identifier-${blockingAssignmentClassNumber}`);
                $targetToCheck.children(".position-node").addClass(`blocking-identifier-${blockingAssignmentClassNumber}`);
                blockingAssignmentClassNumber++;
              } else {
                console.log("We found nobody to block here.");
              }

              // If there is a position at the target coords, assign the blocking classes to the blocker and the target
              // Also, set the foundAssignement to true so we stop processing.

            }
          });
          /*
          let sanityCounter = Number(0);
                    let sanityLimit = Number(10);
                    while (foundAssignment === false && sanityCounter <= sanityLimit) {
                      sanityCounter++;
                      console.log("checking for sanity (post): ", sanityCounter);

                    }
          		  */


        });
      });
    }

  });
})(window, jQuery);
