/*global SweptSurface, Calculator, mat4, vec3, ModelViewMatrixStack, Bspline*/
var TowerBody;
(function () {
    "use strict";
    TowerBody = function (graphicContainer, height, scaleLevelPoint) {
        this.height = height;
        this.towerBodyLevelGeometry = [];
        this.createLevelPoints();
        this.towerBodyTrajectory = [];
        this.createTrajectory();
        this.sweptSurface = new SweptSurface(graphicContainer, this.towerBodyLevelGeometry, this.towerBodyTrajectory, null, scaleLevelPoint);
    };
    TowerBody.prototype.createLevelPoints = function () {
        var calculator = Calculator.getInstance();
        this.towerBodyLevelGeometry = calculator.towerMainLevelGeometry(true);
    };
    TowerBody.prototype.createTrajectory = function () {
        var controlPoints = [];
        var heightIndex;
        var stepHeight = this.height / 3;
        for (heightIndex = 0; heightIndex < 4; heightIndex += 1) {
            controlPoints.push([0, heightIndex * stepHeight, 0]);
        }
        var bSpline = new Bspline(controlPoints, 5, [1, 0, 0]);
        var curvePoints = bSpline.getCurvePoints();
        curvePoints.forEach(function (element) {
            this.towerBodyTrajectory.push(element);
        }, this);
    };
    TowerBody.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, Math.PI / 2);
        this.sweptSurface.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());