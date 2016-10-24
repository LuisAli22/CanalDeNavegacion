/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline, TwoDimensionShapeContainer, FARFROMANYCONTROLPOINT*/
/*global CLICKDISTANCESENSITIVENESS, YCOORDINATE, XCOORDINATE, ControlPoints*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        AnimationFrame.call(this);
        this.trajectory = [];
        this.riverMapGraphicContainer = new RiverMapGraphicContainer(this);
        this.controlSegmentAmount = 5;
        this.controlPointsAmount = 3 * this.controlSegmentAmount + 1;
        this.setControlPoints();
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.prototype.constructor = RiverMap;
    RiverMap.prototype.getIndex = function (position) {
        if (position < 2) {
            return 0;
        }
        if ((position - 2) < (this.controlPointsAmount)) {
            return (position - 2);
        }
        return (this.controlPointsAmount - 1);
    };
    RiverMap.prototype.setControlPoints = function () {
        var controlPoints = ControlPoints.getInstance();
        var index;
        for (index = 0; index < this.controlPointsAmount; index += 1) {
            controlPoints.setPointCoordinate(2 * index, this.riverMapGraphicContainer.getXPositionValue(index));
            controlPoints.setPointCoordinate((2 * index) + 1, this.riverMapGraphicContainer.getYPositionValue(index, this.controlSegmentAmount));
        }
    };
    RiverMap.prototype.clikedPointIsNotOneOfTheExtreme = function (index, controlPointsLength) {
        return ((index !== 0) && (index !== controlPointsLength - 2));
    };
    RiverMap.prototype.getControlPointClicked = function (initialPosition) {
        var index;
        var controlPoint = vec2.create();
        var distance = 0;
        var controlPoints = ControlPoints.getInstance();
        var controlPointsLength = controlPoints.length();
        for (index = 0; index < controlPointsLength; index += 2) {
            vec2.set(controlPoint, controlPoints.getPointCoordinate(index), controlPoints.getPointCoordinate(index + 1));
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
            var controlPoints = ControlPoints.getInstance();
            controlPoints.setPointCoordinate(clickedPointIndex, endPosition[XCOORDINATE]);
            controlPoints.setPointCoordinate(clickedPointIndex + 1, endPosition[YCOORDINATE]);
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
    RiverMap.prototype.storeCurvePointIn3DTrajectory = function (curvePoint) {
        this.trajectory.push(curvePoint.x);
        this.trajectory.push(curvePoint.y);
        this.trajectory.push(0);
    };
    RiverMap.prototype.drawCurrrentCurve = function (xControlPoints, yControlPoints) {
        var bSpline = Bspline.getInstance();
        bSpline.multiplyMatrixAndControlPoints(xControlPoints, yControlPoints);
        this.riverMapGraphicContainer.setLineWidth(5);
        this.riverMapGraphicContainer.setLineDash([0, 0]);
        this.riverMapGraphicContainer.beginPath();
        var u;
        var curvePoint;
        var deltaU = 0.01;
        for (u = 0; u <= 1.001; u = u + deltaU) {
            curvePoint = bSpline.getCurvePoint(u);
            if (u % 0.05 === 0) {
                this.storeCurvePointIn3DTrajectory(curvePoint);
            }
            if (u === 0) {
                this.riverMapGraphicContainer.moveTo(curvePoint.x, curvePoint.y);
            }
            this.riverMapGraphicContainer.lineTo(curvePoint.x, curvePoint.y);
        }
        this.riverMapGraphicContainer.setStrokeStyle("#0000FF");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.drawControlPoints = function (controlPoint) {
        this.riverMapGraphicContainer.beginPath();
        this.riverMapGraphicContainer.arc(controlPoint.x, controlPoint.y, CLICKDISTANCESENSITIVENESS, 0, 2 * Math.PI);
        this.riverMapGraphicContainer.setLineWidth(1);
        this.riverMapGraphicContainer.setLineDash([0, 0]);
        this.riverMapGraphicContainer.setStrokeStyle("#000000");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.drawControlGraphSegment = function (previousControlPoint, controlPoint) {
        this.riverMapGraphicContainer.beginPath();
        this.riverMapGraphicContainer.setLineWidth(1);
        this.riverMapGraphicContainer.setLineDash([5, 15]);
        this.riverMapGraphicContainer.moveTo(previousControlPoint.x, previousControlPoint.y);
        this.riverMapGraphicContainer.lineTo(controlPoint.x, controlPoint.y);
        this.riverMapGraphicContainer.setStrokeStyle("#000000");
        this.riverMapGraphicContainer.stroke();
    };
    RiverMap.prototype.drawFullCurve = function () {
        var curveBsplineIdentifiers = this.createCurveIdentifiers();
        var controlPoints = ControlPoints.getInstance();
        var xControlPoints = vec4.create();
        var yControlPoints = vec4.create();
        var slidingWindow = vec4.create();
        curveBsplineIdentifiers.forEach(function (curveIdentifier) {
            vec4.set(slidingWindow, this.getIndex(curveIdentifier), this.getIndex(curveIdentifier + 1), this.getIndex(curveIdentifier + 2), this.getIndex(curveIdentifier + 3));
            slidingWindow.forEach(function (element, index) {
                xControlPoints[index] = controlPoints.getPointCoordinate(2 * element);
                yControlPoints[index] = controlPoints.getPointCoordinate((2 * element) + 1);
            }, this);
            this.drawCurrrentCurve(xControlPoints, yControlPoints);
        }, this);
    };
    RiverMap.prototype.drawControlGraph = function () {
        var controlPoints = ControlPoints.getInstance();
        var index;
        var currentControlPoint;
        var previousPoint;
        var controlPointsLength = controlPoints.length();
        for (index = 0; index < controlPointsLength; index += 2) {
            currentControlPoint = {
                "x": controlPoints.getPointCoordinate(index),
                "y": controlPoints.getPointCoordinate(index + 1)
            };
            this.drawControlPoints(currentControlPoint);
            if (index > 0) {
                previousPoint = {
                    "x": controlPoints.getPointCoordinate(index - 2),
                    "y": controlPoints.getPointCoordinate(index - 1)
                };
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
