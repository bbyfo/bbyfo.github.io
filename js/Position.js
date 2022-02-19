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
    let gridPositionX = position.positionX;
    let gridPositionY = position.positionY;
    let gridPositionSelector = gridPositionSection + '-' + gridPositionX + '-' + gridPositionY;

    console.log(gridPositionSection, gridPositionX, gridPositionY, gridPositionSelector);

    var positionDiv = $("<div></div>").text(positionName);
    positionDiv.addClass(['offensive-position']);

    // Here's how we select a specifc grid item!
    // @see https://www.geeksforgeeks.org/jquery-attributevalue-selector-4/
    $("[data-grid-coords|='" + gridPositionSelector + "']")
      .html(positionDiv);

  }

})(window, jQuery);
