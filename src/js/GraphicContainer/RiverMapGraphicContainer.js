/*global GraphicContainer, vec4, Bspline, TwoDimensionRenderingContext*/
var RiverMapGraphicContainer;
(function () {
    "use strict";
    RiverMapGraphicContainer = function (animationFrame) {
        GraphicContainer.call(this, "riverMap", animationFrame);
        this.gl = new TwoDimensionRenderingContext(this.canvas);
    };
    RiverMapGraphicContainer.prototype = Object.create(GraphicContainer.prototype);
    RiverMapGraphicContainer.constructor = RiverMapGraphicContainer;
    RiverMapGraphicContainer.prototype.isOdd = function (number) {
        return ((number % 2 !== 0) && (number !== 0));
    };
    RiverMapGraphicContainer.prototype.isOddAndIsAtDistanceTwoFromNearestMultipleOfThree = function (index) {
        return ((this.isOdd(index)) && (((index - 2) % 3) === 0));
    };
    RiverMapGraphicContainer.prototype.isEvenAndIsNotAtDistanceTwoFromNearestMultipleOfThree = function (index) {
        return (!this.isOdd(index)) && (((index - 2) % 3) !== 0);
    };
    RiverMapGraphicContainer.prototype.isAtThreeQuarterWidth = function (index) {
        return (this.isOddAndIsAtDistanceTwoFromNearestMultipleOfThree(index) || (this.isEvenAndIsNotAtDistanceTwoFromNearestMultipleOfThree(index)));
    };
    RiverMapGraphicContainer.prototype.getXPositionValue = function (index) {
        if (index % 3 === 0) {
            return this.canvas.width / 2;
        }
        if (this.isAtThreeQuarterWidth(index)) {
            return ((5 * this.canvas.width) / 8);
        }
        return (3 * this.canvas.width / 8);
    };
    RiverMapGraphicContainer.prototype.getYPositionValue = function (index, controlSegmentAmount) {
        var horizontalDivisionStep = 1 / (controlSegmentAmount * 3);
        return (index * this.canvas.height * horizontalDivisionStep);
    };
    RiverMapGraphicContainer.prototype.arc = function (xCenter, yCenter, radius, startingAngle, endingAngle) {
        this.gl.arc(xCenter, yCenter, radius, startingAngle, endingAngle);
    };
    RiverMapGraphicContainer.prototype.fillRect = function () {
        this.gl.fillRect();
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
}());