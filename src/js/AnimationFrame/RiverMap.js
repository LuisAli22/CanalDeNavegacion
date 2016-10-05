/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline, TwoDimensionShapeContainer*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        AnimationFrame.call(this);
        this.riverMapGraphicContainer = new RiverMapGraphicContainer();
        this.shapeContainer = new TwoDimensionShapeContainer(this.riverMapGraphicContainer);
        this.bSplineCurve = this.shapeContainer.bSplineCurve;
        this.mouseIsPressed = false;
        //this.index = [0, 0, 0, 1, 2, 3, 3, 3];
        this.canvas = this.riverMapGraphicContainer.getCanvas();
        this.controlSegmentAmount = 5;
        //this.position = [];
        //this.createPositions();
        //this.position = [this.canvas.width / 2, 0, this.canvas.width / 4, this.canvas.height / 12, this.canvas.width / 4, this.canvas.height / 6, this.canvas.width / 2, this.canvas.height / 4];
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.constructor = RiverMap;
    RiverMap.prototype.isOdd = function (number) {
        return ((number % 2 !== 0) && (number !== 0));
    };
    RiverMap.prototype.getIndex = function (position) {
        if (position < 2) {
            return 0;
        }
        if ((position - 2) < (4 * this.controlSegmentAmount)) {
            return (position - 2);
        }
        return ((4 * this.controlSegmentAmount) - 1);
    };
    RiverMap.prototype.isOddAndIsAtDistanceTwoFromNearestMultipleOfThree = function (index) {
        return ((this.isOdd(index)) && (((index - 2) % 3) === 0));
    };
    RiverMap.prototype.isEvenAndIsNotAtDistanceTwoFromNearestMultipleOfThree = function (index) {
        return (!this.isOdd(index)) && (((index - 2) % 3) !== 0);
    };
    RiverMap.prototype.isAtThreeQuarterWidth = function (index) {
        return (this.isOddAndIsAtDistanceTwoFromNearestMultipleOfThree(index) || (this.isEvenAndIsNotAtDistanceTwoFromNearestMultipleOfThree(index)));
    };
    RiverMap.prototype.getXPositionValue = function (index) {
        if (index % 3 === 0) {
            return this.canvas.width / 2;
        }
        if (this.isAtThreeQuarterWidth(index)) {
            return ((5 * this.canvas.width) / 8);
        }
        return (3 * this.canvas.width / 8);
    };
    RiverMap.prototype.getYPositionValue = function (index) {
        var horizontalDivisionStep = 1 / (this.controlSegmentAmount * 3);
        return (index * this.canvas.height * horizontalDivisionStep);
    };
    /*RiverMap.prototype.createPositions = function () {
     var index;
     for (index = 0; index < 8; index += 1) {
     this.position[index] = this.getPositionValue(index);
     }
     };*/
    RiverMap.prototype.updateCoordinates = function (e) {
        //var pos=$("#riverMap").position();
        //$("#pad").html("mouse x: " + (e.pageX -pos.left)+ "<br>mouse y: " + (e.pageY-pos.top));
    };
    RiverMap.prototype.onMouseDown = function (event) {
        this.mouseIsPressed = true;
        this.updateCoordinates(event);
    };
    RiverMap.prototype.onMouseUp = function () {
        this.mouseIsPressed = false;
    };
    RiverMap.prototype.onMouseMove = function (event) {
        if (this.mouseIsPressed) {
            this.updateCoordinates(event);
        }
    };
    /*    RiverMap.prototype.cubicCurve = function (u) {
     return this.bSplineCurve.base(u);
    };
    RiverMap.prototype.firstDerivateCubicCurve = function () {
     return this.bSplineCurve.derivatedBase(this.currentU);
     };*/
    RiverMap.prototype.createCurveIdentifiers = function () {
        var identifiers = [];
        var index;
        for (index = 0; index <= this.controlSegmentAmount * 4; index += 1) {
            identifiers[index] = index;
        }
        return identifiers;
    };
    RiverMap.prototype.draw = function () {
        this.riverMapGraphicContainer.clearRect();
        var curveBsplineIdentifiers = this.createCurveIdentifiers();//[0, 1, 2, 3, 4];
        var riverMap = this;
        curveBsplineIdentifiers.forEach(function (curveIdentifier) {
            var slidingWindow = vec4.create();
            vec4.set(slidingWindow, riverMap.getIndex(curveIdentifier), riverMap.getIndex(curveIdentifier + 1), riverMap.getIndex(curveIdentifier + 2), riverMap.getIndex(curveIdentifier + 3));
            var xControlPoints = vec4.create();
            var yControlPoints = vec4.create();
            slidingWindow.forEach(function (element, index) {
                //var positionIndex = 2 * element;
                xControlPoints[index] = riverMap.getXPositionValue(element);//riverMap.position[positionIndex];
                yControlPoints[index] = riverMap.getYPositionValue(element);//riverMap.position[positionIndex + 1];
            });
            riverMap.bSplineCurve.setControlPoints(xControlPoints, yControlPoints);
            riverMap.bSplineCurve.draw();
            /*if (curveIdentifier === 2) {
             riverMap.bSplineCurve.drawControlGraph();
             }*/
        });
    };

}());
