/*global SweptSurface, Calculator, TextureHandler, mat4, controlValues, vec3, Bspline, mat4, ModelViewMatrixStack*/
var Street;
(function () {
    "use strict";
    Street = function (graphicContainer, riverRightSideLimit, riverLeftSideLimit, streetWidth) {
        this.riverRightSideLimit = riverRightSideLimit;
        this.riverLeftSideLimit = riverLeftSideLimit;
        this.width = streetWidth;
        this.streetXCenter = 0;
        this.streetZPositionValue = ((controlValues.bridgePosition / 100) * 360) - (this.width / 2);
        this.streetLevelGeometry = [];
        this.borderHeight = 0.5;
        this.createStreetLevelPoints();
        this.streetTrajectory = [];
        this.createStreetTrajectory();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.streetTexture = this.textureHandler.initializeTexture("img/tramo-doblemarilla.jpg");
        this.sweptSurface = new SweptSurface(graphicContainer, this.streetLevelGeometry, this.streetTrajectory, null, false);
    };
    Street.prototype.getZPositionValue = function () {
        return this.streetZPositionValue;
    };
    Street.prototype.getBorderHeight = function () {
        return this.borderHeight;
    };
    Street.prototype.getTrajectory = function () {
        return this.streetTrajectory.slice(0);
    };
    Street.prototype.getWidth = function () {
        return this.width;
    };
    Street.prototype.getStreetXCenter = function () {
        return this.streetXCenter;
    };
    Street.prototype.createStreetLevelPoints = function () {
        var levelPointsPosition = [[0, 0, 0], [(3 / 10) * this.width, 0, 0], [this.width / 2, 0, 0], [(4 / 5) * this.width, 0, 0], [this.width, 0, 0], [this.width, this.borderHeight, 0], [(8 / 10) * this.width, this.borderHeight, 0], [(7 / 10) * this.width, this.borderHeight / 2, 0], [this.width / 2, this.borderHeight / 2, 0], [3 * this.width / 10, this.borderHeight / 2, 0], [2 * this.width / 10, this.borderHeight, 0], [0, this.borderHeight, 0], [0, 0, 0]];
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.streetLevelGeometry);
    };
    Street.prototype.streetRiverLeftSide = function () {
        var controlPoints = [];
        var x;
        for (x = 0; x <= this.riverRightSideLimit; x += 1) {
            controlPoints.push(vec3.fromValues(x, 0, this.streetZPositionValue));
        }
        this.loadCurvePointsToTrajectory(controlPoints);
    };
    Street.prototype.streetRiverRightSide = function () {
        var x;
        var controlPoints = [];
        for (x = this.riverLeftSideLimit; x <= 360; x += 1) {
            controlPoints.push(vec3.fromValues(x, 0, this.streetZPositionValue));
        }
        this.loadCurvePointsToTrajectory(controlPoints);
    };
    Street.prototype.createStreetTrajectory = function () {
        this.streetRiverLeftSide();
        this.streetInsideBridge();
        this.streetRiverRightSide();
    };
    Street.prototype.loadCurvePointsToTrajectory = function (controlPoints) {
        var bSpline = new Bspline(controlPoints, 5, [0, 1, 0]);
        var curvePoints = bSpline.getCurvePoints();
        curvePoints.forEach(function (element) {
            this.streetTrajectory.push(element);
        }, this);
    };
    Street.prototype.streetInsideBridge = function () {
        var xStep = (this.riverLeftSideLimit - this.riverRightSideLimit) / 12;
        var lastTrajectoryPointInserted = this.streetTrajectory[this.streetTrajectory.length - 1].position;
        var xBegin = lastTrajectoryPointInserted[0];
        var controlPoints = [[xBegin, lastTrajectoryPointInserted[1], lastTrajectoryPointInserted[2]],
            [xBegin + xStep, lastTrajectoryPointInserted[1], lastTrajectoryPointInserted[2]],
            [xBegin + (2 * xStep), lastTrajectoryPointInserted[1] + controlValues.ph2 / 40, this.streetZPositionValue],
            [xBegin + (3 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 20), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints);
        controlPoints = [[xBegin + (3 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 20), this.streetZPositionValue],
            [xBegin + (4 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 40), this.streetZPositionValue],
            [xBegin + (5 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 10), this.streetZPositionValue],
            [xBegin + (6 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 10), this.streetZPositionValue]];
        this.streetXCenter = xBegin + (6 * xStep);
        this.loadCurvePointsToTrajectory(controlPoints);
        controlPoints = [[xBegin + (6 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 10), this.streetZPositionValue],
            [xBegin + (7 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 10), this.streetZPositionValue],
            [xBegin + (8 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 40), this.streetZPositionValue],
            [xBegin + (9 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 20), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints);
        controlPoints = [[xBegin + (9 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 20), this.streetZPositionValue],
            [xBegin + (10 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 40), this.streetZPositionValue],
            [xBegin + (11 * xStep), lastTrajectoryPointInserted[1], this.streetZPositionValue],
            [xBegin + (12 * xStep), lastTrajectoryPointInserted[1], this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints);
    };
    Street.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.streetTexture);
        this.sweptSurface.draw(modelViewMatrix);
    };
}());