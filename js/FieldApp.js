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


    ////////////////////////////////////////////  
    // Write out the initial Field Grid Items //
    ////////////////////////////////////////////


    this.fieldSections = [
      $('#defense'),
      $('#los'),
      $('#offense')
    ];

    // Loop over the Field Sections
    this.fieldSections.forEach((fieldSection) => {
      let thisFieldSection = fieldSection.attr("id");

      //      console.log("thisFieldSection: ", thisFieldSection);
      // Set the proper Field Section
      if (thisFieldSection === "defense") {
        this.fieldRowNames = [
          'safety',
          'linebacker',
          'defensive_los'
        ];
      } else if (thisFieldSection === "offense") {
        this.fieldRowNames = [
          'offensive_los',
          'off',
          'shotgun',
          'deep'
        ];

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
        this.fieldColumnMax = 25;

        // this is where we finally build out the grid item placeholder divs
        while (this.fieldColumnCurrent <= this.fieldColumnMax) {
          // console.log(this.fieldColumnCurrent, fieldSection, fieldRowName);


          let fieldGridItem = document.createElement("div");
          fieldGridItem.style.gridColumnStart = this.fieldColumnCurrent;
          fieldGridItem.style.gridRowStart = fieldRowName;
          fieldGridItem.classList.add('js-empty-grid-item');

          // Adding the grid coords to individual data-* atrtibutes.
          // Not sure we need this anymore, but not getting rid of it yet.
          fieldGridItem.dataset.gridPositionSection = thisFieldSection;
          fieldGridItem.dataset.gridPositionX = this.fieldColumnCurrent;
          fieldGridItem.dataset.gridPositionY = fieldRowName;

          // Adding the grid coords to a single data-* attribute...easy to select.  See @file Position.js 
          // Should be like offense-14-offensive_los
          fieldGridItem.dataset.gridCoords = thisFieldSection + '-' + this.fieldColumnCurrent + '-' + fieldRowName;

          // Is the grid item a gap/hole or a position container?
          if (this.fieldColumnCurrent % 2 == 0) {
            fieldGridItem.classList.add('grid-item-gap');
            $(fieldGridItem).html("<div>&nbsp;</div>");
          } else {
            fieldGridItem.classList.add('grid-item-position');
          }

          fieldSection.append(fieldGridItem);


          this.fieldColumnCurrent++;
        }
      });

    });


  }; // end window.FieldApp


  $.extend(window.FieldApp.prototype, {

    /////////////////////  
    // Ball is clicked //
    /////////////////////
    handleBallClick: function (e) {
      let $ball = $(e.currentTarget);
      console.log("$ball", $ball);
      console.log("this", this);

    },

    //////////////////////////////////////////  
    // Offenseive Formation has been picked //
    //////////////////////////////////////////  
    handlePickOffenseFormation: function (e) {

      //this.clearField = new ClearField;
      //this.clearField.clearField($("#offense"));

      // Get rid of any existing offensive positions
      $(".position-offense").fadeOut('slow', function () {
        this.remove();
      });
      $("#pick_offense_first").hide();

      // If an Offensive Formation was just selected, build and display the Offenseive Players.
      let $formationId = $(e.currentTarget).val();
      //  console.log("$formationId", $formationId);

      if ($formationId != '--default--') {
        let $offenseElm = $(".offense-position");

        fetch("data/offense/" + $formationId + ".json")
          .then(Response => Response.json())
          .then(formation => {


            // Loop over the positions and populate them on the grid
            formation.positions.forEach((position) => {

              // console.log("position in forEach(): ", position);
              let gridItemSelected = $('#offense .grid-item-position');

              // Positions place themselves, right?
              let positionObj = new Position($('#offense'), position);


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
      console.log("handlePickDefenseFormation()");
      // Make sure that offense has beenn placed...many defensive positions are relative to offensive positions.
      if ($("#offense .position-node.position-offense").length == 11) {
        console.log("Yes, there are 11 offensive players on the field. Proceed to set the Defensive Positions");
        $("#pick_offense_first").hide();

        // Get rid of any existing offensive positions
        $(".position-defense").fadeOut('slow', function () {
          this.remove();
        });
      } else {
        console.log("Nope, there aren't 11 offenseive players on the field.");
        $("#pick_offense_first").show();
        let $self = $(e.currentTarget);
        $self.val('--default--');
        console.log($self);
      }


    }


  });

  /**
   * Clear the field of stuff (and things, Lori)
   *
   */
  var ClearField = function ($wrapper) {
    this.$wrapper = $wrapper;
  }

  $.extend(ClearField.prototype, {
    clearField: function (fieldElm) {
      console.log("Clear Field?");
      console.log("wut", fieldElm);
    }
  });


})(window, jQuery);
