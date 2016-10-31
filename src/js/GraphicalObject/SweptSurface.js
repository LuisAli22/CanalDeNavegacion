/*global GraphicalObject, vec3*/
var SweptSurface;
(function () {
    "use strict";
    SweptSurface = function (graphicContainer, levelPoints, trajectoryPoints) {
        GraphicalObject.call(this, graphicContainer);
        this.levelPoints = levelPoints.slice(0);
        this.trajectoryPoints = trajectoryPoints.slice(0);
        this.setUpBuffers();
    };
    SweptSurface.prototype = Object.create(GraphicalObject.prototype);
    SweptSurface.prototype.constructor = SweptSurface;
    SweptSurface.prototype.storePointPosition = function (trajectoryPoint, levelPoint) {
        var pointPosition = vec3.create();
        var productLevelXPositionAndBinormal = vec3.scale(vec3.create(), trajectoryPoint.binormal, levelPoint.position[0]);
        var productLevelYPositionAndNormal = vec3.scale(vec3.create(), trajectoryPoint.normal, levelPoint.position[1]);
        var productLevelZPositionAndTangent = vec3.scale(vec3.create(), trajectoryPoint.tangent, (-1) * levelPoint.position[2]);
        vec3.add(pointPosition, productLevelXPositionAndBinormal, vec3.add(vec3.create(), productLevelYPositionAndNormal, vec3.add(vec3.create(), productLevelZPositionAndTangent, trajectoryPoint.position)));
        this.bufferList.position.push(pointPosition[0], pointPosition[1], pointPosition[2]);
    };
    SweptSurface.prototype.storePointNormalAndBinormal = function (trajectoryPoint, levelPoint) {
        var pointNormal = vec3.create();
        var productLevelXNormalAndBinormal = vec3.scale(vec3.create(), trajectoryPoint.binormal, levelPoint.normal[0]);
        var productLevelYNormalAndNormal = vec3.scale(vec3.create(), trajectoryPoint.normal, levelPoint.normal[1]);
        var productLevelZNormalAndTangent = vec3.scale(vec3.create(), trajectoryPoint.tangent, levelPoint.normal[2]);
        vec3.add(pointNormal, productLevelXNormalAndBinormal, vec3.add(vec3.create(), productLevelYNormalAndNormal, productLevelZNormalAndTangent));
        vec3.normalize(pointNormal, pointNormal);
        this.bufferList.normal.push(pointNormal[0], pointNormal[1], pointNormal[2]);

        var binormal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), pointNormal, trajectoryPoint.tangent));
        this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
    };
    SweptSurface.prototype.loadPositionNormalBinormalTangentData = function (levelPoint, trajectoryPoint) {
        this.storePointPosition(trajectoryPoint, levelPoint);
        this.storePointNormalAndBinormal(trajectoryPoint, levelPoint);
        this.bufferList.tangent.push(trajectoryPoint.tangent[0], trajectoryPoint.tangent[1], trajectoryPoint.tangent[2]);
    };
    SweptSurface.prototype.loadIndexBufferData = function () {
        var trajectoryIndex;
        var levelIndex;
        var levelLength = this.levelPoints.length;
        var trajectoryLength = this.trajectoryPoints.length;
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
    SweptSurface.prototype.setUpBuffers = function () {
        var u = 0.0;
        var v = 0.0;
        var uStep = 1 / (this.trajectoryPoints.length - 1);
        var vStep = 1 / (this.levelPoints.length - 1);
        this.trajectoryPoints.forEach(function (trajectoryPoint, trajectoryIndex) {
            u = trajectoryIndex * uStep;
            this.levelPoints.forEach(function (levelPoint, levelIndex) {
                this.loadPositionNormalBinormalTangentData(levelPoint, trajectoryPoint, u);
                v = levelIndex * vStep;
                this.bufferList.texture_coord.push(u, v);
            }, this);
        }, this);
        this.loadIndexBufferData();
        this.bindBuffers();
    };
    SweptSurface.prototype.getPositionBuffer = function () {
        return this.bufferList.position.slice(0);
    };
}());