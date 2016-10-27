/*global GraphicalObject, vec3, jQuery*/
var Cylinder;
(function () {
    "use strict";
    Cylinder = function (graphicContainer, slices, height, textureStep) {
        GraphicalObject.call(this, graphicContainer);
        if (textureStep === null) {
            this.textureStep = 6;
        } else {
            this.textureStep = textureStep;
        }
        this.setUpBuffers(slices, height);
    };
    Cylinder.prototype = Object.create(GraphicalObject.prototype);
    Cylinder.prototype.constructor = Cylinder;
    Cylinder.prototype.setUpBuffers = function (slices, height) {
        this.loadBuffers(slices, height);
        this.bindBuffers();
    };
    Cylinder.prototype.loadIndexBuffer = function (height, slices, currentSlice) {
        if (height === 0) {
            this.bufferList.index.push(0, currentSlice, currentSlice + 1);
        } else {
            this.bufferList.index.push(slices + 2, slices + 2 + currentSlice, slices + 2 + currentSlice + 1);
        }
    };
    Cylinder.prototype.loadLid = function (slices, angle, height) {
        var k = 1;
        if (height === 0) {
            k = -1;
        }
        this.bufferList.position.push(0, height, 0);
        this.bufferList.texture_coord.push(0, 0);
        this.bufferList.normal.push(0, k, 0);
        this.bufferList.binormal.push(k, 0, 0);
        this.bufferList.tangent.push(0, 0, k);
        var currentSlice;
        var position;
        var normal;
        var binormal;
        var tangent;
        for (currentSlice = 0; currentSlice <= slices; currentSlice += 1) {
            position = [Math.sin(angle * currentSlice), height, Math.cos(angle * currentSlice)];
            normal = [0.0, k, 0.0];
            binormal = vec3.normalize([], position);
            tangent = vec3.normalize([], vec3.cross([], binormal, normal));

            this.bufferList.texture_coord.push(position[0], position[2]);
            this.bufferList.position.push(position[0], position[1], position[2]);
            this.bufferList.normal.push(normal[0], normal[1], normal[2]);
            this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
            this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
            if (currentSlice > 0) {
                this.loadIndexBuffer(height, slices, currentSlice);
            }
        }
    };
    Cylinder.prototype.loadPositionAndIndexData = function (currentPoint, nextPoint, currentPointTop, nextPointTop) {
        var firstIndexId = this.bufferList.position.length / 3;
        var secondIndexId = (this.bufferList.position.push(currentPoint.x, currentPoint.y, currentPoint.z)) / 3;
        var thirdIndexId = (this.bufferList.position.push(nextPoint.x, nextPoint.y, nextPoint.z)) / 3;
        var fourthIndexId = (this.bufferList.position.push(currentPointTop.x, currentPointTop.y, currentPointTop.z)) / 3;
        this.bufferList.position.push(nextPointTop.x, nextPointTop.y, nextPointTop.z);
        this.bufferList.index.push(firstIndexId, secondIndexId, thirdIndexId);
        this.bufferList.index.push(secondIndexId, thirdIndexId, fourthIndexId);
    };
    Cylinder.prototype.loadTexture = function (i, slices) {
        this.bufferList.texture_coord.push(0, i / slices * this.textureStep);
        this.bufferList.texture_coord.push(0, (i + 1) / slices * this.textureStep);
        this.bufferList.texture_coord.push(1, i / slices * this.textureStep);
        this.bufferList.texture_coord.push(1, (i + 1) / slices * this.textureStep);
    };
    Cylinder.prototype.loadNormalBinormalAndTangent = function (currentPoint, nextPoint) {
        var n1 = [currentPoint.x, currentPoint.y, currentPoint.z];
        var n2 = [nextPoint.x, nextPoint.y, nextPoint.z];
        this.bufferList.normal.push(n1[0], n1[1], n1[2]);
        this.bufferList.normal.push(n2[0], n2[1], n2[2]);
        this.bufferList.normal.push(n1[0], n1[1], n1[2]);
        this.bufferList.normal.push(n2[0], n2[1], n2[2]);

        this.bufferList.binormal.push(0.0, 1.0, 0.0);
        this.bufferList.binormal.push(0.0, 1.0, 0.0);
        this.bufferList.binormal.push(0.0, 1.0, 0.0);
        this.bufferList.binormal.push(0.0, 1.0, 0.0);

        var t1 = vec3.cross([], n1, [0.0, 1.0, 0.0]);
        var t2 = vec3.cross([], n1, [0.0, 1.0, 0.0]);

        this.bufferList.tangent.push(t1[0], t1[1], t1[2]);
        this.bufferList.tangent.push(t2[0], t2[1], t2[2]);
        this.bufferList.tangent.push(t1[0], t1[1], t1[2]);
        this.bufferList.tangent.push(t2[0], t2[1], t2[2]);
    };
    Cylinder.prototype.loadBuffers = function (slices, height) {
        var angle = (2 * Math.PI) / slices;
        this.loadLid(slices, angle, 0);
        this.loadLid(slices, angle, height);
        var i;
        var currentPoint;
        var nextPoint;
        var currentPointTop;
        var nextPointTop;
        for (i = 0; i < slices; i += 1) {
            currentPoint = {"x": Math.sin(angle * i), "y": 0, "z": Math.cos(angle * i)};
            currentPointTop = jQuery.extend(true, {}, currentPoint);
            currentPointTop.y = height;
            nextPoint = {"x": Math.sin(angle * (i + 1)), "y": 0, "z": Math.cos(angle * (i + 1))};
            nextPointTop = jQuery.extend(true, {}, nextPoint);
            nextPointTop.y = height;
            this.loadPositionAndIndexData(currentPoint, nextPoint, currentPointTop, nextPointTop);
            this.loadTexture(i, slices);
            this.loadNormalBinormalAndTangent(currentPoint, nextPoint);
        }
    };
}());