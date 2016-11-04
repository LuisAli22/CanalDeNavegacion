/*global SweptSurface, Calculator, mat4, vec3, ModelViewMatrixStack, Bspline*/
var TowerBody;
(function () {
    "use strict";
    TowerBody = function (graphicContainer) {
        this.width = 1;
        this.towerBodyLevelGeometry = [];
        this.createLevelPoints();
        this.towerBodyTrajectory = [];
        this.createTrajectory();
        this.sweptSurface = new SweptSurface(graphicContainer, this.towerBodyLevelGeometry, this.towerBodyTrajectory, [0xff, 0x00, 0x00]);
    };
    TowerBody.prototype.getWidth = function () {
        return this.width;
    };
    TowerBody.prototype.createLevelPoints = function () {
        var levelPointsPosition = [[0, 0, 0], [1 / 2.3, 0, 0], [1 / 2.3, 0.1 / 2.3, 0], [1.3 / 2.3, 0.1 / 2.3, 0], [1.3 / 2.3, 0, 0], [this.width, 0, 0], [this.width, this.width, 0], [1.3 / 2.3, this.width, 0], [1.3 / 2.3, 1.9 / 2.3, 0], [1 / 2.3, 1.9 / 2.3, 0], [1 / 2.3, this.width, 0], [0, this.width, 0], [0, 0, 0]];
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.towerBodyLevelGeometry);
    };
    TowerBody.prototype.getLevelPoints = function () {
        return this.towerBodyLevelGeometry.slice(0);
    };
    TowerBody.prototype.createTrajectory = function () {
        var controlPoints = [[0, 0, 0], [0, 1 / 4, 0], [0, 2 / 4, 0], [0, 3 / 4, 0], [0, 1, 0]];
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