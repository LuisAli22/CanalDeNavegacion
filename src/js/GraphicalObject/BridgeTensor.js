/*global SweptSurface, Calculator, vec3, ModelViewMatrixStack, mat4, TOWERSCALEFACTOR*/
var BridgeTensor;
(function () {
    "use strict";
    BridgeTensor = function (graphicContainer, trajectory, radius) {
        this.radius = radius;
        this.levelGeometry = [];
        this.createLevelGeometry();
        this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, trajectory, [0xFF, 0x00, 0x00]);
    };
    BridgeTensor.prototype.createLevelGeometry = function () {
        var angle;
        var geometry = [];
        var x;
        var y;
        var calculator = Calculator.getInstance();
        var stepAngle = Math.PI / 24;
        for (angle = 0; angle <= 2 * Math.PI; angle += stepAngle) {
            x = this.radius * Math.cos(angle);
            y = this.radius * Math.sin(angle);
            geometry.push(vec3.fromValues(x, y, 0));
        }
        calculator.storePositionsTangentNormalAndBinormal(geometry, this.levelGeometry);
    };
    BridgeTensor.prototype.draw = function (modelViewMatrix) {
        /*var mvStack = ModelViewMatrixStack.getInstance();
         mvStack.push(modelViewMatrix);*/
        this.sweptSurface.draw(modelViewMatrix);
        //mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());