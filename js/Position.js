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
    let gridPositionX = position.positionX;
    let gridPositionY = position.positionY;
    let gridPositionSelector = gridPositionSection + '-' + gridPositionX + '-' + gridPositionY;

    console.log(gridPositionSection, gridPositionX, gridPositionY, gridPositionSelector, position.positionTypes);

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

    // Here's how we select a specifc grid item!
    // @see https://www.geeksforgeeks.org/jquery-attributevalue-selector-4/
    $("[data-grid-coords|='" + gridPositionSelector + "']")
      .html(positionDiv);

  }

})(window, jQuery);
