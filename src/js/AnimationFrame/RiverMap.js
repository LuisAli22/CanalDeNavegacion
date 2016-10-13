/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline, TwoDimensionShapeContainer, FARFROMANYCONTROLPOINT*/
/*global CLICKDISTANCESENSITIVENESS, YCOORDINATE, XCOORDINATE*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        AnimationFrame.call(this);
        this.riverMapGraphicContainer = new RiverMapGraphicContainer(this);
        this.shapeContainer = new TwoDimensionShapeContainer(this.riverMapGraphicContainer);
        this.bSplineCurve = this.shapeContainer.bSplineCurve;
        this.controlSegmentAmount = 5;
        this.controlPointsAmount = 3 * this.controlSegmentAmount + 1;
        this.position = this.createPositions();
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.constructor = RiverMap;
    RiverMap.prototype.getIndex = function (position) {
        if (position < 2) {
            return 0;
        }
        if ((position - 2) < (this.controlPointsAmount)) {
            return (position - 2);
        }
        return (this.controlPointsAmount - 1);
    };
    RiverMap.prototype.createPositions = function () {
        var position = [];
        var index;
        for (index = 0; index < this.controlPointsAmount; index += 1) {
            position[2 * index] = this.riverMapGraphicContainer.getXPositionValue(index);
            position[(2 * index) + 1] = this.riverMapGraphicContainer.getYPositionValue(index, this.controlSegmentAmount);
        }
        return position;
    };
    RiverMap.prototype.clikedPointIsNotOneOfTheExtreme = function (index) {
        return ((index !== 0) && (index !== this.position.length - 2));
    };
    RiverMap.prototype.getControlPointClicked = function (initialPosition) {
        var index;
        var controlPoint = vec2.create();
        var distance = 0;
        for (index = 0; index < this.position.length; index += 2) {
            vec2.set(controlPoint, this.position[index], this.position[index + 1]);
            distance = vec2.distance(controlPoint, initialPosition);
            if ((distance <= CLICKDISTANCESENSITIVENESS) && (this.clikedPointIsNotOneOfTheExtreme(index))) {
                return index;
            }
        }
        return FARFROMANYCONTROLPOINT;
    };
    RiverMap.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        var controlPointIndex = this.getControlPointClicked(initialPosition);
        if (controlPointIndex !== FARFROMANYCONTROLPOINT) {
            this.position[controlPointIndex] = endPosition[XCOORDINATE];
            this.position[controlPointIndex + 1] = endPosition[YCOORDINATE];
        }

    };
    RiverMap.prototype.createCurveIdentifiers = function () {
        var identifiers = [];
        var index;
        for (index = 0; index <= 4 * this.controlSegmentAmount; index += 1) {
            identifiers[index] = index;
        }
        return identifiers;
    };
    RiverMap.prototype.drawCurve = function () {
        var curveBsplineIdentifiers = this.createCurveIdentifiers();
        var riverMap = this;
        curveBsplineIdentifiers.forEach(function (curveIdentifier) {
            var slidingWindow = vec4.create();
            vec4.set(slidingWindow, riverMap.getIndex(curveIdentifier), riverMap.getIndex(curveIdentifier + 1), riverMap.getIndex(curveIdentifier + 2), riverMap.getIndex(curveIdentifier + 3));
            var xControlPoints = vec4.create();
            var yControlPoints = vec4.create();
            slidingWindow.forEach(function (element, index) {
                xControlPoints[index] = riverMap.position[2 * element];
                yControlPoints[index] = riverMap.position[(2 * element) + 1];
            });
            riverMap.bSplineCurve.setControlPoints(xControlPoints, yControlPoints);
            riverMap.bSplineCurve.draw();
        });
    };
    RiverMap.prototype.drawControlGraph = function () {
        var index;
        var controlPoint;
        var previousPoint;
        for (index = 0; index < this.position.length; index += 2) {
            controlPoint = {"x": this.position[index], "y": this.position[index + 1]};
            this.bSplineCurve.drawControlPoints(controlPoint);
            if (index > 0) {
                previousPoint = {"x": this.position[index - 2], "y": this.position[index - 1]};
                this.bSplineCurve.drawControlGraphSegment(previousPoint, controlPoint);
            }
        }
    };
    RiverMap.prototype.draw = function () {
        this.riverMapGraphicContainer.fillRect();
        this.drawCurve();
        this.drawControlGraph();
    };
}());
