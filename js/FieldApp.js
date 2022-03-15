// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * I'm adding this comment to a branch.
   */

  /**
   * This is like a "Class".
   * Use it like a __constructor() method.
   * Add Event Handlers.
   */
  window.FieldApp = function ($wrapper) {
    //    console.log("$wrapper", $wrapper);
    this.$wrapper = $wrapper;


    // Event Handler for clicking on the ball
    this.$wrapper.on(
      'click',
      '#ball',
      this.handleBallClick.bind(this)
    );

    // Event Handler for Picking an Offensive Formation
    this.$wrapper.on(
      'change',
      '#picker_offense_formation',
      this.handlePickOffenseFormation.bind(this)
    );

    // Event Handler for Picking a Defensive Formation
    this.$wrapper.on(
      'change',
      '#picker_defense_formation',
      this.handlePickDefenseFormation.bind(this)
    );

    // Event Handler for Showing / Hiding Defensive Position Text
    this.$wrapper.on(
      'change',
      '#hide_text',
      this.handleHideTextCheckbox.bind(this)
    );

    // Event Handler for Clearing the whole field.
    this.$wrapper.on(
      'click',
      '#clear_field',
      this.handleClearFieldButton.bind(this)
    );

    // Event Handler for Populating the offense
    this.$wrapper.on(
      'click',
      '#build_offense',
      this.handleBuildOffense.bind(this)
    );


  }; // end window.FieldApp


  $.extend(window.FieldApp.prototype, {

    /////////////////////  
    // Ball is clicked //
    /////////////////////
    handleBallClick: function (e) {
      //      let $ball = $(e.currentTarget);
      //      console.log("$ball", $ball);
      //      console.log("this", this);

    },
    //////////////////////////////////////////  
    // Offenseive Formation has been picked //
    //////////////////////////////////////////  
    handlePickOffenseFormation: function (e) {
      let $fieldElm = $("#offense");
      let myFieldHelper = new FieldHelper($fieldElm);

      // Clear the offense and rebuild it
      myFieldHelper.clearFieldSection($fieldElm);
      myFieldHelper.populateFieldWithEmptyGridItems($fieldElm);
      // Clear the defense and rebuild it
      myFieldHelper.clearFieldSection($("#defense"));
      myFieldHelper.populateFieldWithEmptyGridItems($("#defense"));


      $("#pick_offense_first").hide();

      // If an Offensive Formation was just selected, build and display the Offenseive Players.
      let $formationId = $(e.currentTarget).val();
      //  console.log("$formationId", $formationId);

      if ($formationId == '--default--') {
        console.log("clear stuff, yo");

      } else {
        //        let $offenseElm = $(".offense-position");

        fetch("data/offense/" + $formationId + ".json")
          .then(Response => Response.json())
          .then(formation => {


            // Loop over the positions and populate them on the grid
            formation.positions.forEach((position) => {

              // Instantiate a new Position
              // Positions place themselves
              let positionObj = new Position($fieldElm, position);


            });


            // We set gaps here to make sure that all the Offensive positions have been set.
            //setGaps();
          });
      }


    },
    /////////////////////////////////////////  
    // Defensive Formation has been picked //
    /////////////////////////////////////////  
    handlePickDefenseFormation: function (e) {
      //      console.log("handlePickDefenseFormation()");
      let $fieldElm = $('#defense');
      // Clear the Defensive side of the Field.
      let myFieldHelper = new FieldHelper();
      myFieldHelper.clearFieldSection($fieldElm);
      myFieldHelper.populateFieldWithEmptyGridItems($fieldElm);


      // Make sure that offense has been placed...many defensive positions are relative to offensive positions.
      if ($("#offense .position-node.position-offense").length == 11) {
        //        console.log("Yes, there are 11 offensive players on the field. Proceed to set the Defensive Positions");
        $("#pick_offense_first").hide();

        // Get rid of any existing defensive positions
        $(".position-defense").remove();
        //        $(".position-defense").fadeOut('slow', function () {
        //          this.remove();
        //        });


      } else {
        console.log("Nope, there aren't 11 offenseive players on the field.");
        $("#pick_offense_first").show();
        let $self = $(e.currentTarget);
        $self.val('--default--');
        //        console.log($self);
      }


      let $formationId = $(e.currentTarget).val();

      //      console.log("Formation to work with: ", $formationId);

      if ($formationId == '--default--') {
        //        console.log("Clear stuff, yo!");
        let myPositionHelper = new FieldHelper;
        myPositionHelper.clearFieldSection($fieldElm);
        myFieldHelper.populateFieldWithEmptyGridItems($fieldElm);
      } else {
        fetch("data/defense/" + $formationId + ".json")
          .then(Response => Response.json())
          .then(formation => {


            // Loop over the positions and populate them on the grid
            formation.positions.forEach((position) => {

              //console.log("position in forEach(): ", position);
              //let gridItemSelected = $('#offense .grid-item-position');
              // Instantiate a new Position
              // Positions place themselves, right?
              let positionObj = new Position($($fieldElm), position);
            });
          });
      }


      console.log("End of the switching defense, right?");


    },
    ////////////////////////////////////
    // Way-Too-Manual Form Validation //
    ////////////////////////////////////
    handleHideTextCheckbox: function (e) {
      //      console.log("checkbox", e.currentTarget.checked);
      if (e.currentTarget.checked === true) {
        $("#defense").addClass('hide-position-text');
      } else {
        $("#defense").removeClass('hide-position-text');
      }

    },
    /////////////////////////////  
    // Build the initial field //
    /////////////////////////////
    buildField: function ($wrapper) {
      let myFieldHelper = new FieldHelper($wrapper);
      myFieldHelper.populateFieldWithEmptyGridItems();
      myFieldHelper.assignGaps();
    },

    handleClearFieldButton: function ($wrapper) {
      console.log("called handleClearFieldButton()", $wrapper);
      $('#defense > div, #los > div, #offense > div, bocking-rule-description-wrapper').remove();
      let myHelper = new FieldHelper($wrapper);
      this.buildField();
    },
    handleBuildOffense: function () {
      console.log("handleBuildOffense() called");

    }


  });


  //////////////////////////
  // Helper functionality //
  //////////////////////////	
  var FieldHelper = function ($wrapper) {
    //    console.log("called FieldHelper with: ", $wrapper);
    this.$wrapper = $wrapper;
  }

  ///////////////////////////////////////////////////
  // Extend (add methods) to the FieldHelper class //
  ///////////////////////////////////////////////////
  $.extend(FieldHelper.prototype, {

    clearFieldSection: function ($fieldElm) {
      /**
       * clearFieldSection() removes positions and postion-related elements from the Field.
       *
       * @param $fieldElm jQuery element of either #offense or #defense
       */
      let positions = $fieldElm.find("*");
      positions.remove();

      //The below code makes a fancy fade-out, but causes a bug where selecting another offensive formation will, often, be incorrectly laid out. I believe this is an asynchronous issue.  If I understood promises better I could probably fix this for real.
      // console.log("positions to remove: ", positions);
      //      positions.fadeOut('slow', function () {
      //        this.remove();
      //      });

    },

    /**
     * Populate the field with Field Grid Items
     * @param $wrapper jQuery object. A section of the Field (#offense, #defense, #los)
     */

    populateFieldWithEmptyGridItems: function ($wrapper = null) {
      // If no $wrapper is passed, populate the whole field.
      // Otherwise, jsut populate the given $wrapper
      if ($wrapper === null) {
        this.fieldSections = [
          $('#defense'),
          $('#los'),
          $('#offense')
        ];
      } else {
        this.fieldSections = [
          $wrapper
        ]
      }

      // Loop over the Field Sections
      this.fieldSections.forEach((fieldSection) => {
        let thisFieldSection = fieldSection.attr("id");

        //      console.log("thisFieldSection: ", thisFieldSection);
        // Set the proper Field Section
        if (thisFieldSection === "defense") {
          this.fieldRowNames = this.getDefensiveDepths();
        } else if (thisFieldSection === "offense") {
          this.fieldRowNames = this.getOffensiveDepths();

        } else if (thisFieldSection === "los") {
          this.fieldRowNames = [
            'los'
          ];
        } else {
          this.fieldRowNames = [];
        }

        // Loop over the Row Names 
        this.fieldRowNames.forEach((fieldRowName) => {
          //        console.log(fieldRowName);
          this.fieldColumnCurrent = 1;
          this.fieldColumnMax = 21;

          // this is where we finally build out the grid item placeholder divs
          while (this.fieldColumnCurrent <= this.fieldColumnMax) {
            // console.log(this.fieldColumnCurrent, fieldSection, fieldRowName);


            let fieldGridItem = document.createElement("div");
            fieldGridItem.style.gridColumnStart = this.fieldColumnCurrent;
            fieldGridItem.style.gridRowStart = fieldRowName;
            //          fieldGridItem.classList.add('js-empty-grid-item');

            // Adding the grid coords to individual data-* atrtibutes.
            // Not sure we need this anymore, but not getting rid of it yet.
            fieldGridItem.dataset.gridPositionSection = thisFieldSection;
            fieldGridItem.dataset.gridPositionX = this.fieldColumnCurrent;
            fieldGridItem.dataset.gridPositionY = fieldRowName;

            // Adding the grid coords to a single data-* attribute...easy to select.  See @file Position.js 
            // Should be like offense-14-offensive_los
            fieldGridItem.dataset.gridCoords = thisFieldSection + '-' + this.fieldColumnCurrent + '-' + fieldRowName;
            fieldGridItem.classList.add('js-' + thisFieldSection + '-' + this.fieldColumnCurrent);

            // Add the depth class for zebra striping
            fieldGridItem.classList.add('depth--' + fieldRowName);

            // Is the grid item a gap/hole or a position container?
            if (this.fieldColumnCurrent % 2 == 0) {
              fieldGridItem.classList.add('grid-item-gap');
              //            let $fieldGridItemContent = $("<div></div>").html('&nbsp;').addClass('bobo-jones-' + thisFieldSection)
              //            $(fieldGridItem).html($fieldGridItemContent);
            } else {
              fieldGridItem.classList.add('grid-item-position');
            }

            // Always add 'grid-item' class
            fieldGridItem.classList.add('grid-item');

            fieldSection.append(fieldGridItem);


            this.fieldColumnCurrent++;
          }
        });

      });


    },

    /**
     * assignGaps() declares and builds all the Gaps/Holes along the LOS.
     * Someday it'd be cool to have this more programatic, but for now, build and leverage this giant data object.
     */
    assignGaps: function () {

      // Refresh <div id="ball-origin">.</div>
      $('#los #ball-origin').remove();
      let $ballOrigin = $('<div></div>').attr('id', 'ball-origin').html('.');
      $('#los').append($ballOrigin);
      // console.log("assignGaps() called");
      // Build out the Gap Data
      let gapData = {
        ball: {
          distance: 0,
          id: 'ball',
          label: 'Ball'
        },
        a1: {
          distance: -1,
          id: 'A1',
          label: 'A 1'
        },
        a2: {
          distance: 1,
          id: 'A2',
          label: 'A 2'
        },
        b3: {
          distance: -3,
          id: 'B3',
          label: 'B 3'
        },
        b4: {
          distance: 3,
          id: 'B4',
          label: 'B 4'
        },
        c5: {
          distance: -5,
          id: 'C5',
          label: 'C 5'
        },
        c6: {
          distance: 5,
          id: 'C6',
          label: 'C 6'
        },
        d7: {
          distance: -7,
          id: 'D7',
          label: 'D 7'
        },
        d8: {
          distance: 7,
          id: 'D8',
          label: 'D 8'
        },
        d9: {
          distance: -9,
          id: 'D9',
          label: 'D 9'
        }
      };

      // Find the Ball and build out from there.
      let $ball = $("#ball-origin");
      let ballX = $ball.css("grid-column-start");
      //      console.log("$ball: ", $ball, "ballX: ", ballX, "gapData: ", gapData);

      // Loop over the gapData and populate the grid items with gap data
      for (const gap in gapData) {
        //console.log("gap: ", gap);
        //        console.log(`${gap}: ${gapData[gap].label}`);
        //        console.log("label: ", gapData[gap].label);
        //        console.log("id: ", gapData[gap].id);
        let gapContent = $("<div></div>")
          .html(gapData[gap].label)
          .attr('id', gapData[gap].id)
          .addClass(['grid-gap-item']);
        let targetX = Number(ballX) + Number(gapData[gap].distance);
        // Build the selector for the Grid item into which we're going to add our HTML
        let targetCellSelector = '.js-los-' + targetX;
        $(targetCellSelector).append(gapContent);

        //        console.log("gapContent", gapContent);
        //        console.log("targetCellSelector: ", targetCellSelector);
      }

    },
    getDefensiveDepths: function () {
      return [
        'deep',
        'safety',
        'linebacker',
        'defensive_los'
      ];
    },
    getOffensiveDepths: function () {
      return [
        'offensive_los',
        'off',
        'shotgun',
        'deep'
      ];
    }


  });


})(window, jQuery);
