/*global vec2, BOTONIZQUIERDODELMOUSE*/
var MouseController;
(function () {
    "use strict";
    MouseController = function (canvasOffset) {
        this.canvasOffset = canvasOffset;
        this.initialPosition = vec2.create();
        this.endPosition = vec2.create();
        this.leftButtonPressed = false;
    };
    MouseController.prototype.isLeftButton = function (event) {
        return (event.which === BOTONIZQUIERDODELMOUSE);
    };
    MouseController.prototype.getScreenCoordinate = function (event) {
        var screenCoordinate = vec2.create();
        vec2.set(screenCoordinate, event.clientX, event.clientY);
        vec2.subtract(screenCoordinate, screenCoordinate, this.canvasOffset);
        return screenCoordinate;
    };
    MouseController.prototype.onMouseDown = function (event) {
        this.leftButtonPressed = this.isLeftButton(event);
        this.initialPosition = this.getScreenCoordinate(event);
    };
    MouseController.prototype.onMouseUp = function (event) {
        if (this.isLeftButton(event)) {
            this.leftButtonPressed = false;
        }
    };
    MouseController.prototype.onMouseMove = function (event, animationFrame) {
        if (this.leftButtonPressed) {
            this.endPosition = this.getScreenCoordinate(event);
            animationFrame.setPositionsAndUpdate(this.initialPosition, this.endPosition);
            this.initialPosition = this.endPosition;
        }
    };
}());