/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline, TwoDimensionShapeContainer, FARFROMANYCONTROLPOINT*/
/*global CLICKDISTANCESENSITIVENESS, YCOORDINATE, XCOORDINATE, ZCOORDINATE, ControlPoints*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        AnimationFrame.call(this);
        this.riverMapGraphicContainer = new RiverMapGraphicContainer(this);
        this.controlSegmentAmount = 2;
        this.controlPointsAmount = 3 * this.controlSegmentAmount + 1;
        this.controlPoints = [];
        this.setControlPoints();
        this.bspline = new Bspline(this.controlPoints, 100, [0, 1, 0]);
        this.trajectory = [];
        this.equatorDistance = this.riverMapGraphicContainer.canvas.height / 2;
        this.origin = vec2.create();
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.prototype.constructor = RiverMap;
    RiverMap.prototype.getCurveCenter = function () {
        return this.origin;
    };
    RiverMap.prototype.resetSecondPointAndPreviousLastPointPositionsToMakeExtemesTangenPerpenduclarToXAxis = function () {
        var previousIndex = this.controlPoints.length - 2;
        var lastIndex = this.controlPoints.length - 1;
        this.controlPoints[1][0] = this.controlPoints[0][0];
        this.controlPoints[previousIndex][0] = this.controlPoints[lastIndex][0];
    };
    RiverMap.prototype.setControlPoints = function () {
        var index;
        var x;
        var z;
        var point;
        for (index = 0; index < this.controlPointsAmount; index += 1) {
            x = this.riverMapGraphicContainer.getXPositionValue(index);
            z = this.riverMapGraphicContainer.getYPositionValue(index, this.controlSegmentAmount);
            point = [x, 0, z];
            this.controlPoints.push(point);
        }
        this.resetSecondPointAndPreviousLastPointPositionsToMakeExtemesTangenPerpenduclarToXAxis();
    };
    RiverMap.prototype.clikedPointIsNotOneOfTheExtreme = function (index, controlPointsLength) {
        return ((index > 1) && (index < controlPointsLength - 2));
    };
    RiverMap.prototype.getControlPointClicked = function (initialPosition) {
        var index;
        var controlPoint = vec2.create();
        var distance = 0;
        var controlPointsLength = this.controlPoints.length;
        for (index = 0; index < controlPointsLength; index += 1) {
            vec2.set(controlPoint, this.controlPoints[index][XCOORDINATE], this.controlPoints[index][ZCOORDINATE]);
            distance = vec2.distance(controlPoint, initialPosition);
            if ((distance <= CLICKDISTANCESENSITIVENESS) && (this.clikedPointIsNotOneOfTheExtreme(index, controlPointsLength))) {
                return index;
            }
        }
        return FARFROMANYCONTROLPOINT;
    };
    RiverMap.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        var clickedPointIndex = this.getControlPointClicked(initialPosition);
        if (clickedPointIndex !== FARFROMANYCONTROLPOINT) {
            this.controlPoints[clickedPointIndex] = [endPosition[0], 0, endPosition[1]];
        }
    };
    RiverMap.prototype.drawControlPoints = function (controlPoint) {
        this.riverMapGraphicContainer.beginPath();
        this.riverMapGraphicContainer.arc(controlPoint[XCOORDINATE], controlPoint[ZCOORDINATE], CLICKDISTANCESENSITIVENESS, 0, 2 * Math.PI);
        this.riverMapGraphicContainer.setLineWidth(1);
        this.riverMapGraphicContainer.setLineDash([0, 0]);
        this.riverMapGraphicContainer.setStrokeStyle("#000000");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.drawControlGraphSegment = function (previousControlPoint, controlPoint) {
        this.riverMapGraphicContainer.beginPath();
        this.riverMapGraphicContainer.setLineWidth(1);
        this.riverMapGraphicContainer.setLineDash([5, 15]);
        this.riverMapGraphicContainer.moveTo(previousControlPoint[XCOORDINATE], previousControlPoint[ZCOORDINATE]);
        this.riverMapGraphicContainer.lineTo(controlPoint[XCOORDINATE], controlPoint[ZCOORDINATE]);
        this.riverMapGraphicContainer.setStrokeStyle("#000000");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.checkAndSetOrigin = function (xCoordinate, yCoordinate) {
        if (Math.abs(yCoordinate - this.equatorDistance) <= 1) {
            vec2.set(this.origin, xCoordinate, yCoordinate);
        }
    };
    RiverMap.prototype.drawFullCurve = function () {
        this.trajectory = this.bspline.getCurvePoints();
        this.riverMapGraphicContainer.setLineWidth(5);
        this.riverMapGraphicContainer.setLineDash([0, 0]);
        this.riverMapGraphicContainer.beginPath();
        this.trajectory.forEach(function (currentCurvePoint, index) {
            if (index === 0) {
                this.riverMapGraphicContainer.moveTo(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
            } else {
                this.riverMapGraphicContainer.lineTo(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
            }
            this.checkAndSetOrigin(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
        }, this);
        this.riverMapGraphicContainer.setStrokeStyle("#0000FF");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.drawControlGraph = function () {
        var index;
        var currentControlPoint;
        var previousPoint;
        var controlPointsLength = this.controlPoints.length;
        for (index = 0; index < controlPointsLength; index += 1) {
            currentControlPoint = this.controlPoints[index];
            this.drawControlPoints(currentControlPoint);
            if (index > 0) {
                previousPoint = this.controlPoints[index - 1];
                this.drawControlGraphSegment(previousPoint, currentControlPoint);
            }
        }
    };
    RiverMap.prototype.draw = function () {
        this.riverMapGraphicContainer.fillRect();
        this.drawFullCurve();
        this.drawControlGraph();
    };
}());
