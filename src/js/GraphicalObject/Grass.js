/*global GraphicalObject, XCOORDINATE, YCOORDINATE, ZCOORDINATE, vec3, Calculator*/
var Grass;
(function () {
    "use strict";
    Grass = function (graphicContainer, sandPositions, levelControlPointsAmount, riverDepthStep, riverWidthStep) {
        GraphicalObject.call(this, graphicContainer);
        this.sandPositions = sandPositions.slice(0);
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.riverDepthStep = riverDepthStep;
        this.riverWidthStep = riverWidthStep;
        this.grassBottomLeft = -180;
        this.grassTopRight = 180;
        this.grassVertexAmountInABank = 10;
        this.vertexAmountByLineInX = (2 * this.grassVertexAmountInABank) + (levelControlPointsAmount - 1);
        this.vertexAmountByLineInZ = sandPositions.length / (3 * levelControlPointsAmount);
        this.grassGeometryPositions = [];
        this.grassGeometry = [];
        this.createVertexGrid();
        this.setUpBuffers();
    };
    Grass.prototype = Object.create(GraphicalObject.prototype);
    Grass.prototype.constructor = Grass;
    Grass.prototype.isLeftEdge = function (index) {
        return (index % (this.levelControlPointsAmount * 3) === 0);
    };
    Grass.prototype.isRightEdge = function (index) {
        return ((index + 3) % (this.levelControlPointsAmount * 3) === 0);
    };
    Grass.prototype.addLeftBankPoints = function (stepDistanceBetweenVertex, xCoordinate, index) {
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var xPosition;
        var currentPoint;
        if (stepDistanceBetweenVertex > 0) {
            for (xPosition = this.grassBottomLeft; xPosition <= xCoordinate; xPosition += stepDistanceBetweenVertex) {
                currentPoint = vec3.fromValues(xPosition, y, z);
                this.grassGeometryPositions.push(currentPoint);
            }
        }
    };
    Grass.prototype.addRightBankPoints = function (stepDistanceBetweenVertex, xCoordinate, index) {
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var xPosition;
        var currentPoint;
        if (stepDistanceBetweenVertex > 0) {
            for (xPosition = xCoordinate; xPosition <= this.grassTopRight; xPosition += stepDistanceBetweenVertex) {
                currentPoint = vec3.fromValues(xPosition, y, z);
                this.grassGeometryPositions.push(currentPoint);
            }
        }
    };
    Grass.prototype.createVertexGrid = function () {
        var stepDistanceBetweenVertex;
        var currentPoint = vec3.create();
        var index;
        var coordinateValue;
        for (index = 0; index < this.sandPositions.length; index += 3) {
            coordinateValue = this.sandPositions[index];
            if (this.isLeftEdge(index)) {
                stepDistanceBetweenVertex = ((coordinateValue - this.grassBottomLeft) / this.grassVertexAmountInABank);
                this.addLeftBankPoints(stepDistanceBetweenVertex, coordinateValue, index);
            } else {
                if (this.isRightEdge(index)) {
                    stepDistanceBetweenVertex = (this.grassTopRight - (coordinateValue)) / this.grassVertexAmountInABank;
                    this.addRightBankPoints(stepDistanceBetweenVertex, coordinateValue, index);
                } else {
                    currentPoint = vec3.fromValues(this.sandPositions[index], this.sandPositions[index + 1], this.sandPositions[index + 2]);
                    this.grassGeometryPositions.push(currentPoint);
                }
            }
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(this.grassGeometryPositions, this.grassGeometry);
    };
    Grass.prototype.loadIndexBufferData = function () {
        var trajectoryIndex;
        var levelIndex;
        var levelLength = this.vertexAmountByLineInX;
        var trajectoryLength = this.vertexAmountByLineInZ;
        for (trajectoryIndex = 0; trajectoryIndex < trajectoryLength - 1; trajectoryIndex += 1) {
            for (levelIndex = 0; levelIndex < levelLength - 1; levelIndex += 1) {
                this.bufferList.index.push(trajectoryIndex * levelLength + levelIndex);
                this.bufferList.index.push((trajectoryIndex + 1) * levelLength + (levelIndex + 1));
                this.bufferList.index.push(trajectoryIndex * levelLength + (levelIndex + 1));
                this.bufferList.index.push(trajectoryIndex * levelLength + levelIndex);
                this.bufferList.index.push((trajectoryIndex + 1) * levelLength + levelIndex);
                this.bufferList.index.push((trajectoryIndex + 1) * levelLength + (levelIndex + 1));
            }
        }
    };
    Grass.prototype.setUpBuffers = function () {
        var u = 0;
        var v = 0;
        var uStep = (1 / (this.vertexAmountByLineInX - 1));
        var vStep = (1 / (this.vertexAmountByLineInZ - 1));
        this.grassGeometry.forEach(function (element) {
            this.bufferList.position.push(element.position[0], element.position[1], element.position[2]);
            this.bufferList.normal.push(element.normal[0], element.normal[1], element.normal[2]);
            this.bufferList.tangent.push(element.tangent[0], element.tangent[1], element.tangent[2]);
            this.bufferList.binormal.push(element.binormal[0], element.binormal[1], element.binormal[2]);
            this.bufferList.texture_coord.push(u, v);
            u += uStep;
            v += vStep;
        }, this);
        this.loadIndexBufferData();
        this.bindBuffers();
    };
}());