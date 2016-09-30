/*global mat4, vec4, createMatrixFromValues, multiplyMatrixByVector*/
var Bspline;
(function () {
    "use strict";
    Bspline = function (xControlPoints, yControlPoints) {
        this.xControlPoints = xControlPoints;
        this.yControlPoints = yControlPoints;
        var matrixValues = [-1, 3, -3, 1, 3, -6, 3, 0, -3, 0, 3, 0, 1, 4, 1, 0];
        matrixValues.forEach(function (element, index, matrixValues) {
            matrixValues[index] = (element) / 6;
        });
        this.bSplineMatrix = mat4.create();
        createMatrixFromValues(this.bSplineMatrix, matrixValues);
        this.curvePoint = {"x": 0, "y": 0};
    };
    Bspline.prototype.setCurvePointCoordinate = function (canonicalBasis, controlPoints) {
        var controPointsAndBsplineMatrixSubproduct = multiplyMatrixByVector(this.bSplineMatrix, controlPoints);
        return vec4.dot(canonicalBasis, controPointsAndBsplineMatrixSubproduct);
    };
    Bspline.prototype.setCurvePoint = function (canonicalBasis) {
        var point = {};
        point.x = this.setCurvePointCoordinate(canonicalBasis, this.xControlPoints);
        point.y = this.setCurvePointCoordinate(canonicalBasis, this.yControlPoints);
        return point;
    };
    Bspline.prototype.getCurvePoint = function (u, getFromDerivatedBase) {
        var canonicalBasis = vec4.create();
        if (getFromDerivatedBase) {
            vec4.set(canonicalBasis, 3 * Math.pow(u, 2), 2 * u, 1, 0);
        } else {
            vec4.set(canonicalBasis, Math.pow(u, 3), Math.pow(u, 2), u, 1);
        }
        return this.setCurvePoint(canonicalBasis);
    };
    Bspline.prototype.base = function (u) {
        return this.getCurvePoint(u, false);
    };
    Bspline.prototype.derivatedBase = function (u) {
        return this.getCurvePoint(u, true);
    };
}());