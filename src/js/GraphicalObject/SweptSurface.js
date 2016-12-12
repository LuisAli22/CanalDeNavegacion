/*global GraphicalObject, vec3, TOWERSCALEFACTOR*/
var SweptSurface;
(function () {
    "use strict";
    SweptSurface = function (graphicContainer, levelPoints, trajectoryPoints, textureScale) {
        GraphicalObject.call(this, graphicContainer);
        this.levelPoints = levelPoints.slice(0);
        this.trajectoryPoints = trajectoryPoints.slice(0);
        this.textureScale = textureScale;
        if (textureScale === null) {
            this.textureScale = (1 / 16);
        }
        this.setUpBuffers();
    };
    SweptSurface.prototype = Object.create(GraphicalObject.prototype);
    SweptSurface.prototype.constructor = SweptSurface;
    SweptSurface.prototype.storePointPosition = function (trajectoryPoint, levelPoint) {
        var pointPosition = vec3.create();
        var productLevelXPositionAndBinormal = vec3.scale(vec3.create(), trajectoryPoint.binormal, levelPoint.position[0]);
        var productLevelYPositionAndNormal = vec3.scale(vec3.create(), trajectoryPoint.normal, levelPoint.position[1]);
        var scaleFactor = (-1) * levelPoint.position[2];
        var productLevelZPositionAndTangent = vec3.scale(vec3.create(), trajectoryPoint.tangent, scaleFactor);
        vec3.add(pointPosition, productLevelXPositionAndBinormal, vec3.add(vec3.create(), productLevelYPositionAndNormal, vec3.add(vec3.create(), productLevelZPositionAndTangent, trajectoryPoint.position)));
        this.bufferList.position.push(pointPosition[0], pointPosition[1], pointPosition[2]);
    };
    SweptSurface.prototype.storePointNormalAndBinormal = function (trajectoryPoint, levelPoint) {
        var pointNormal = vec3.create();
        var productLevelXNormalAndBinormal = vec3.scale(vec3.create(), trajectoryPoint.binormal, levelPoint.binormal[0]);
        var productLevelYNormalAndNormal = vec3.scale(vec3.create(), trajectoryPoint.normal, levelPoint.binormal[1]);
        var productLevelZNormalAndTangent = vec3.scale(vec3.create(), trajectoryPoint.tangent, levelPoint.binormal[2]);
        vec3.add(pointNormal, productLevelXNormalAndBinormal, vec3.add(vec3.create(), productLevelYNormalAndNormal, productLevelZNormalAndTangent));
        var normalNormalized = vec3.normalize(vec3.create(), pointNormal);
        this.bufferList.normal.push(normalNormalized[0], normalNormalized[1], normalNormalized[2]);

        var binormal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), normalNormalized, trajectoryPoint.tangent));
        this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
    };
    SweptSurface.prototype.loadPositionNormalBinormalTangentData = function (levelPoint, trajectoryPoint) {
        this.storePointPosition(trajectoryPoint, levelPoint);
        this.storePointNormalAndBinormal(trajectoryPoint, levelPoint);
        this.bufferList.tangent.push(trajectoryPoint.tangent[0], trajectoryPoint.tangent[1], trajectoryPoint.tangent[2]);
    };
    SweptSurface.prototype.setUpBuffers = function () {
        var u = 0.0;
        var vStep = 1 / (this.levelPoints.length - 1);
        this.trajectoryPoints.forEach(function (trajectoryPoint) {
            u += this.textureScale;
            this.levelPoints.forEach(function (levelPoint, levelIndex) {
                this.loadPositionNormalBinormalTangentData(levelPoint, trajectoryPoint);
                this.bufferList.texture_coord.push(levelIndex * vStep, u);
            }, this);
        }, this);
        this.loadIndexBufferData(this.levelPoints.length, this.trajectoryPoints.length);
        this.bindBuffers();
    };
    SweptSurface.prototype.getPositionBuffer = function () {
        return this.bufferList.position.slice(0);
    };
}());