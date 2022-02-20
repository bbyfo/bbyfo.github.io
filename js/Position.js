// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   * @param $fieldSection Which section of the Field on which this position belongs.
   * @param position The JSON data for this position.
   */
  window.Position = function ($fieldSection, position) {
    this.position = position;
    //    console.log("Position instantiated as: ", $fieldSection, this.position);
    let positionName = position.positionName;
    // Proof of concept: Place the ID text in the proper cell

    // Get the coordinates
    let gridPositionSection = $fieldSection.attr('id');


    let gridPositionX = "";
    let gridPositionY = "";
    switch (gridPositionSection) {
      case 'offense':
        gridPositionX = position.positionX;
        gridPositionY = position.positionY;
        break;
      case 'defense':
        //        console.log("----------------------");
        //        console.log("NOW we get the " + position.positionName + " Postion's position.");

        let myGridPositionX = "*dummy*";
        let myGridPositionY = "*yummy*";

        // Get the coordinate information of the Anchor
        let myAnchors = position.anchors;
        //        console.log("myAnchors: ", myAnchors);

        let myAnchorElm = null;
        let myAnchorELmFound = false;
        myAnchors.forEach((myAnchor) => {
          //          console.log("myAnchor: ", myAnchor);
          let myTestAnchorElm = document.getElementById(myAnchor);
          //          console.log("myTestAnchorElm: ", myTestAnchorElm, myAnchorELmFound);
          if (myTestAnchorElm && myAnchorELmFound == false) {
            //            console.log("I found my anchor!");
            myAnchorElm = myTestAnchorElm;
            myAnchorELmFound = true;
            return;
          }

        });


        //        console.log("myAnchorElm after the forEach: ", myAnchorElm);
        let $myAnchorElm = $(myAnchorElm);
        //        console.log("$myAnchorElm: ", $myAnchorElm);
        let $myAnchorElmParent = $myAnchorElm.parent();
        //        console.log("$myAnchorElmParent: ", $myAnchorElmParent);


        let myAnchorsX = $myAnchorElmParent.css('grid-column-start');
        //        console.log("myAnchorsX: ", myAnchorsX);

        myGridPositionX = myAnchorsX;
        // Get the the alignment (shading) for the position


        // Where is my inside?
        let myPositionHelper = new PositionHelper();
        let myInside = myPositionHelper.whereIsMyInside(myAnchorsX);
        let myAlignment = position.alignment.direction;

        // Math the alignment and the anchor and get the positions' cordinates
        let myModdedAlignmentX = myPositionHelper.modMyAlignment(myGridPositionX, myInside, myAlignment, position);
        //        console.log("myModdedAlignment (after modding)", myModdedAlignmentX);
        //        console.log(positionName, position.alignment.distance, myAlignment, $myAnchorElm.attr('id'));
        //        console.log("myAlignment", myAlignment);
        //        console.log("myInside: ", myInside);

        //        console.log("$myAnchorElm: ", $myAnchorElm.attr('id'));

        // After all the mods, we finally set the "my" version of the X coord to the final, usabl X coord.
        gridPositionX = myModdedAlignmentX;
        //        console.log("gridPositionX (final, to be used): ", gridPositionX);
        // Thankfully, the Y coord is just pulled from the position definition
        myGridPositionY = position.depth;
        gridPositionY = myGridPositionY;

        break;

    }

    // Here we assign the coordinates
    let gridPositionSelector = gridPositionSection + '-' + gridPositionX + '-' + gridPositionY;

    //    console.log("Grid Positions in Position: ", gridPositionSection, gridPositionX, gridPositionY, gridPositionSelector, position.positionTypes);

    // Create the position element
    var positionDiv = $("<div></div>").text(positionName);
    positionDiv.addClass('position-node');
    positionDiv.attr('id', position.positionName)
    // Add the position section (offense or defense)
    positionDiv.addClass(['position-' + gridPositionSection]);

    // Add the position type(s) class(es).
    //    console.log(position.positionTypes);
    if (position.positionTypes) {
      positionDiv.addClass(position.positionTypes);
    }

    //    console.log("gridPositionSelector: ", gridPositionSelector);
    // Here's how we select a specifc grid item!
    // @see https://www.geeksforgeeks.org/jquery-attributevalue-selector-4/
    $("[data-grid-coords|='" + gridPositionSelector + "']")
      .html(positionDiv);


  }


  var PositionHelper = function ($wrapper) {
    //    console.log("PositionHelper created with $wrapper: ", $wrapper);
    this.$wrapper = $wrapper;
  }

  $.extend(PositionHelper.prototype, {
    clearField: function (fieldElm) {
      /**
       * clearField(fieldElm)
       * Clears a given portion of the field of all positions.
       *
       * @param Element fieldElm The protion of the field to clear (typically #offense or #defense)
       */
      console.log("Clear Field?");
      console.log("fieldElm: ", fieldElm);
    },
    whereIsMyInside(gridX) {
      /**
       * whereIsMyInside(gridX)
       * Determines the relative direction of "inside" (aka towards the ball). 
       * This is useful to determeine whether to add or subtract when calculating the X coord.
       * 
       * @param Number gridX The GridColumnStart of an html element (typically a position).
       * @returns string higher|lower|onball
       */
      //      console.log("called whereIsMyInside() with gridX: ", gridX);
      const ballColumnStart = window.getComputedStyle(document.getElementById("ball")).gridColumnStart;
      //      console.log("gridX: ", gridX);
      //      console.log("The ball is at column: ", ballColumnStart);
      let direction = null;
      if (Number(ballColumnStart) > Number(gridX)) {
        direction = "higher";
      } else if (Number(ballColumnStart) < Number(gridX)) {
        direction = "lower";
      } else {
        direction = "onball";
      }
      //      console.log("X coord goes ::", direction, ":: to be inside (closer to ball)");
      return direction;

    },
    modMyAlignment: function (myGridPositionX, myInside, myAlignment, position) {
      /**
       * modMyAlignment()
       *
       *
       * @param Number myGridPositionX
       * @param String myInside
       * @param Obj myAlignment
       *
       * @returns Number The modified X coord
       */
      //      console.log("modMyAlignment() called with: ", myGridPositionX, myInside, myAlignment);

      //modify myGridPositionX
      // console.log("myGridPositionX (before): ", myGridPositionX);

      if ((myAlignment == 'outside' && myInside == 'higher') || (myAlignment == 'inside' && myInside == 'lower')) {

        //        console.log("++++ outside higher / inside lower ++++");
        myGridPositionX = Number(myGridPositionX) - Number(position.alignment.distance);

      } else if ((myAlignment == 'outside' && myInside == 'lower') || (myAlignment == 'inside' && myInside == 'higher')) {

        //        console.log("++++ outside lower / inside higher ++++");
        myGridPositionX = Number(myGridPositionX) + Number(position.alignment.distance);


      } else if (myAlignment == 'on') {

        //        console.log("++++ ON (don't mod the X coord) ++++");


      } else {
        console.log("# WUT? NO COMBO");
      }

      return myGridPositionX;
    }


  });

})(window, jQuery);
