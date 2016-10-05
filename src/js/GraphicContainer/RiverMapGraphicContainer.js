/*global GraphicContainer, vec4, Bspline, TwoDimensionRenderingContext*/
var RiverMapGraphicContainer;
(function () {
    "use strict";
    RiverMapGraphicContainer = function () {
        GraphicContainer.call(this, "riverMap");
        this.gl = new TwoDimensionRenderingContext(this.canvas);
        this.xControlPoints = vec4.create();
        this.yControlPoints = vec4.create();
        vec4.set(this.xControlPoints, this.canvas.width / 2, this.canvas.width / 4, this.canvas.width / 4, this.canvas.width / 2);
        vec4.set(this.yControlPoints, 0, this.canvas.height / 3, 2 * this.canvas.height / 3, this.canvas.height);
        /*  vec4.set(this.xControlPoints, this.canvas.width / 2, this.canvas.width / 2, this.canvas.width / 2, this.canvas.width / 4);
         vec4.set(this.yControlPoints, 0, 0, 0, this.canvas.height / 3);*/
    };
    RiverMapGraphicContainer.prototype = Object.create(GraphicContainer.prototype);
    RiverMapGraphicContainer.constructor = RiverMapGraphicContainer;
    RiverMapGraphicContainer.prototype.getCanvas = function () {
        return this.canvas;
    };
    RiverMapGraphicContainer.prototype.clearRect = function () {
        this.gl.clearRect();
    };
    RiverMapGraphicContainer.prototype.beginPath = function () {
        this.gl.beginPath();
    };
    RiverMapGraphicContainer.prototype.moveTo = function (x, y) {
        this.gl.moveTo(x, y);
    };
    RiverMapGraphicContainer.prototype.lineTo = function (x, y) {
        this.gl.lineTo(x, y);
    };
    RiverMapGraphicContainer.prototype.stroke = function () {
        this.gl.stroke();
    };
    RiverMapGraphicContainer.prototype.setStrokeStyle = function (strokeStyle) {
        this.gl.setStrokeStyle(strokeStyle);
    };
    RiverMapGraphicContainer.prototype.setLineWidth = function (lineWidth) {
        this.gl.setLineWidth(lineWidth);
    };
    RiverMapGraphicContainer.prototype.setLineDash = function (segments) {
        this.gl.setLineDash(segments);
    };
    RiverMapGraphicContainer.prototype.getXControlPoints = function () {
        return this.xControlPoints;
    };
    RiverMapGraphicContainer.prototype.getYControlPoints = function () {
        return this.yControlPoints;
    };
}());