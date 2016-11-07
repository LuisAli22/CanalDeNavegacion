/*global controlValues, TowerBody, ModelViewMatrixStack, vec3, mat4, TowerJunction, TOWERSCALEFACTOR, Math*/
var Tower;
(function () {
    "use strict";
    Tower = function (graphicContainer, towerPosition, towerTh1, bridgeHeight) {
        this.towerPosition = towerPosition;
        this.towerTh1 = towerTh1;
        this.bridgeHeight = bridgeHeight;
        this.towerTh2 = (this.bridgeHeight - this.towerTh1) / 2;
        this.towerTh3 = this.towerTh2;
        this.towerCenterBody = new TowerBody(graphicContainer, this.towerTh2);
        this.towerBody = new TowerBody(graphicContainer, this.towerTh1 - this.towerPosition[1]);
        this.towerTopBody = new TowerBody(graphicContainer, this.towerTh3);
        this.towerJunction1 = new TowerJunction(graphicContainer, [0xFF, 0x00, 0x00]);
        this.towerWidth = this.towerBody.getWidth();
    };
    Tower.prototype.getWidth = function () {
        return this.towerWidth;
    };
    Tower.prototype.getXPosition = function () {
        return this.towerPosition[0];
    };
    Tower.prototype.drawTowerBase = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        this.towerBody.draw(modelViewMatrix);
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues((-this.towerWidth), -this.towerPosition[1] + this.towerTh1, -(this.towerWidth)));
        this.towerJunction1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    Tower.prototype.drawTowerCenter = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-this.towerWidth / 4, this.towerTh1 + this.towerJunction1.getHeight() - this.towerPosition[1], -this.towerWidth / 4));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, 1, TOWERSCALEFACTOR));
        this.towerCenterBody.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues((-7 * this.towerWidth / 8), this.towerTh1 + this.towerJunction1.getHeight() - this.towerPosition[1] + this.towerTh2, (-7 * this.towerWidth / 8)));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, 1, TOWERSCALEFACTOR));
        this.towerJunction1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    Tower.prototype.drawTowerTop = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-3 * this.towerWidth / 8, this.towerTh1 + 2 * this.towerJunction1.getHeight() - this.towerPosition[1] + this.towerTh2, -3 * this.towerWidth / 8));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(Math.pow(TOWERSCALEFACTOR, 2), 1, Math.pow(TOWERSCALEFACTOR, 2)));
        this.towerTopBody.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    Tower.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.towerPosition[0], this.towerPosition[1], this.towerPosition[2] + (this.towerWidth / 2)));
        this.drawTowerBase(modelViewMatrix);
        this.drawTowerCenter(modelViewMatrix);
        this.drawTowerTop(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());
