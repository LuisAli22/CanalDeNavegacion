/*global GraphicalObject, XCOORDINATE, YCOORDINATE, ZCOORDINATE, vec3, Calculator, SweptSurface*/
var Grass;
(function () {
    "use strict";
    Grass = function (graphicContainer, sandPositions, levelControlPointsAmount, grassLimit) {
        GraphicalObject.call(this, graphicContainer);
        this.sandPositions = sandPositions.slice(0);
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.grassLimit = grassLimit;
        this.grassVertexAmountInABank = 10;
        this.grassPositions = [];
        this.grassTangentNormalBinormalAndPositions = [];
        this.setUpBuffers();
    };
    Grass.prototype = Object.create(GraphicalObject.prototype);
    Grass.prototype.constructor = Grass;
    Grass.prototype.setUpBuffers = function () {
        var index;
        for (index = 0; index < this.sandPositions.length; index += 3) {
            if (this.isEdge(index)) {
                this.addBankPoints(index);
            }
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(this.grassPositions, this.grassTangentNormalBinormalAndPositions);
        var u = 0.0;
        var v = 0.0;
        var sectionSize = this.grassTangentNormalBinormalAndPositions.length / this.grassVertexAmountInABank;
        var vStep = 1 / (sectionSize - 1);
        var uStep = 1 / (this.grassVertexAmountInABank - 1);
        this.grassTangentNormalBinormalAndPositions.forEach(function (element, index) {
            u = (index % (this.grassVertexAmountInABank)) * uStep;
            v = Math.floor(index / this.grassVertexAmountInABank) * vStep;
            this.bufferList.position.push(element.position[XCOORDINATE], element.position[YCOORDINATE], element.position[ZCOORDINATE]);
            this.bufferList.tangent.push(element.tangent[XCOORDINATE], element.tangent[YCOORDINATE], element.tangent[ZCOORDINATE]);
            this.bufferList.normal.push(element.normal[XCOORDINATE], element.normal[YCOORDINATE], element.normal[ZCOORDINATE]);
            this.bufferList.binormal.push(element.binormal[XCOORDINATE], element.binormal[YCOORDINATE], element.binormal[ZCOORDINATE]);
            this.bufferList.texture_coord.push(u, v);
        }, this);
        this.loadIndexBufferData();
        this.bindBuffers();
    };
    Grass.prototype.loadIndexBufferData = function () {
        var trajectoryIndex;
        var levelIndex;
        var levelLength = this.grassVertexAmountInABank;
        var trajectoryLength = this.bufferList.position.length / (3 * this.grassVertexAmountInABank);
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
}());