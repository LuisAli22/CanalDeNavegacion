/*global SweptSurface, riverMap, vec3, Calculator, controlValues, TextureHandler, mat4, Tree, ModelViewMatrixStack*/
/*global TREEDIAMETER*/
var Basin;
(function () {
    "use strict";
    Basin = function (graphicContainer, riverWidth, levelControlPointsAmount, riverWidthStep) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.terrainShaderProgram = graphicContainer.getTerrainShaderProgram();
        this.bottomRiverUnseted = true;
        this.bottomRiver = 0;
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.riverWidthStep = riverWidthStep;
        this.riverWidth = riverWidth;
        this.riverLevelGeometry = [];
        this.riverDepthStep = -2 * (controlValues.ph1) / this.levelControlPointsAmount;
        this.createRiverLevelPoints();
        this.sweptSurface = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, 1, 1, false);
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.sandTexture = this.textureHandler.initializeTexture("img/arena.jpg");
        this.sandNormalTexture = this.textureHandler.initializeTexture("img/arena-normalmap.jpg");
        this.grassTexture = this.textureHandler.initializeTexture("img/pasto1.jpg");
        this.grassNormalTexture = this.textureHandler.initializeTexture("img/pasto1-normalmap.jpg");
        this.rockTexture = this.textureHandler.initializeTexture("img/rocas2.jpg");
        this.rockNormalTexture = this.textureHandler.initializeTexture("img/rocas2-normalmap.jpg");
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.1, 0.1, 0.1];
        this.materialShininess = 4.0;
    };
    Basin.prototype.getRiverWidth = function () {
        return this.riverWidth;
    };
    Basin.prototype.getLeftEdge = function () {
        var center = riverMap.getCurveCenter();
        return center[0] - (this.riverWidth);
    };
    Basin.prototype.getRightEdge = function () {
        var center = riverMap.getCurveCenter();
        return center[0] + (this.riverWidth);
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
            xCoordinate += this.riverWidthStep / 4;
            yCoordinate += 2 * this.riverDepthStep;
        }
    };
    Basin.prototype.createRiverLevelPoints = function () {
        this.fillLeftSide();
        this.fillRiverHole();
        this.fillRightSide();
    };
    Basin.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setSandTextureUniform(this.sandTexture);
        this.textureHandler.setSandNormalTextureUniform(this.sandNormalTexture);
        this.textureHandler.setGrassTextureUniform(this.grassTexture);
        this.textureHandler.setGrassNormalTextureUniform(this.grassNormalTexture);
        this.textureHandler.setRockTextureUniform(this.rockTexture);
        this.textureHandler.setRockNormalTextureUniform(this.rockNormalTexture);
        this.gl.uniform1i(this.terrainShaderProgram.useNormalMap, 1);
        this.gl.uniform1i(this.terrainShaderProgram.useDiffuseMap, 1);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess, true);
        this.sweptSurface.draw(modelViewMatrix);
        this.gl.uniform1i(this.terrainShaderProgram.useNormalMap, 0);
        this.gl.uniform1i(this.terrainShaderProgram.useDiffuseMap, 0);
    };
    Basin.prototype.getPositionBuffer = function () {
        return this.sweptSurface.getPositionBuffer();
    };
}());