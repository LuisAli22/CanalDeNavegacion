/*global controlValues, TowerBody, ModelViewMatrixStack, vec3, mat4, TowerJunction, TOWERSCALEFACTOR, Math, TOWERWIDTH*/
var Tower;
(function () {
    "use strict";
    Tower = function (graphicContainer, towerPosition, towerTh1, bridgeHeight) {
        this.towerPosition = towerPosition;
        this.towerTh1 = towerTh1;
        this.towerTh2 = (bridgeHeight - this.towerTh1) / 2;
        this.towerTh3 = this.towerTh2;
        this.towerCenterBody = new TowerBody(graphicContainer, this.towerTh2);
        this.towerBody = new TowerBody(graphicContainer, this.towerTh1);
        this.towerTopBody = new TowerBody(graphicContainer, this.towerTh3);
        this.junctionHeight = 0.2;
        this.towerJunction1 = new TowerJunction(graphicContainer, this.junctionHeight);
    };
    Tower.prototype.getXPosition = function () {
        return this.towerPosition[0];
    };
    Tower.prototype.drawTowerCenterAndTop = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, 1, TOWERSCALEFACTOR));
        this.towerCenterBody.draw(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, this.towerTh2, 0));
        this.towerJunction1.draw(modelViewMatrix);
        this.drawTowerTop(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    Tower.prototype.drawTowerTop = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, 1, TOWERSCALEFACTOR));
        this.towerTopBody.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
    Tower.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.towerPosition[0], this.towerPosition[1], this.towerPosition[2]));
        this.towerBody.draw(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, this.towerTh1, 0));
        this.towerJunction1.draw(modelViewMatrix);
        this.drawTowerCenterAndTop(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());
