/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline, TwoDimensionShapeContainer, FARFROMANYPOINT*/
/*global CLICKDISTANCESENSITIVENESS, YCOORDINATE, XCOORDINATE, ZCOORDINATE, ControlPoints, controlValues*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        AnimationFrame.call(this, new RiverMapGraphicContainer(this));
        this.controlSegmentAmount = 2;
        this.controlPointsAmount = 3 * this.controlSegmentAmount + 1;
        this.controlPoints = [];
        this.setControlPoints();
        this.bspline = new Bspline(this.controlPoints, 100, [0, 1, 0]);
        this.trajectory = [];
        this.equatorDistance = this.graphicContainer.canvas.height * (controlValues.bridgePosition / 100);
        this.origin = vec2.create();
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.prototype.constructor = RiverMap;
    RiverMap.prototype.getCurveCenter = function () {
        return this.origin;
    };
    RiverMap.prototype.resetSecondPointAndPreviousLastPointPositionsToMakeExtremesTangentPerpendicularToXAxis = function () {
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
            x = this.graphicContainer.getXPositionValue(index);
            z = this.graphicContainer.getYPositionValue(index, this.controlSegmentAmount);
            point = [x, 0, z];
            this.controlPoints.push(point);
        }
        this.resetSecondPointAndPreviousLastPointPositionsToMakeExtremesTangentPerpendicularToXAxis();
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
        return FARFROMANYPOINT;
    };
    RiverMap.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        var clickedPointIndex = this.getControlPointClicked(initialPosition);
        if (clickedPointIndex !== FARFROMANYPOINT) {
            this.controlPoints[clickedPointIndex] = [endPosition[0], 0, endPosition[1]];
        }
    };
    RiverMap.prototype.drawControlPoints = function (controlPoint) {
        this.graphicContainer.beginPath();
        this.graphicContainer.arc(controlPoint[XCOORDINATE], controlPoint[ZCOORDINATE], CLICKDISTANCESENSITIVENESS, 0, 2 * Math.PI);
        this.graphicContainer.setLineWidth(1);
        this.graphicContainer.setLineDash([0, 0]);
        this.graphicContainer.setStrokeStyle("#000000");
        this.graphicContainer.stroke();
    };
    RiverMap.prototype.drawControlGraphSegment = function (previousControlPoint, controlPoint) {
        this.graphicContainer.beginPath();
        this.graphicContainer.setLineWidth(1);
        this.graphicContainer.setLineDash([5, 15]);
        this.graphicContainer.moveTo(previousControlPoint[XCOORDINATE], previousControlPoint[ZCOORDINATE]);
        this.graphicContainer.lineTo(controlPoint[XCOORDINATE], controlPoint[ZCOORDINATE]);
        this.graphicContainer.setStrokeStyle("#000000");
        this.graphicContainer.stroke();
    };
    RiverMap.prototype.checkAndSetOrigin = function (xCoordinate, yCoordinate) {
        if (Math.abs(yCoordinate - this.equatorDistance) <= 1) {
            vec2.set(this.origin, xCoordinate, yCoordinate);
        }
    };
    RiverMap.prototype.setOrigin = function () {
        this.equatorDistance = this.graphicContainer.canvas.height * (controlValues.bridgePosition / 100);
        this.trajectory.forEach(function (currentCurvePoint) {
            this.checkAndSetOrigin(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
        }, this);
    };
    RiverMap.prototype.drawFullCurve = function () {
        this.trajectory = this.bspline.getCurvePoints();
        this.graphicContainer.setLineWidth(5);
        this.graphicContainer.setLineDash([0, 0]);
        this.graphicContainer.beginPath();
        this.trajectory.forEach(function (currentCurvePoint, index) {
            if (index === 0) {
                this.graphicContainer.moveTo(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
            } else {
                this.graphicContainer.lineTo(currentCurvePoint.position[XCOORDINATE], currentCurvePoint.position[ZCOORDINATE]);
            }
        }, this);
        this.graphicContainer.setStrokeStyle("#0000FF");
        this.graphicContainer.stroke();
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
        this.graphicContainer.fillRect();
        this.drawFullCurve();
        this.drawControlGraph();
    };
}());
