/*global WebGlRenderingContext*/
var TwoDimensionRenderingContext;
(function () {
    "use strict";
    TwoDimensionRenderingContext = function (canvas) {
        WebGlRenderingContext.call(this, canvas, "2d");
    };
    TwoDimensionRenderingContext.prototype = Object.create(WebGlRenderingContext.prototype);
    TwoDimensionRenderingContext.constructor = TwoDimensionRenderingContext;
    TwoDimensionRenderingContext.prototype.clearRect = function () {
        this.gl.clearRect(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    };
    TwoDimensionRenderingContext.prototype.beginPath = function () {
        this.gl.beginPath();
    };
    TwoDimensionRenderingContext.prototype.moveTo = function (x, y) {
        this.gl.moveTo(x, y);
    };
    TwoDimensionRenderingContext.prototype.lineTo = function (x, y) {
        this.gl.lineTo(x, y);
    };
    TwoDimensionRenderingContext.prototype.stroke = function () {
        this.gl.stroke();
    };
    TwoDimensionRenderingContext.prototype.setStrokeStyle = function (strokeStyle) {
        this.gl.strokeStyle = strokeStyle;
    };
    TwoDimensionRenderingContext.prototype.setLineWidth = function (lineWidth) {
        this.gl.lineWidth = lineWidth;
    };
    TwoDimensionRenderingContext.prototype.setLineWidth = function (lineWidth) {
        this.gl.lineWidth = lineWidth;
    };
    TwoDimensionRenderingContext.prototype.setLineDash = function (segments) {
        this.gl.setLineDash(segments);
    };
}());
