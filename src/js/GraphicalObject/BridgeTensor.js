/*global SweptSurface, Calculator, vec3, ModelViewMatrixStack, mat4, TOWERSCALEFACTOR*/
var BridgeTensor;
(function () {
    "use strict";
    BridgeTensor = function (graphicContainer, trajectory) {
        this.levelGeometry = [];
        this.createLevelGeometry();
        this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, trajectory, [0xFF, 0x00, 0x00]);
    };
    BridgeTensor.prototype.createLevelGeometry = function () {
        var angle = 0;
        var radius = 0.125;
        var geometry = [];
        var x;
        var y;
        var calculator = Calculator.getInstance();
        var stepAngle = Math.PI / 24;
        for (angle = 0; angle <= 2 * Math.PI; angle += stepAngle) {
            x = radius * Math.cos(angle);
            y = radius * Math.sin(angle);
            geometry.push(vec3.fromValues(x, y, 0));
        }
        calculator.storePositionsTangentNormalAndBinormal(geometry, this.levelGeometry);
    };
    BridgeTensor.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        /*mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(1, TOWERSCALEFACTOR, 1));
         mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(1, TOWERSCALEFACTOR, 1));
         mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(1, TOWERSCALEFACTOR, 1));
         mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, 1, 0));*/
        this.sweptSurface.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());