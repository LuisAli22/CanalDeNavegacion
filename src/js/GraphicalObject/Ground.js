/*global SweptSurface, vec3, Calculator, controlValues, YCOORDINATE, ZCOORDINATE, XCOORDINATE, GrassRightSide, ModelViewMatrixStack, GrassLeftSide, mat4, TextureHandler, WaterSurface, Street, Bridge*/
var Ground;
(function () {
    "use strict";
    Ground = function (graphicContainer, riverMap) {
        this.graphicContainer = graphicContainer;
        this.bottomRiverUnseted = true;
        this.levelControlPointsAmount = 8;
        this.riverWidth = 25;
        this.riverDepthStep = -2 * (controlValues.ph1) / this.levelControlPointsAmount;
        this.sandDistance = 2;
        this.grassVertexAmountInABank = 20;
        this.riverWidthStep = (this.riverWidth / this.levelControlPointsAmount);
        this.riverLevelGeometry = [];
        this.createRiverLevelPoints();
        this.waterLevelGeometry = [];
        this.createWaterLevelPoints();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.sandTexture = this.textureHandler.initializeTexture("img/sand.jpg");
        this.waterTexture = this.textureHandler.initializeTexture("img/water.jpg");
        this.sand = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, [0xff, 0xff, 0x66]);
        this.water = new SweptSurface(graphicContainer, this.waterLevelGeometry, riverMap.trajectory, [0x33, 0x99, 0xff]);
        this.grassRight = new GrassRightSide(graphicContainer, this.sand.getPositionBuffer(), this.levelControlPointsAmount, this.sandDistance);
        this.grassLeft = new GrassLeftSide(graphicContainer, this.sand.getPositionBuffer(), this.levelControlPointsAmount, this.sandDistance);
        this.street = new Street(graphicContainer, this.grassRight.getRiverIntersection(), this.grassLeft.getRiverIntersection());
        var xLeftSide = this.grassLeft.getRiverIntersection();
        var xRightSide = this.grassRight.getRiverIntersection();
        this.bridge = new Bridge(graphicContainer, this.bottomRiver, this.riverWidth, this.street, xLeftSide, xRightSide);
    };
    Ground.prototype.recordYValueBottomRiver = function (y) {
        if (this.bottomRiverUnseted) {
            this.bottomRiver = y;
            this.bottomRiverUnseted = false;
        }
    };
    Ground.prototype.createRiverLevelPoints = function () {
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = (-1 * this.riverWidth) / 2;
        var yCoordinate = 0;
        var levelPointsPosition = [];
        for (controlPointIndex = 0; controlPointIndex < this.levelControlPointsAmount; controlPointIndex += 1) {
            if (controlPointIndex === (this.levelControlPointsAmount / 2)) {
                currentPoint = vec3.clone(levelPointsPosition[levelPointsPosition.length - 1]);
                currentPoint[0] *= (-1);
                xCoordinate = currentPoint[0];
                yCoordinate = currentPoint[1];
                this.recordYValueBottomRiver(yCoordinate);
                this.riverDepthStep *= (-1);
            } else {
                currentPoint = vec3.fromValues(xCoordinate, yCoordinate, 0);
            }
            levelPointsPosition.push(currentPoint);
            xCoordinate += this.riverWidthStep;
            yCoordinate += this.riverDepthStep;
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.riverLevelGeometry);
    };
    Ground.prototype.createWaterLevelPoints = function () {
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = (-1 * this.riverWidth) / 2;
        var yCoordinate = -1;
        var levelPointsPosition = [];
        for (controlPointIndex = 0; controlPointIndex <= this.levelControlPointsAmount; controlPointIndex += 1) {
            currentPoint = vec3.fromValues(xCoordinate, yCoordinate, 0);
            levelPointsPosition.push(currentPoint);
            xCoordinate += this.riverWidthStep;
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.waterLevelGeometry);
    };
    Ground.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, -this.sandDistance, 0));
        this.textureHandler.setTextureUniform(this.sandTexture);
        this.sand.draw(modelViewMatrix);
        this.textureHandler.setTextureUniform(this.waterTexture);
        this.water.draw(modelViewMatrix);
        this.grassLeft.draw(modelViewMatrix);
        this.grassRight.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        this.street.draw(modelViewMatrix);
        this.bridge.draw(modelViewMatrix);
    };
}());
