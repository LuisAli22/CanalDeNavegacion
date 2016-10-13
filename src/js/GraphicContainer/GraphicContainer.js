/*jslint browser: true*/
/*global CANVASERRORMESSAGE, WebGlRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID, vec2, MouseController*/
var GraphicContainer;
(function () {
    "use strict";
    GraphicContainer = function (canvasID, animationFrame) {
        this.animationFrame = animationFrame;
        this.canvas = document.getElementById(canvasID);
        if (!this.canvas) {
            throw new Error(CANVASERRORMESSAGE);
        }
        this.mouseController = new MouseController(this.getCanvasOffset());
        this.canvas.onmousedown = this.onMouseDown.bind(this);
        this.canvas.onmouseup = this.onMouseUp.bind(this);
        this.canvas.onmousemove = this.onMouseMove.bind(this);
        this.canvas.onwheel = this.onWheel.bind(this);
    };
    GraphicContainer.prototype.getCanvasOffset = function () {
        var offset = vec2.create();
        vec2.set(offset, this.canvas.offsetLeft, this.canvas.offsetTop);
        return offset;
    };
    GraphicContainer.prototype.onMouseDown = function (event) {
        this.mouseController.onMouseDown(event);
    };
    GraphicContainer.prototype.onMouseUp = function (event) {
        this.mouseController.onMouseUp(event);
    };
    GraphicContainer.prototype.onMouseMove = function (event) {
        this.mouseController.onMouseMove(event, this.animationFrame);
    };
    GraphicContainer.prototype.onWheel = function (event) {
        this.animationFrame.onWheel(event);
    };
}());