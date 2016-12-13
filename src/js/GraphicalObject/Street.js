/*global SweptSurface, Calculator, TextureHandler, mat4, controlValues, vec3, Bspline, mat4, ModelViewMatrixStack, TOWERWIDTH, TOWERSCALEFACTOR, riverMap, vec2*/
var Street;
(function () {
    "use strict";
    Street = function (graphicContainer, riverRightSideLimit, riverLeftSideLimit, streetWidth) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.riverRightSideLimit = riverRightSideLimit;
        this.riverLeftSideLimit = riverLeftSideLimit;
        this.width = streetWidth;
        this.streetZPositionValue = ((controlValues.bridgePosition / 100) * 360) - (this.width / 2);
        this.levelGeometry = [];
        this.borderHeight = 0.25;
        this.createStreetLevelPoints();
        this.streetTrajectory = [];
        this.createStreetTrajectory();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.streetTexture = this.textureHandler.initializeTexture(["img/tramo-doblemarilla.jpg"]);
        this.streetNormalTexture = this.textureHandler.initializeTexture(["img/tramo-doblemarilla-normalmap.jpg"]);
        this.sideWalkTexture = this.textureHandler.initializeTexture(["img/vereda.jpg"]);
        this.sideWalkNormalTexture = this.textureHandler.initializeTexture(["img/vereda-normalmap.jpg"]);
        this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, this.streetTrajectory, 0.5, 1.5, true);
        this.createSideWalkLevelPoints();
        this.sideWalk = new SweptSurface(graphicContainer, this.levelGeometry, this.streetTrajectory, 3, 5, true);
        this.createLeftSideWalkLevelPoints();
        this.sideLeftWalk = new SweptSurface(graphicContainer, this.levelGeometry, this.streetTrajectory, 3, 5, true);
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
    Street.prototype.setBinormalTangentNormalValues = function (position, binormal) {
        var rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, Math.PI / 2, vec3.fromValues(0, 0, 1));
        var tangent = vec3.transformMat4(vec3.create(), binormal, rotationMatrix);
        var normal = vec3.cross(vec3.create(), tangent, binormal);
        this.levelGeometry.push({"position": position, "normal": normal, "tangent": tangent, "binormal": binormal});
    };
    Street.prototype.createStreetLevelPoints = function () {
        this.levelGeometry = [];
        var i;
        var binormal1 = vec3.fromValues(-1, 0, 0);
        var binormal2 = vec3.fromValues(0, -1, 0);
        var binormal3 = vec3.fromValues(1, 0, 0);
        var binormal4 = vec3.fromValues(0, 1, 0);
        var indexAmount = this.width / 0.15;
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal1);
        for (i = 1; i < indexAmount - 3; i += 1) {
            this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + (i * 0.15), this.borderHeight / 2, 0), binormal4);
        }
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + ((indexAmount - 4) * 0.15), this.borderHeight / 2, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + ((indexAmount - 4) * 0.15), 0, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + ((indexAmount - 4) * 0.15), 0, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, 0, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, 0, 0), binormal2);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal4);
    };
    Street.prototype.createLeftSideWalkLevelPoints = function () {
        this.levelGeometry = [];
        var binormal1 = vec3.fromValues(-1, 0, 0);
        var binormal2 = vec3.fromValues(0, -1, 0);
        var binormal3 = vec3.fromValues(1, 0, 0);
        var binormal4 = vec3.fromValues(0, 1, 0);
        var binormal6 = vec3.normalize(vec3.create(), vec3.fromValues(0.2 * this.width, this.borderHeight, 0));

        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal6);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal6);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal4);
        this.setBinormalTangentNormalValues(vec3.fromValues(-(TOWERWIDTH * TOWERSCALEFACTOR / 8), this.borderHeight, 0), binormal4);
        this.setBinormalTangentNormalValues(vec3.fromValues(-(TOWERWIDTH * TOWERSCALEFACTOR / 8), this.borderHeight, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues(-(TOWERWIDTH * TOWERSCALEFACTOR / 8), 0, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues(-(TOWERWIDTH * TOWERSCALEFACTOR / 8), 0, 0), binormal2);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, 0, 0), binormal2);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, 0, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues((TOWERWIDTH * TOWERSCALEFACTOR / 2) + 0.15, this.borderHeight / 2, 0), binormal6);
    };
    Street.prototype.createSideWalkLevelPoints = function () {
        this.levelGeometry = [];
        var rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, Math.PI / 2, vec3.fromValues(0, 0, 1));
        var binormal1 = vec3.fromValues(-1, 0, 0);
        var binormal2 = vec3.fromValues(0, -1, 0);
        var binormal3 = vec3.fromValues(1, 0, 0);
        var binormal4 = vec3.fromValues(0, 1, 0);
        var binormal6 = vec3.normalize(vec3.create(), vec3.fromValues(0.2 * this.width, this.borderHeight, 0));
        var binormal5 = vec3.transformMat4(vec3.create(), binormal6, rotationMatrix);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal4);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal5);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2) - 0.15, this.borderHeight / 2, 0), binormal5);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2) - 0.15, this.borderHeight / 2, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2) - 0.15, 0, 0), binormal1);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2) - 0.15, 0, 0), binormal2);

        this.setBinormalTangentNormalValues(vec3.fromValues(this.width + (TOWERWIDTH * TOWERSCALEFACTOR / 8), 0, 0), binormal2);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width + (TOWERWIDTH * TOWERSCALEFACTOR / 8), 0, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width + (TOWERWIDTH * TOWERSCALEFACTOR / 8), this.borderHeight, 0), binormal3);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width + (TOWERWIDTH * TOWERSCALEFACTOR / 8), this.borderHeight, 0), binormal4);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal4);
        this.setBinormalTangentNormalValues(vec3.fromValues(this.width - (TOWERWIDTH * TOWERSCALEFACTOR / 2), this.borderHeight, 0), binormal5);
    };
    Street.prototype.streetRiverLeftSide = function () {
        var x;
        var controlPoints = [];
        for (x = 0; x <= this.riverRightSideLimit + 30; x += 30) {
            controlPoints.push(vec3.fromValues(x, 0, this.streetZPositionValue));
            if ((x % 2 === 0) && (x !== 0)) {
                this.loadCurvePointsToTrajectory(controlPoints, true);
                controlPoints = [vec3.fromValues(x, 0, this.streetZPositionValue)];
            }
        }
    };
    Street.prototype.streetRiverRightSide = function () {
        var x;
        var controlPoints = [];
        for (x = this.riverLeftSideLimit; x <= 360; x += 30) {
            controlPoints.push(vec3.fromValues(x, 0, this.streetZPositionValue));
        }
        this.loadCurvePointsToTrajectory(controlPoints, true);
    };
    Street.prototype.createStreetTrajectory = function () {
        this.streetRiverLeftSide();
        this.streetInsideBridge();
        this.streetRiverRightSide();
    };
    Street.prototype.loadCurvePointsToTrajectory = function (controlPoints, interpolateExtreme) {
        var bSpline = new Bspline(controlPoints, 5, [0, 1, 0], interpolateExtreme);
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
            [xBegin + (2 * xStep), lastTrajectoryPointInserted[1] + controlValues.ph2 / 4, this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
        controlPoints = [[xBegin + (2 * xStep), lastTrajectoryPointInserted[1] + controlValues.ph2 / 4, this.streetZPositionValue],
            [xBegin + (3 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 2), this.streetZPositionValue],
            [xBegin + (4 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 4), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
        controlPoints = [[xBegin + (4 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 4), this.streetZPositionValue],
            [xBegin + (5 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 ), this.streetZPositionValue],
            [xBegin + (6 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
        controlPoints = [[xBegin + (6 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2), this.streetZPositionValue],
            [xBegin + (7 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2), this.streetZPositionValue],
            [xBegin + (8 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 4), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
        controlPoints = [[xBegin + (8 * xStep), lastTrajectoryPointInserted[1] + (3 * controlValues.ph2 / 4), this.streetZPositionValue],
            [xBegin + (9 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 2), this.streetZPositionValue],
            [xBegin + (10 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 4), this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
        controlPoints = [[xBegin + (10 * xStep), lastTrajectoryPointInserted[1] + (controlValues.ph2 / 4), this.streetZPositionValue],
            [xBegin + (11 * xStep), lastTrajectoryPointInserted[1], this.streetZPositionValue],
            [xBegin + (12 * xStep), lastTrajectoryPointInserted[1], this.streetZPositionValue]];
        this.loadCurvePointsToTrajectory(controlPoints, false);
    };
    Street.prototype.draw = function (modelViewMatrix) {
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
        //this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
        this.textureHandler.setTextureUniform(this.streetTexture);
        this.textureHandler.setTextureNormal(this.streetNormalTexture, this.streetTexture.length);
        this.sweptSurface.draw(modelViewMatrix);
        this.textureHandler.setTextureUniform(this.sideWalkTexture);
        this.textureHandler.setTextureNormal(this.sideWalkNormalTexture, this.sideWalkTexture.length);
        this.sideWalk.draw(modelViewMatrix);
        this.sideLeftWalk.draw(modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        //this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);
    };
}());