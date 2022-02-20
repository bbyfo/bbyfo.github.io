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
    console.log("Position instantiated as: ", $fieldSection, this.position);
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
        console.log("NOW we get the " + position.positionName + " Postion's position.");
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


        console.log("myAnchorElm after the forEach: ", myAnchorElm);
        let $myAnchorElm = $(myAnchorElm);
        console.log("$myAnchorElm: ", $myAnchorElm);
        let $myAnchorElmParent = $myAnchorElm.parent();
        console.log("$myAnchorElmParent: ", $myAnchorElmParent);


        let myAnchorsX = $myAnchorElmParent.css('grid-column-start');
        console.log("myAnchorsX: ", myAnchorsX);

        // Get the the alignment (shading) for the position


        // Where is my inside?
        let myPositionHelper = new PositionHelper();
        let myInside = myPositionHelper.whereIsMyInside(myAnchorsX);
        //        console.log("myInside: ", myInside);
			
			
        // Math the alignment and the anchor and get the positions' cordinates

        gridPositionX = myGridPositionX;
        gridPositionY = myGridPositionY;

        break;

    }


    let gridPositionSelector = gridPositionSection + '-' + gridPositionX + '-' + gridPositionY;

    console.log("Grid Positions in Position: ", gridPositionSection, gridPositionX, gridPositionY, gridPositionSelector, position.positionTypes);

    // Create the position element
    var positionDiv = $("<div></div>").text(positionName);
    positionDiv.addClass('position-node');
    positionDiv.attr('id', position.positionName)
    // Add the position section (offense or defense)
    positionDiv.addClass(['position-' + gridPositionSection]);

    // Add the position type(s) class(es).
    console.log(position.positionTypes);
    if (position.positionTypes) {
      positionDiv.addClass(position.positionTypes);
    }

    console.log("gridPositionSelector: ", gridPositionSelector);
    // Here's how we select a specifc grid item!
    // @see https://www.geeksforgeeks.org/jquery-attributevalue-selector-4/
    $("[data-grid-coords|='" + gridPositionSelector + "']")
      .html(positionDiv);


  }


  var PositionHelper = function ($wrapper) {
    console.log("PositionHelper created with $wrapper: ", $wrapper);
    this.$wrapper = $wrapper;
  }

  $.extend(PositionHelper.prototype, {
    clearField: function (fieldElm) {
      console.log("Clear Field?");
      console.log("wut", fieldElm);
    },
    whereIsMyInside(gridX) {
      console.log("called whereIsMyInside()");
      const ballColumnStart = window.getComputedStyle(document.getElementById("ball")).gridColumnStart;
      // console.log("myPosition: ", myPosition);
      // console.log("The ball is at column: ", ballColumnStart);
      if (ballColumnStart > gridX) {
        return "higher";
      } else if (ballColumnStart < gridX) {
        return "lower";
      } else {
        return "onball";
      }
    }


  });

  /**
   * Determines the relative direction of "inside" (aka towards the ball).
   * 
   * 
   * @param Number myPosition The GridColumnStart of an html element (typically a position).
   * @returns string 
   */
  //  function whereIsInside(myPosition) {
  //    const ballColumnStart = window.getComputedStyle(document.getElementById("ball")).gridColumnStart;
  //    // console.log("myPosition: ", myPosition);
  //    // console.log("The ball is at column: ", ballColumnStart);
  //    if (ballColumnStart > myPosition) {
  //      return "higher";
  //    } else if (ballColumnStart < myPosition) {
  //      return "lower";
  //    } else {
  //      return "onball";
  //    }
  //  }


})(window, jQuery);
