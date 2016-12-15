/*global SweptSurface, vec3, Calculator, controlValues, YCOORDINATE, ZCOORDINATE, XCOORDINATE, GrassRightSide*/
/*global ModelViewMatrixStack, GrassLeftSide, mat4, TextureHandler, Water, Street, Bridge, Basin, Tree*/
var Ground;
(function () {
    "use strict";
    Ground = function (graphicContainer, basin) {
        this.graphicContainer = graphicContainer;
        this.basin = basin;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.riverWidth = basin.getRiverWidth();
        this.streetWidth = 4.5;
        this.water = new Water(this.graphicContainer, 360, 720, 360, 360, [360, 0, 180]);
        var xLeftSide = this.basin.getLeftEdge();
        var xRightSide = this.basin.getRightEdge();
        this.street = new Street(graphicContainer, xRightSide, xLeftSide, this.streetWidth);
        this.bridge = new Bridge(graphicContainer, this.basin.getBottomRiver(), this.riverWidth, this.street, xLeftSide, xRightSide);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [1.0, 1.0, 1.0];
        this.treesPositions = [];
        this.pointsPerSegment = 10;
        this.slices = 24;
        this.treeKindNumber = 4;
        var i;
        this.indexesTrees = [];
        this.trees = [];
        for (i = 0; i < this.treeKindNumber; i += 1) {
            this.indexesTrees.push(Math.floor(Math.random() * this.treeKindNumber));
            this.trees.push(new Tree(this.graphicContainer, this.slices, this.pointsPerSegment, true));
        }
        this.setTreesPositions();
    };
    Ground.prototype.createRandomTree = function (xCoordinate, y, z, lineNumber) {
        var coinValue = Math.floor((Math.random() * 110) + 1) - 1;
        var lineCoinValue = Math.floor((Math.random() * lineNumber) + 1) - 1;
        if ((coinValue >= 2 && coinValue <= 4) && (lineCoinValue <= (lineNumber * 0.2))) {
            this.treesPositions.push([xCoordinate, y, z]);
        }
    };
    Ground.prototype.setTreesPositions = function () {
        var positions = this.basin.getPositionBuffer();
        var i;
        var lineNumber = 1;
        for (i = 0; i < positions.length; i += 3) {
            if (i % 24 === 0 && i !== 0) {
                lineNumber += 1;
            }
            if ((positions[i + 1] === 0) && positions[i] > 0 && positions[i] < 360) {
                this.createRandomTree(positions[i], positions[i + 1], positions[i + 2], lineNumber);
            }
        }
    };
    Ground.prototype.getStreet = function () {
        return this.street;
    };
    Ground.prototype.draw = function (modelViewMatrix) {
        var i;
        var treePosition;
        var mvStack;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            treePosition = this.treesPositions[i];
            mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(treePosition[0], treePosition[1], treePosition[2]));
            this.trees[this.indexesTrees[i % this.treeKindNumber]].draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, mvStack.pop());
        }
        this.street.draw(modelViewMatrix);
        this.bridge.draw(modelViewMatrix);
        this.water.draw(modelViewMatrix);
    };
}());
