/*global SweptSurface, riverMap, vec3, Calculator, controlValues, TextureHandler, mat4*/
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
        this.createRiverLevelPoints();
        this.sweptSurface = new SweptSurface(graphicContainer, this.riverLevelGeometry, riverMap.trajectory, null, false);
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture("img/arena.jpg");
        this.textureNormal = this.textureHandler.initializeTexture("img/arena-normalmap.jpg");
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.1, 0.1, 0.1];
        this.materialShininess = 4.0;
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
    Basin.prototype.getRiverLevelGeometry = function () {
        return this.riverLevelGeometry.slice(0);
    };
    Basin.prototype.createRiverLevelPoints = function () {
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
            xCoordinate += this.riverWidthStep;
            yCoordinate += this.riverDepthStep;
        }
    };
    Basin.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.textureHandler.setTextureNormal(this.textureNormal);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, 4);
        this.sweptSurface.draw(modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);
    };
    Basin.prototype.getPositionBuffer = function () {
        return this.sweptSurface.getPositionBuffer();
    };
}());