/*global SweptSurface, Calculator, mat4, vec3, ModelViewMatrixStack, GraphicalObject, TOWERSCALEFACTOR*/
var TowerBody;
(function () {
    "use strict";
    TowerBody = function (graphicContainer, height, uTextureScale, vTextureScale) {
        GraphicalObject.call(this, graphicContainer);
        this.height = height;
        this.uTextureScale = uTextureScale;
        this.vTextureScale = vTextureScale;
        this.xCenter = 0.5;
        this.zCenter = 0.5;
        this.initBuffers();
    };
    TowerBody.prototype = Object.create(GraphicalObject.prototype);
    TowerBody.prototype.constructor = TowerBody;
    TowerBody.prototype.createLevelPoints = function (scaleFactor) {
        var calculator = Calculator.getInstance();
        var levelGeometry = calculator.towerMainLevelGeometry();
        if (scaleFactor !== 1) {
            levelGeometry.forEach(function (levelPoint) {
                levelPoint[0] = levelPoint[0] * scaleFactor + ((1 - scaleFactor) / 2);
                levelPoint[2] = levelPoint[2] * scaleFactor + ((1 - scaleFactor) / 2);
            }, this);
        }
        return levelGeometry.slice(0);
    };
    TowerBody.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-this.xCenter, 0, -this.zCenter));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(1, this.height, 1));
        GraphicalObject.prototype.draw.call(this, modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    TowerBody.prototype.getScaleFactor = function () {
        return 1;
    };
    TowerBody.prototype.initBuffers = function () {
        var calculator = Calculator.getInstance();
        var levelGeometry = [];
        this.profilePointNumbers = [0, 1, 2, 3];
        this.profilePointNumbers.forEach(function (profilePointNumber) {
            var scaleFactor = this.getScaleFactor(profilePointNumber);
            levelGeometry = this.createLevelPoints(scaleFactor);
            levelGeometry.forEach(function (levelPoint, levelPointIndex) {
                this.bufferList.position.push(levelPoint[0], levelPoint[1] + (profilePointNumber / (this.profilePointNumbers.length - 1)), levelPoint[2]);
                this.bufferList.texture_coord.push(this.uTextureScale * levelPointIndex, this.vTextureScale * profilePointNumber);
            }, this);
        }, this);
        this.profilePointNumbers.forEach(function (profilePointNumber) {
            levelGeometry.forEach(function (levelPoint, levelPointIndex) {
                if (levelPointIndex < levelGeometry.length - 1) {
                    var v = calculator.calculateNormalFromNeighbors(levelPointIndex, profilePointNumber, this.bufferList.position, levelGeometry.length, this.profilePointNumbers.length, true);
                    var binormal = v[0];
                    var normal = v[1];
                    var tangent = v[2];
                    this.bufferList.normal.push(-normal[0], -normal[1], -normal[2]);
                    this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
                    this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
                }
            }, this);
            var pos = this.bufferList.normal.length - (levelGeometry.length - 1) * 3;
            this.bufferList.normal.push(this.bufferList.normal[pos], this.bufferList.normal[pos + 1], this.bufferList.normal[pos + 2]);
            this.bufferList.binormal.push(this.bufferList.binormal[pos], this.bufferList.binormal[pos + 1], this.bufferList.binormal[pos + 2]);
            this.bufferList.tangent.push(this.bufferList.tangent[pos], this.bufferList.tangent[pos + 1], this.bufferList.tangent[pos + 2]);
        }, this);
        this.loadIndexBufferData(levelGeometry.length, this.profilePointNumbers.length);
        this.bindBuffers();
    };
}());