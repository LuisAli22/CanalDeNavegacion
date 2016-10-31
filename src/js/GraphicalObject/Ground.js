/*global SweptSurface, vec3, Calculator, controlValues, YCOORDINATE, ZCOORDINATE, XCOORDINATE, GrassRightSide, GrassLeftSide, Tree, mat4*/
var Ground;
(function () {
    "use strict";
    Ground = function (graphicContainer, riverMap, textureHandler, mvStack) {
        this.graphicContainer = graphicContainer;
        this.mvStack = mvStack;
        this.textureHandler = textureHandler;
        this.levelControlPointsAmount = 8;
        this.riverDepthStep = -10;
        this.sandDistance = -5;
        this.grassVertexAmountInABank = 10;
        this.slices = 24;
        this.pointsPerSegment = 10;
        this.treeScaleFactor = 3.00;
        this.treeLevel = -0.1;
        this.riverWidthStep = (controlValues.riverWidth / this.levelControlPointsAmount);
        this.riverLevelGeometry = [];
        this.createRiverLevelPoints();
        this.treesPositions = [[-5, 0, 0], [40, 0, -25], [15, 0, -35], [35, 0, 15], [-5, 0, 20], [-53, 0, -5],
            [0, 0, -20], [-18, 0, -12], [32, 0, -55], [40, 0, -50], [-40, 0, 50],
            [-28, 0, 52], [-45, 0, 55], [58, 0, 15], [50, 0, 25], [25, 0, 32], [20, 0, 35], [32, 0, 35]];
        this.trees = this.initTrees();
        this.sandTexture = textureHandler.initializeTexture("img/sand.jpg");
        this.sand = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, null);
        this.grassTexture = textureHandler.initializeTexture("img/grass.jpg");
        this.grassRight = new GrassRightSide(graphicContainer, this.sand.getPositionBuffer(), this.levelControlPointsAmount);
        this.grassLeft = new GrassLeftSide(graphicContainer, this.sand.getPositionBuffer(), this.levelControlPointsAmount);
    };
    Ground.prototype.initTrees = function () {
        var trees = [];
        var i;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            trees.push(new Tree(this.graphicContainer, this.slices, this.pointsPerSegment, true, this.mvStack, this.textureHandler));
        }
        return trees;
    };
    Ground.prototype.createRiverLevelPoints = function () {
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = (-1 * controlValues.riverWidth) / 2;
        var yCoordinate = 0;
        var levelPointsPosition = [];
        for (controlPointIndex = 0; controlPointIndex < this.levelControlPointsAmount; controlPointIndex += 1) {
            if (controlPointIndex === (this.levelControlPointsAmount / 2)) {
                currentPoint = vec3.clone(levelPointsPosition[levelPointsPosition.length - 1]);
                currentPoint[0] *= (-1);
                xCoordinate = currentPoint[0];
                yCoordinate = currentPoint[1];
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
    Ground.prototype.draw = function (modelViewMatrix) {
        this.mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, this.sandDistance, 0));
        var i;
        var treePosition;
        this.textureHandler.setTextureUniform(this.sandTexture);
        this.sand.draw(modelViewMatrix);
        this.textureHandler.setTextureUniform(this.grassTexture);
        this.grassRight.draw(modelViewMatrix);
        this.grassLeft.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, this.mvStack.pop());
        for (i = 0; i < this.treesPositions.length; i += 1) {
            treePosition = this.treesPositions[i];
            this.mvStack.push(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(treePosition[0], this.treeLevel * this.treeScaleFactor, treePosition[2]));
            mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.treeScaleFactor, this.treeScaleFactor, this.treeScaleFactor));
            this.trees[i].draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, this.mvStack.pop());
        }
    };
}());
