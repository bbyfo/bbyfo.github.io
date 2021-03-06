// JavaScript Document
'use strict';
(function (window, $) {

  /**
   * This is like a "Class". Use it like a __constructor() method.
   * Add Event Handlers.
   * When we instantiate a Position, we automatically place it.
   * 
   * @param $fieldSection Which section of the Field on which this position belongs.
   * @param position The JSON data for this position.
   */
  window.Position = function ($fieldSection, position) {
    this.position = position;
    // Place the position
    this.placePosition($fieldSection, this.position)


  } // End window.Position

  /////////////////////
  // Extend Position //
  /////////////////////
  $.extend(window.Position.prototype, {
    placePosition: function ($fieldSection, position) {
      //      console.log("Position instantiated as: ", position);
      let positionName = position.positionName;


      let gridPositionSection = $fieldSection.attr('id');

      // Handle Positions in gaps (spoier, they gotta be wider)
      //      let addGapExtendedEnding = false;
      //      let myModdedAlignmentXInitial = Number(0);
      //      let addExtendedEnding = Number(0);

      let gridPositionX = "";
      let gridPositionY = "";
      switch (gridPositionSection) {
        case 'offense':
          // Issue #4 Build Offense and Defense the same way: Anchors!
          // I'm just keeping this around for now.  Who knows what detonates after further testing 8^)
          // gridPositionX = position.positionX;
          // gridPositionY = position.positionY;
          // break;
        case 'defense':
          //        console.log("----------------------");
          //        console.log("NOW we get the " + position.positionName + " Postion's position.");

          let myGridPositionX = "*dummy*";
          let myGridPositionY = "*yummy*";

          // Get the coordinate information of the Anchor
          let myAnchors = position.anchors;

          // Get the Anchor for this Defensive Position
          let myAnchorElm = null;
          let myAnchorELmFound = false;
          myAnchors.forEach((myAnchor) => {
            let myTestAnchorElm = document.getElementById(myAnchor);
            if (myTestAnchorElm && myAnchorELmFound == false) {
              myAnchorElm = myTestAnchorElm;
              myAnchorELmFound = true;
              return;
            }

          });


          // Get the Parent of the Anchor (the parent contains the coordinate data)
          let $myAnchorElm = $(myAnchorElm);
          let $myAnchorElmParent = $myAnchorElm.parent().parent();
          //          console.log(positionName, "$myAnchorElm: ", $myAnchorElm);

          //          console.log("$myAnchorElmParent: ", $myAnchorElmParent);
          // Finally, get the X coord of the parent.
          let myAnchorsX = $myAnchorElmParent.css('grid-column-start');
          //          console.log("myAnchorsX: ", myAnchorsX);

          myGridPositionX = myAnchorsX;

          // Modify my X grid position based on the alignment direction and distance.
          if (position.alignment.direction === "right") {
            myGridPositionX = Number(myGridPositionX) + Number(position.alignment.distance);
          } else if (position.alignment.direction === "left") {
            myGridPositionX = Number(myGridPositionX) - Number(position.alignment.distance);
          }

          // Where is my inside?
          let myPositionHelper = new PositionHelper();
          let myInside = myPositionHelper.whereIsMyInside(myGridPositionX);

          let myAlignment = position.alignment.direction;

          // Math the alignment and the anchor and get the positions' cordinates
          let myModdedAlignmentX = myPositionHelper.modMyAlignment(myGridPositionX, myInside, myAlignment, position);

          // Take note of the original X coord
          //          myModdedAlignmentXInitial = myModdedAlignmentX;

          // Even numbers are gaps. Handle the putting of postion nodes in Gaps.
          // We set the custom grid-column-end later
          //          if (myModdedAlignmentX % 2 === 0) {
          //            addExtendedEnding = Number(myModdedAlignmentX);
          //            myModdedAlignmentX = Number(myModdedAlignmentX) - Number(1);
          //          }


          // After all the mods, we finally set the "my" version of the X coord to the final, usable X coord.
          gridPositionX = myModdedAlignmentX;

          // Thankfully, the Y coord is just pulled from the position definition
          myGridPositionY = position.depth;
          gridPositionY = myGridPositionY;

          break;

      } // End of big-ol' switch (sniff...sniff...Do I smell a refactor?  Spoiler: Yes.)

      // Here we assign the coordinates
      let gridPositionSelector = gridPositionSection + '-' + gridPositionX + '-' + gridPositionY;

      //console.log("Grid Positions in Position: ", gridPositionSection, gridPositionX, gridPositionY, gridPositionSelector, position.positionTypes);

      let positionNameWithNewLinesPenultimate = positionName;
      let positionNameWithNewLinesFinal = "";
      positionNameWithNewLinesPenultimate = positionNameWithNewLinesPenultimate.split('');
      positionNameWithNewLinesPenultimate = positionNameWithNewLinesPenultimate.forEach((letter, i) => {
        //        console.log("letter:", letter, i);
        return positionNameWithNewLinesFinal += letter + "\n";

      });

      //      console.log("positionNameWithNewLinesFinal: ", positionNameWithNewLinesFinal);


      // Create the position element placeholder
      var $positionDiv = $("<div></div>").text(positionNameWithNewLinesFinal);

      // Provide classes and the ID
      $positionDiv.attr('id', position.positionName);
      let blockingIdentifierStylesSelector = 'blocking-identifier--' + $positionDiv.attr('id');
      $positionDiv.addClass(['position-node', blockingIdentifierStylesSelector]);


      // Add the position section (offense or defense)
      $positionDiv.addClass(['position-' + gridPositionSection]);


      // Add the position type(s) class(es).
      if (position.positionTypes) {
        $positionDiv.addClass(position.positionTypes);
      }


      // Here's how we select a specifc grid item!
      // @see https://www.geeksforgeeks.org/jquery-attributevalue-selector-4/
      $("[data-grid-coords|='" + gridPositionSelector + "'] .position-wrapper")
        .append($positionDiv);


      ///////////////////////////////////
      // Choose the helmet image style //
      ///////////////////////////////////
      //    console.log("$fieldSection: ", $fieldSection.attr('id'));
      // Default helmet
      var imgHelmetStyle = "";
      switch ($fieldSection.attr('id')) {
        case "offense":
          imgHelmetStyle = "helmet-red";
          break;
        case "defense":
          imgHelmetStyle = "helmet-blue";
          break;
        default:
          imgHelmetStyle = "helmet";
      }

      /*
       * Right here would be a cool place to implement some sort of "Setting" or "Hook" to override the default imgHelmetStyle
       */

      // Add the Helmet Image
      var $positionDivImg = $("<img/>").attr({
        src: 'images/' + imgHelmetStyle + '.svg'
      }).addClass("helmet-image");

      // FINALLY!! Adding the position to the DOM
      $("[data-grid-coords|='" + gridPositionSelector + "']").append($positionDivImg);

      // Add the Position Responsibility Wrapper
      $positionDiv.parent().append($("<div></div>").addClass(['position-responsibility-wrapper']));

      // Mark this position's parent
      $positionDiv.parent().addClass(['position-container']);

    }
  });
  /////////////////////
  // Position Helper //
  /////////////////////
  window.PositionHelper = function ($wrapper) {
    //    console.log("PositionHelper created with $wrapper: ", $wrapper);
    this.$wrapper = $wrapper;
  }
  ////////////////////////////
  // Extend Position Helper //
  ////////////////////////////
  $.extend(PositionHelper.prototype, {

    whereIsMyInside(gridX) {
      /**
       * whereIsMyInside(gridX)
       * Determines the relative direction of "inside" (aka towards the ball). 
       * This is useful to determeine whether to add or subtract when calculating the X coord.
       * 
       * @param Number gridX The GridColumnStart of an html element (typically a position).
       * @returns string higher|lower|onball
       */
      //      console.log("whereIsMyInside() called with gridX: ", gridX);
      const ballColumnStart = window.getComputedStyle(document.getElementById("ball-origin")).gridColumnStart;
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
       * @param Number myGridPositionX The Positions' current X coord
       * @param String myInside Which dirction is the Ball? (higher, lower, or on)
       * @param Obj myAlignment The Positions' alignement, based on the Formation
       * @param position Position The position object
       *
       * @returns Number The modified X coord
       */
      //            console.log("modMyAlignment() called for " + position.positionName);
      //            console.log("myGridPositionX: ", myGridPositionX);
      //            console.log("myInside: ", myInside);
      //            console.log("myAlignment: ", myAlignment);
      //            console.log("position: ", position);
      //            console.log("distance: ", position.alignment.distance);

      //modify myGridPositionX
      // console.log("myGridPositionX (before): ", myGridPositionX);

      if ((myAlignment == 'outside' && myInside == 'higher')
        || (myAlignment == 'inside' && myInside == 'lower')
        || (myInside == 'onball' && myAlignment == 'left')) {

        //        console.log("++++ outside higher / inside lower ++++");

        myGridPositionX = Number(myGridPositionX) - Number(position.alignment.distance);

      } else if ((myAlignment == 'outside' && myInside == 'lower')
        || (myAlignment == 'inside' && myInside == 'higher')
        || (myInside == 'onball' && myAlignment == 'right')) {

        //        console.log("++++ outside lower / inside higher ++++");

        myGridPositionX = Number(myGridPositionX) + Number(position.alignment.distance);


      } else if (myAlignment == 'on') {

        //        console.log("++++ ON (don't mod the X coord) ++++");


      } else {
        //        console.log("# WARNING: " + position.positionName + " No need to modify the aligntment.");
      }
      //      console.log("myGridPositionX returned by modMyAlignment()", myGridPositionX);
      //      console.log("-------------");
      return myGridPositionX;
    }


  });

})(window, jQuery);
