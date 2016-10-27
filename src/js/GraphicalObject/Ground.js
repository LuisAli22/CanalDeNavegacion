/*global SweptSurface, vec3, Calculator, controlValues, YCOORDINATE, XCOORDINATE*/
var Ground;
(function () {
    "use strict";
    Ground = function (graphicContainer, riverMap, textureHandler) {
        this.textureHandler = textureHandler;
        this.sandDistance = -5;
        this.riverLevelGeometry = [];
        this.grassLevelGeometry = [];
        this.createRiverLevelPoints();
        this.createGrassLevelPoints();
        this.sandTexture = textureHandler.initializeTexture("img/sand.jpg");
        this.sand = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, null);
        this.grassTexture = textureHandler.initializeTexture("img/grass.jpg");
        this.grass = new SweptSurface(graphicContainer, this.grassLevelGeometry, riverMap.trajectory, null);
    };
    Ground.prototype.createGrassLevelPoints = function () {

        var levelPointsPosition = [];
        var firstPoint = vec3.clone(this.riverLevelGeometry[0].position);
        firstPoint[XCOORDINATE] += this.sandDistance;
        firstPoint[YCOORDINATE] += (-1) * this.sandDistance;
        levelPointsPosition.push(firstPoint);
        var riverLevelLength = this.riverLevelGeometry.length;
        var previousPoint;
        this.riverLevelGeometry.forEach(function (element, index) {
            if (index > 0) {
                var currentPoint = vec3.clone(element.position);
                if ((index === 1) || (index === riverLevelLength - 2)) {
                    levelPointsPosition.push(currentPoint);
                } else {
                    previousPoint[YCOORDINATE] += this.sandDistance;
                    levelPointsPosition.push(previousPoint);
                }
                previousPoint = vec3.clone(currentPoint);
            }
        }, this);
        var lastPoint = vec3.clone(this.riverLevelGeometry[riverLevelLength - 1].position);
        lastPoint[XCOORDINATE] += (-1) * this.sandDistance;
        lastPoint[YCOORDINATE] += (-1) * this.sandDistance;
        levelPointsPosition.push(lastPoint);
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.grassLevelGeometry);
    };
    Ground.prototype.createRiverLevelPoints = function () {
        var levelControlPointsAmount = 8;
        var controlPointIndex;
        var currentPoint;
        var riverWidthStep = controlValues.riverWidth / levelControlPointsAmount;
        var riverDepthStep = -10;
        var xCoordinate = (-1 * controlValues.riverWidth) / 2;
        var yCoordinate = this.sandDistance;
        var levelPointsPosition = [];
        for (controlPointIndex = 0; controlPointIndex < levelControlPointsAmount; controlPointIndex += 1) {
            if (controlPointIndex === (levelControlPointsAmount / 2)) {
                currentPoint = vec3.clone(levelPointsPosition[levelPointsPosition.length - 1]);
                currentPoint[0] *= (-1);
                xCoordinate = currentPoint[0];
                yCoordinate = currentPoint[1];
                riverDepthStep *= (-1);
            } else {
                currentPoint = vec3.fromValues(xCoordinate, yCoordinate, 0);
            }
            levelPointsPosition.push(currentPoint);
            xCoordinate += riverWidthStep;
            yCoordinate += riverDepthStep;
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.riverLevelGeometry);
    };
    Ground.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.sandTexture);
        this.sand.draw(modelViewMatrix);
        this.textureHandler.setTextureUniform(this.grassTexture);
        this.grass.draw(modelViewMatrix);
    };
}());
