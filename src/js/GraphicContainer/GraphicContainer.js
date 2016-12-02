/*jslint browser: true*/
/*global CANVASERRORMESSAGE, vec2, MouseController*/
var GraphicContainer;
(function () {
    "use strict";
    GraphicContainer = function (canvasID, animationFrame) {
        this.animationFrame = animationFrame;
        this.canvas = document.getElementById(canvasID);
        if (!this.canvas) {
            throw new Error(CANVASERRORMESSAGE);
        }
        this.mouseController = new MouseController();
        this.canvas.onmousedown = this.onMouseDown.bind(this);
        this.canvas.onmouseup = this.onMouseUp.bind(this);
        this.canvas.onmousemove = this.onMouseMove.bind(this);
        this.canvas.onwheel = this.onWheel.bind(this);
    };
    GraphicContainer.prototype.onMouseDown = function (event) {
        this.mouseController.onMouseDown(event, this.canvas);
    };
    GraphicContainer.prototype.onMouseUp = function (event) {
        this.mouseController.onMouseUp(event);
    };
    GraphicContainer.prototype.onMouseMove = function (event) {
        this.mouseController.onMouseMove(event, this.animationFrame, this.canvas);
    };
    GraphicContainer.prototype.onWheel = function (event) {
        this.animationFrame.onWheel(event);
    };
}());