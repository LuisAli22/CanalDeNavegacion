/*global SweptSurface, riverMap, vec3, Calculator, controlValues, TextureHandler, mat4, Tree, ModelViewMatrixStack*/
/*global TREEDIAMETER*/
var Basin;
(function () {
    "use strict";
    Basin = function (graphicContainer, riverWidth, levelControlPointsAmount, riverWidthStep) {
        this.graphicContainer = graphicContainer;
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.gl = graphicContainer.getContext();
        this.bottomRiverUnseted = true;
        this.bottomRiver = 0;
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.riverWidthStep = riverWidthStep;
        this.riverWidth = riverWidth;
        this.riverLevelGeometry = [];
        this.riverDepthStep = -2 * (controlValues.ph1) / this.levelControlPointsAmount;
        this.treesPositions = [];
        this.createRiverLevelPoints();
        this.sweptSurface = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, 1 / 25, 10, false);
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture(["img/arena.jpg"]);
        this.textureNormal = this.textureHandler.initializeTexture(["img/arena-normalmap.jpg"]);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.1, 0.1, 0.1];
        this.materialShininess = 4.0;
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
    Basin.prototype.createRandomTree = function (xCoordinate, y, z, lineNumber) {
        var coinValue = Math.floor((Math.random() * 110) + 1) - 1;
        var lineCoinValue = Math.floor((Math.random() * lineNumber) + 1) - 1;
        if ((coinValue >= 2 && coinValue <= 4) && (lineCoinValue <= (lineNumber * 0.2))) {
            this.treesPositions.push([xCoordinate, y, z]);
        }
    };
    Basin.prototype.setTreesPositions = function () {
        var positions = this.sweptSurface.getPositionBuffer();
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
    Basin.prototype.getLeftEdge = function () {
        var center = riverMap.getCurveCenter();
        return center[0] + (this.riverWidth);
    };
    Basin.prototype.getRightEdge = function () {
        var center = riverMap.getCurveCenter();
        return center[0] - (this.riverWidth);
    };
    Basin.prototype.recordYValueBottomRiver = function (y) {
        if (this.bottomRiverUnseted) {
            this.bottomRiver = y;
            this.bottomRiverUnseted = false;
        }
    };
    Basin.prototype.getBottomRiver = function () {
        return this.bottomRiver;
    };
    Basin.prototype.fillLeftSide = function () {
        var binormal = vec3.fromValues(0, 1, 0);
        var tangent = vec3.fromValues(1, 0, 0);
        var normal = vec3.cross(vec3.create(), tangent, binormal);
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = -180;
        this.grassLimit = -(this.riverWidth / 2);
        var xStep = (this.grassLimit - xCoordinate) / (this.levelControlPointsAmount - 1);
        for (controlPointIndex = 0; controlPointIndex < this.levelControlPointsAmount; controlPointIndex += 1) {
            currentPoint = vec3.fromValues(xCoordinate, 0, 0);
            this.riverLevelGeometry.push({
                "position": currentPoint,
                "binormal": binormal,
                "normal": normal,
                "tangent": tangent
            });
            xCoordinate += xStep;
        }
    };
    Basin.prototype.fillRightSide = function () {
        var binormal = vec3.fromValues(0, 1, 0);
        var tangent = vec3.fromValues(1, 0, 0);
        var normal = vec3.cross(vec3.create(), tangent, binormal);
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = this.riverWidth / 2;
        var xStep = (180 - xCoordinate) / (this.levelControlPointsAmount - 1);
        for (controlPointIndex = 0; controlPointIndex < this.levelControlPointsAmount; controlPointIndex += 1) {
            currentPoint = vec3.fromValues(xCoordinate, 0, 0);
            this.riverLevelGeometry.push({
                "position": currentPoint,
                "binormal": binormal,
                "normal": normal,
                "tangent": tangent
            });
            xCoordinate += xStep;
        }
    };
    Basin.prototype.fillRiverHole = function () {
        var rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, Math.PI / 2, vec3.fromValues(0, 0, 1));
        var binormal1 = vec3.fromValues(0.96152395, -0.27472113, -1);
        var binormal2 = vec3.transformMat4(vec3.create(), binormal1, rotationMatrix);
        var tangent = vec3.normalize(vec3.create(), binormal1);
        var normal = vec3.cross(vec3.create(), tangent, binormal2);
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = (-1 * this.riverWidth) / 2;
        var yCoordinate = 0;
        for (controlPointIndex = 0; controlPointIndex < this.levelControlPointsAmount; controlPointIndex += 1) {
            if (controlPointIndex === (this.levelControlPointsAmount / 2)) {
                currentPoint = vec3.clone(this.riverLevelGeometry[this.riverLevelGeometry.length - 1].position);
                currentPoint[0] *= (-1);
                xCoordinate = currentPoint[0];
                yCoordinate = currentPoint[1];
                this.recordYValueBottomRiver(yCoordinate);
                this.riverDepthStep *= (-1);
                binormal2[0] *= -1;
            } else {
                currentPoint = vec3.fromValues(xCoordinate, yCoordinate, 0);
            }
            this.riverLevelGeometry.push({
                "position": currentPoint,
                "binormal": binormal2,
                "normal": normal,
                "tangent": tangent
            });
            xCoordinate += ((controlPointIndex < 1) || (controlPointIndex > 5)) ? this.riverWidthStep / 4 : this.riverWidthStep;
            yCoordinate += 2 * this.riverDepthStep;
        }
    };
    Basin.prototype.createRiverLevelPoints = function () {
        this.fillLeftSide();
        this.fillRiverHole();
        this.fillRightSide();
    };
    Basin.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.textureHandler.setTextureNormal(this.textureNormal, this.texture.length);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
        //this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess);
        this.sweptSurface.draw(modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        //this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);

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
    };
    Basin.prototype.getPositionBuffer = function () {
        return this.sweptSurface.getPositionBuffer();
    };
}());