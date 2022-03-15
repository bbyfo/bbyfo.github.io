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

    // Handle Clicking a Missed Block Identifier
    this.$wrapper.on(
      'click',
      '.block-miss-wrapper',
      this.handleClickMissedBlockIdentifier.bind(this)
    );

    this.$wrapper.on(
      'click',
      '.blocking-rule-close',
      this.handleClickCloseBlockingRuleDesc.bind(this)
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
      console.log("handleShowBlockingAll()", e);

      // Remove all blocking things now
      $('.block-miss-wrapper, .offensive-blocking-identifier').remove();

      // Make sure the field is set up properly and a Blocking Call is selected
      if (this.validateFieldForBlocking()) {
        //        console.log("Field is Valid for Blocking: ", e);
        var blockingAssignment = $('#picker_blocking_call').val();
        //        console.log("blockingAssignment: ", blockingAssignment);
        // Load the Blocking Call file

        fetch("data/offense/" + blockingAssignment + ".json")
          .then(Response => Response.json())
          .then(blockingCall => {

            // console.log("blockingCall: ", blockingCall);

            this.processBlockingAssignments(blockingCall);

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
    processBlockingAssignments: function (blockingCall) {
      console.log("processBlockingAssignments() called with: ", blockingCall);

      //      console.log("blockingAssignment.appliesTo: ", blockingAssignment.appliesTo);


      blockingCall.blockingAssignments.forEach((blockingAssignment) => {

        blockingAssignment.appliesTo.forEach((positionClass) => {
          //        console.log("positionClass: ", positionClass);

          let $positionsByClass = $(positionClass);
          //        console.log("$positionsByClass: ", $positionsByClass);

          $positionsByClass.each((i, position) => {
            //          console.log("position: ", position);
            let $thisPosition = $(position);
            let blockingAssignmentOffensivePosition = 'blocking-identifier--' + $thisPosition.attr('id');
            let positionHelper = new PositionHelper();
            let rules = blockingAssignment.rules;


            // Find my X
            let myX = Number($thisPosition.parent().css("grid-column-start"));
            // Find my Inside
            let myInside = positionHelper.whereIsMyInside(myX);

            //          console.log("myX: ", myX);
            //          console.log("myInside: ", myInside);
            console.log(" ");
            console.log("##################");
            console.log("POSITION: ", $thisPosition.attr('id'), "myX:", myX, "myInside:", myInside);
            //          console.log(rules);
            // Loop through rules and stop at the first 'yes'
            // @todo The big 'ol switch statement has to manually match all possible values in the blocking_call__XXXXX.json files.
            // Not optimal, but it's what we've got for now.
            // sanityCounter keeps us from eternally looping and crashing stuff if we miss something.
            let foundAssignment = false;

            let blockingRuleNoCount = Number(1);


            rules.forEach((rule) => {
              let assignmentX = [];
              let assignmentY = null;
              let $targetToCheck = null;
              let targets = [];
              let blockingRuleDescription = rule.description;
              if (foundAssignment === false) {
                //                console.log(`Processing rule: ${rule.name}`);

                // Get the X coord for the rule
                switch (rule.name) {
                  case 'gap_inside':
                    if (myInside == "higher") {
                      assignmentX[0] = Number(myX) + Number(1);
                    } else if (myInside == "lower") {
                      assignmentX[0] = Number(myX) - Number(1);


                    } else if (myInside == "onball") {
                      // Use the playSide of the Blocking call to determine the inside gap  
                      //                    console.log("blockingCall: ", blockingCall);
                      if (blockingCall.playSide == "right") {
                        assignmentX[0] = myX + Number(1);
                      } else if (blockingCall.playSide == "left") {
                        assignmentX[0] = Number(myX) - Number(1);
                      } else {
                        assignmentX[0] = Number(myX);
                        console.log(`We don't have a playside defined in ${blockingCall.blockingCallName}.`);
                      }

                    } else {

                    }

                    break;

                  case 'on_me':
                    assignmentX[0] = myX;

                    break;
                  case 'gap_outside':
                    if (myInside == "higher") {
                      assignmentX[0] = Number(myX) - Number(1);
                    } else if (myInside == "lower") {
                      assignmentX[0] = Number(myX) + Number(1);

                    } else if (myInside == "onball") {
                      // Use the playSide of the Blocking call to determine the inside gap  
                      //                    console.log("blockingCall: ", blockingCall);
                      if (blockingCall.playSide == "right") {
                        assignmentX[0] = myX + Number(1);
                      } else if (blockingCall.playSide == "left") {
                        assignmentX[0] = myX - Number(1);
                      } else {
                        console.log(`We don't have a playside defined in ${blockingCall.blockingCallName}.`);
                      }

                    } else {

                    }

                    break;
                  case 'linebacker':

                    if (blockingCall.playSide == "right") {
                      assignmentX[0] = Number(myX) - Number(1); // Easy LB
                      assignmentX[1] = Number(myX); // On Me LB
                      assignmentX[2] = Number(myX) + Number(1); // Playside LBs
                      //                      assignmentX[3] = Number(myX) + Number(2);
                      //                      assignmentX[4] = Number(myX) + Number(3);
                      //                      assignmentX[5] = Number(myX) + Number(4);
                      //                      assignmentX[6] = Number(myX) + Number(5);

                    } else if (blockingCall.playSide == "left") {
                      assignmentX[0] = Number(myX) + Number(1); // Easy LB
                      assignmentX[1] = Number(myX); // On Me LB
                      assignmentX[2] = Number(myX) - Number(1); // Playside LBs
                      //                      assignmentX[3] = Number(myX) - Number(2);
                      //                      assignmentX[4] = Number(myX) - Number(3);
                      //                      assignmentX[5] = Number(myX) - Number(4);
                      //                      assignmentX[6] = Number(myX) - Number(5);

                    } else if (blockingCall.playSide == "middle") {

                    }

                    //                    assignmentX[0] = Number(myX) - Number(2);
                    //                    assignmentX[1] = Number(myX) - Number(1);
                    //                    assignmentX[2] = Number(myX);
                    //                    assignmentX[3] = Number(myX) + Number(1);
                    break;

                  case 'middle':
                    targets = [];
                    if (myInside == "higher") {
                      targets = [Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7), Number(8), Number(9), Number(10)];
                    } else if (myInside == "lower") {
                      targets = [Number(-1), Number(-2), Number(-3), Number(-4), Number(-5), Number(-6), Number(-7), Number(-8), Number(-9), Number(-10)];
                    }
                    targets.forEach((target) => {
                      // console.log(target);
                      assignmentX.push(Number(myX) + Number(target));
                    });

                    break;

                  default:
                    console.log("Nobody to block yet, defaulting to Down (playside)", blockingCall.playSide);


                    // The following commented-out code is useful to find the "nearest" position to block.
                    // It basically starts in the "head up" position, and then looks one space adjacent, then looks at the opposite space, and so on, preferring inside spaces
                    //                    if (myInside == "higher") {
                    //                      targets = [Number(0), Number(-1), Number(1), Number(-2), Number(2), Number(-3), Number(3), Number(-4), Number(4), Number(-5), Number(5)];
                    //                    } else if (myInside == "lower") {
                    //                      targets = [Number(0), Number(1), Number(-1), Number(2), Number(-2), Number(3), Number(-3), Number(4), Number(-4), Number(5), Number(-5)];
                    //                    } else if (myInside == "onball") {
                    //                      if (blockingCall.playSide == "right") {
                    //                        targets = [Number(0), Number(1), Number(-1), Number(2), Number(-2), Number(3), Number(-3), Number(4), Number(-4), Number(5), Number(-5)];
                    //                      } else if (blockingCall.playSide == "left") {
                    //                        targets = [Number(0), Number(-1), Number(1), Number(-2), Number(2), Number(-3), Number(3), Number(-4), Number(4), Number(-5), Number(5)];
                    //
                    //                      } else {
                    //                        console.log("Wow, nobody?  Bueller?  Bueller?");
                    //                      }
                    //                    }

                    targets = [];
                    // This code should find the closest position to block going to the playside.
                    if (blockingCall.playSide == "right") {
                      targets = [Number(1), Number(2), Number(3), Number(4), Number(5), Number(6), Number(7), Number(8), Number(9), Number(10)];
                    } else if (blockingCall.playSide == "left") {
                      targets = [Number(-1), Number(-2), Number(-3), Number(-4), Number(-5), Number(-6), Number(-7), Number(-8), Number(-9), Number(-10)];

                    } else {
                      console.log("Wow, nobody?  Bueller?  Bueller?");
                    }

                    targets.forEach((target) => {
//                      console.log(target);
                      assignmentX.push(Number(myX) + Number(target));
                    });
                    break;
                } // End Blocking Rules switch


                // Get the X coord for the rule
                // the Y is defined in the blocking call and so its set directly.  *phew*
                assignmentY = rule.depth;

                //              console.log("assignmentX: ", assignmentX);
                //              console.log("assignmentY: ", assignmentY);


                // Check those coords for a position
                // Build the coord selector
                // js-defense-15 depth--defensive_los

                // Build out the target list
                let targetList = [];
                assignmentX.forEach((x) => {
                  targetList.push($(`.js-defense-${x}.depth--${assignmentY}`));
                });

                //                console.log("targetList: ", targetList);

                // If there is a position at the target coords, assign the blocking classes to the blocker and the target
                // Also, set the foundAssignement to true so we stop processing.
                targetList.every(($target) => {

                  console.log("Processing ", rule.name);

                  if ($target.children(".position-node").length > Number(0)) {
                    console.log("We have a target!!");
                    foundAssignment = true;

                    let $targetPosition = $target.children(".position-node");
                    let $targetPositionParent = $targetPosition.parent();

                    // Mark this position with a blocking identifier
                    //                    let blockingAssignmentOffensivePosition = 'blocking-identifier--' + $thisPosition.attr('id');

                    $thisPosition.addClass(blockingAssignmentOffensivePosition);

//                    console.log("$thisPosition: ", $thisPosition[0]);
//                    console.log("$targetPosition: ", $targetPosition[0]);
//                    console.log("$targetPosition parent: ", $targetPositionParent[0]);
                    //                    console.log("rule.description", rule.description);

                    let blockingRuleDescription = rule.description + " <strong>Yes!</strong>  Block him!";
                    let $blockingIdElm = $("<div></div>")
                      .html("verified")
                      .attr('data-blocking-rule-desc', blockingRuleDescription)
                      .addClass([blockingAssignmentOffensivePosition, 'position-node', 'offensive-blocking-identifier', 'material-icons']);

//                    console.log("$blockingIdElm: ", $blockingIdElm[0]);
                    $targetPosition.parent().prepend($blockingIdElm);

                    // Check for a Double Team
                    if ($targetPosition.hasClass("js-is-blocked")) {
                      // We've got a double team.  We need to show that.
                      // Instead of adding another blocking identifier class to the target position, can we clone the target position and add the blocking identifier
                      // to that newly cloned element.
//                      console.log(`Doubleteam found!`);
                      $targetPosition.addClass(["js-is-double-teamed"]);
                      $targetPosition.parent().addClass(["has-double-team"]);

                    }


                    return false;
                  } else {

                    ////////////////////////////////////////////////
                    // Didn't find anyone to block in this space. //
                    ////////////////////////////////////////////////

//                    console.log("$target", $target[0]);
                    //                    console.log("$thisPosition", $thisPosition[0]);

                    console.log($thisPosition.attr('id'), `found nobody to block for rule ${rule.name} Miss #${blockingRuleNoCount}`);

                    blockingRuleDescription += " <strong>No.</strong> Go to next rule.";

                    // Create the element to contain the Blocking Count Number and the 
                    let $blockMissWrapper = $('<div></div>').addClass(['block-miss-wrapper', blockingAssignmentOffensivePosition])
                    $blockMissWrapper.attr('data-blocking-rule-desc', blockingRuleDescription);
                    let blockingMissCssIdentifier = 'blocking-identifier--' + $thisPosition.attr('id');
                    $blockMissWrapper.attr('data-blocking-identifier-class', blockingMissCssIdentifier);
                    $target.prepend($blockMissWrapper);


                    // Set up the "nobody to block" icon
                    let aTryandAMissIcon = "do_disturb";
                    let $aTryAndAMissIconElm = $('<span></span>').html(aTryandAMissIcon);
                    $aTryAndAMissIconElm.addClass(['material-icons', 'blocking-rule-icon']);


                    $blockMissWrapper.prepend($aTryAndAMissIconElm);


                    // Add a "close" X

                    let $closeRuleDesc = $('<span>highlight_off</span>').addClass(['material-icons', 'blocking-rule-close']);
                    $blockMissWrapper.append($closeRuleDesc);

                    // Set up the number of "no's" we've gotten.  This is the order in which we examined the field.

                    let $blockingRuleNoCountElm = $('<span></span>').addClass(['blocking-rule-no-count']).html(blockingRuleNoCount);


                    $blockMissWrapper.prepend($blockingRuleNoCountElm);


                    blockingRuleNoCount++;
                    console.log("-----");
                    return true;
                  }

                });


              }
            });


          });
        });
      }); // end processBlockingAssignments
    },
    handleClickMissedBlockIdentifier: function (e) {
      e.stopPropagation();
      $('.block-miss-wrapper').removeClass('visible');
      console.log("handleClick Missed Block Identifier() called", e);
      let $target = $(e.currentTarget);
      console.log("$target;: ", $target);
      $target.addClass('visible');

      let exceptSelector = $target.attr('data-blocking-identifier-class');

      // Set up the Blocking Rule Description
      let $blockingRuleDescriptionWrapperElm = $('#bocking-rule-description-wrapper');
      $blockingRuleDescriptionWrapperElm.removeClass();
      //					  $blockingRuleDescription.addClass(['blocking-rule-description']);

      let $blockingRuleDescriptionElm = $('<span></span>').html($target.attr('data-blocking-rule-desc'));
      $blockingRuleDescriptionWrapperElm.append($blockingRuleDescriptionElm);
      let blockingIdentifierCssSelector = $blockingRuleDescriptionWrapperElm.addClass([exceptSelector]);


      // Dim out other stuff

      exceptSelector = "." + exceptSelector;
      let $exceptElms = $(exceptSelector);
      console.log("exceptSelector: ", exceptSelector);
      console.log("$exceptElms: ", $exceptElms);
      this.dimExcept($exceptElms);

    },
    handleClickCloseBlockingRuleDesc: function (e) {
      e.stopPropagation();
      e.preventDefault;
      console.log("handleClickCloseBlockingRuleDesc() called", e);
      $('.block-miss-wrapper').removeClass('visible');
      this.unDimm();
    },
    dimExcept: function ($except) {
      console.log("dimExcept() called", $except);
      $('#offense div, #defense div').not($except).addClass(['i-been-dimmed']);

    },
    unDimm: function () {
      $('#offense div, #defense div').removeClass(['i-been-dimmed']);
    }


  });
})(window, jQuery);
