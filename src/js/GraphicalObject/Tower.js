/*global controlValues, TowerBody, ModelViewMatrixStack, vec3, mat4, TowerJunction, TOWERSCALEFACTOR*/
var Tower;
(function () {
    "use strict";
    Tower = function (graphicContainer, towerPosition, towerTh1) {
        this.towerPosition = towerPosition;
        this.towerTh1 = towerTh1;
        this.bridgeHeight = (controlValues.ph1 + controlValues.ph2 + controlValues.ph3);
        this.towerTh2 = (this.bridgeHeight - this.towerTh1) / 2;
        this.towerTh3 = this.towerTh2;
        this.towerBody1 = new TowerBody(graphicContainer);
        this.towerBody2 = new TowerBody(graphicContainer);
        this.towerJunction1 = new TowerJunction(graphicContainer, this.towerBody1.getLevelPoints(), [0xFF, 0x00, 0x00]);
        this.towerWidth = this.towerBody1.getWidth();
    };
    Tower.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.towerPosition[0], this.towerPosition[1], this.towerPosition[2] + (this.towerWidth / 2)));
        mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(1, Math.abs(this.towerTh1 - this.towerPosition[1]), 1));
        this.towerBody1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        //mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.towerPosition[0] - (this.towerWidth), this.towerTh1, this.towerPosition[2] - (this.towerWidth / 2)));
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues((-this.towerWidth), -this.towerPosition[1] + this.towerTh1, -(this.towerWidth)));
        this.towerJunction1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());

        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.towerPosition[0] - (this.towerWidth / 4), this.towerTh1 + this.towerJunction1.getHeight() - 0.1, this.towerPosition[2] + (this.towerWidth / 4)));
        mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, TOWERSCALEFACTOR * this.towerTh2, TOWERSCALEFACTOR));
        this.towerBody1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-5 * this.towerWidth / 8, TOWERSCALEFACTOR * this.towerTh2, -5 * this.towerWidth / 8));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(TOWERSCALEFACTOR, TOWERSCALEFACTOR, TOWERSCALEFACTOR));
        this.towerJunction1.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());
