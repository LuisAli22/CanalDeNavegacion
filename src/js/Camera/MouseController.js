/*global vec2, BOTONIZQUIERDODELMOUSE*/
var MouseController;
(function () {
    "use strict";
    MouseController = function () {
        this.initialPosition = vec2.create();
        this.endPosition = vec2.create();
        this.leftButtonPressed = false;
    };
    MouseController.prototype.isLeftButton = function (event) {
        return (event.which === BOTONIZQUIERDODELMOUSE);
    };
    MouseController.prototype.getScreenCoordinate = function (event, canvas) {
        var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
        var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;
        return vec2.fromValues(x, y);
    };
    MouseController.prototype.onMouseDown = function (event, canvas) {
        this.leftButtonPressed = this.isLeftButton(event);
        this.initialPosition = this.getScreenCoordinate(event, canvas);
    };
    MouseController.prototype.onMouseUp = function (event) {
        if (this.isLeftButton(event)) {
            this.leftButtonPressed = false;
        }
    };
    MouseController.prototype.onMouseMove = function (event, animationFrame, canvas) {
        if (this.leftButtonPressed) {
            this.endPosition = this.getScreenCoordinate(event, canvas);
            animationFrame.setPositionsAndUpdate(this.initialPosition, this.endPosition);
            this.initialPosition = this.endPosition;
        }
    };
}());