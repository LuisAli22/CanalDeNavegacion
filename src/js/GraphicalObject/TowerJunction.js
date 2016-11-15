/*global GraphicalObject, vec3, TOWERSCALEFACTOR, TextureHandler, Calculator, ModelViewMatrixStack, mat4, TOWERWIDTH*/
var TowerJunction;
(function () {
    "use strict";
    TowerJunction = function (graphicContainer, color) {
        GraphicalObject.call(this, graphicContainer);
        this.color = color;
        this.height = 0.2;
        this.setUpBuffers();
    };
    TowerJunction.prototype = Object.create(GraphicalObject.prototype);
    TowerJunction.prototype.constructor = TowerJunction;
    TowerJunction.prototype.setUpBuffers = function () {
        var i;
        var x;
        var y;
        var calculator = Calculator.getInstance();
        this.bufferList.position = calculator.towerMainLevelGeometry(false);
        var temporaryLength = this.bufferList.position.length;
        for (i = 0; i < temporaryLength; i += 3) {
            x = this.bufferList.position[i] * TOWERSCALEFACTOR + (1 / 5);
            y = this.bufferList.position[i + 1] * TOWERSCALEFACTOR + (1 / 5);
            this.bufferList.position.push(x, y, this.height);
        }
        var levelPointAmount = this.bufferList.position.length / 2;
        var tangent;
        var currentPosition;
        var nextPoint;
        var normal;
        var binormal;
        var currentPositionLevel1;
        var u = 0;
        var v = 0;
        var uStep = 1 / (levelPointAmount - 1);
        var index;
        for (i = 0; i < levelPointAmount; i += 3) {
            currentPosition = vec3.fromValues(this.bufferList.position[i], this.bufferList.position[i + 1], this.bufferList.position[i + 2]);
            currentPositionLevel1 = vec3.fromValues(this.bufferList.position[i + levelPointAmount], this.bufferList.position[i + levelPointAmount + 1], this.bufferList.position[i + levelPointAmount + 2]);
            tangent = vec3.normalize(vec3.create(), vec3.add(vec3.create(), currentPositionLevel1, vec3.scale(vec3.create(), currentPosition, -1)));
            nextPoint = vec3.fromValues(this.bufferList.position[(i % (levelPointAmount - 3)) + 3], this.bufferList.position[(i % (levelPointAmount - 3)) + 4], this.bufferList.position[(i % (levelPointAmount - 3)) + 5]);
            normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), tangent, nextPoint));
            binormal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), tangent, normal));
            this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
            this.bufferList.normal.push(normal[0], normal[1], normal[2]);
            this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
            this.bufferList.color.push(this.color[0], this.color[1], this.color[2]);
            this.bufferList.texture_coord.push(u, v);
            u = i * uStep;
        }
        tangent = this.bufferList.tangent.slice(0);
        normal = this.bufferList.normal.slice(0);
        binormal = this.bufferList.binormal.slice(0);
        u = 0;
        v = 1;
        uStep = 1 / (this.bufferList.position.length - 1);
        for (i = levelPointAmount; i < this.bufferList.position.length; i += 3) {
            index = (i % levelPointAmount);
            this.bufferList.tangent.push(tangent[index], tangent[index + 1], tangent[index + 2]);
            this.bufferList.normal.push(normal[index], normal[index + 1], normal[index + 2]);
            this.bufferList.binormal.push(binormal[index], binormal[index + 1], binormal[index + 2]);
            this.bufferList.color.push(this.color[0], this.color[1], this.color[2]);
            this.bufferList.texture_coord.push(u, v);
            u = i * uStep;
        }
        this.loadIndexData((levelPointAmount - 3) / 3, 2);
        this.bindBuffers();
    };
    TowerJunction.prototype.loadIndexData = function (nz, nx) {
        var i;
        var j;
        for (i = 0; i < nx - 1; i += 1) {
            for (j = 0; j < nz; j += 1) {
                this.bufferList.index.push(i * nz + j);
                this.bufferList.index.push((i + 1) * nz + (j + 1) + 1);
                this.bufferList.index.push(i * nz + (j + 1));
                this.bufferList.index.push(i * nz + j);
                this.bufferList.index.push((i + 1) * nz + j + 1);
                this.bufferList.index.push((i + 1) * nz + (j + 1) + 1);
            }
        }
    };
    TowerJunction.prototype.getHeight = function () {
        return this.height;
    };
    TowerJunction.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-TOWERWIDTH, 0, 0));
        mat4.rotateX(modelViewMatrix, modelViewMatrix, -Math.PI / 2);
        GraphicalObject.prototype.draw.call(this, modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());
