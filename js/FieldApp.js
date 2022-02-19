// JavaScript Document
'use strict';
(function (window, $) {

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

    // Event Handler for Picking a Formation
    this.$wrapper.on(
      'change',
      '#picker_offense_formation',
      this.handlePickOffenseFormation.bind(this)

    );

  };

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

      // Get rid of the offensive positions
      $(".offensive-position").fadeOut('slow').remove();

      // If an Offensive Formation was just selected, build and display the Offenseive Players.
      let $formationId = $(e.currentTarget).val();
      //  console.log("$formationId", $formationId);

      if ($formationId != '--default--') {


        let $offenseElm = $(".offensive-position");

        fetch("data/offense/" + $formationId + ".json")
          .then(Response => Response.json())
          .then(formation => {


            // Loop over the positions and create them on the grid
            formation.positions.forEach((position) => {
              const positionNode = document.createElement("div");
              positionNode.innerText = position.positionName + ' ' + position.id;
              positionNode.style.gridColumnStart = position.positionX;
              positionNode.style.gridRowStart = position.positionY;
              positionNode.id = position.positionName;
              positionNode.classList.add("offensive-position");
              positionNode.classList.add("position-node");
              // Add the Position Type class(es)
              if (position.positionType) {
                // console.log("positionType: ", position.positionType);
                position.positionType.forEach((positionType) => {
                  // console.log(positionType);
                  positionNode.classList.add(positionType);
                });
              }

              // Add the "coordinates" here.  Like the X's # and the Y's depth.
              let coords = 'coords-' + positionNode.style.gridColumnStart + '-' + position.positionY;
              positionNode.classList.add(coords);
              // console.log("coords: ", coords);

              offense.appendChild(positionNode);
            });


            // We set gaps here to make sure that all the Offensive positions have been set.
            //setGaps();
          });


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
