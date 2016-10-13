/*global mat4, vec4, createMatrixFromValues, multiplyMatrixByVector, CLICKDISTANCESENSITIVENESS, Math*/
var Bspline;
(function () {
    "use strict";
    Bspline = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.thisMatrix = this.createBsplineMatrix();
    };
    Bspline.prototype.setControlPoints = function (xControlPoints, yControlPoints) {
        this.xControlPoints = xControlPoints;
        this.yControlPoints = yControlPoints;
        this.xControPointsAndBsplineMatrixSubproduct = this.multiplyMatrixByVector(true);
        this.yControPointsAndBsplineMatrixSubproduct = this.multiplyMatrixByVector(false);
    };
    Bspline.prototype.createBsplineMatrix = function () {
        var values = [-1, 3, -3, 1, 3, -6, 3, 0, -3, 0, 3, 0, 1, 4, 1, 0];
        var matrixB = mat4.create();
        values.forEach(function (element, index) {
            matrixB[index] = element / 6;
        });
        return matrixB;
    };
    Bspline.prototype.createCanonicalBasis = function (u, setDerivated) {
        var canonical = vec4.create();
        if (setDerivated) {
            vec4.set(canonical, 3 * Math.pow(u, 2), 2 * u, 1, 0);
            return canonical;
        }
        vec4.set(canonical, Math.pow(u, 3), Math.pow(u, 2), u, 1);
        return canonical;
    };
    Bspline.prototype.getCurvePoint = function (u, setDerivatedBase) {
        var canonicalBasis = this.createCanonicalBasis(u, setDerivatedBase);
        var point = {};
        point.x = vec4.dot(canonicalBasis, this.xControPointsAndBsplineMatrixSubproduct);
        point.y = vec4.dot(canonicalBasis, this.yControPointsAndBsplineMatrixSubproduct);
        return point;
    };
    /*    Bspline.prototype.base = function (u) {
        return this.getCurvePoint(u, false);
    };
    Bspline.prototype.derivatedBase = function (u) {
        return this.getCurvePoint(u, true);
     };*/
    Bspline.prototype.multiplyMatrixByVector = function (multiplyXCoordinate) {
        var product = vec4.create();
        var addition = 0;
        var length = this.thisMatrix.length;
        var vector = vec4.create();
        if (multiplyXCoordinate) {
            vector = vec4.clone(this.xControlPoints);
        } else {
            vector = vec4.clone(this.yControlPoints);
        }
        this.thisMatrix.forEach(function (element, index) {
            if (((index % 4) === 0) && (index !== 0)) {
                product[Math.floor((index - 1) / 4)] = addition;
                addition = 0;
            }
            addition += element * vector[index % 4];
            if (index === length - 1) {
                product[Math.floor((index) / 4)] = addition;
            }
        });
        return product;
    };
    Bspline.prototype.drawControlPoints = function (controlPoint) {
        this.graphicContainer.beginPath();
        this.graphicContainer.arc(controlPoint.x, controlPoint.y, CLICKDISTANCESENSITIVENESS, 0, 2 * Math.PI);
        this.graphicContainer.setLineWidth(1);
        this.graphicContainer.setLineDash([0, 0]);
        this.graphicContainer.setStrokeStyle("#000000");
        this.graphicContainer.stroke();
    };
    Bspline.prototype.drawControlGraphSegment = function (previousControlPoint, controlPoint) {
        this.graphicContainer.beginPath();
        this.graphicContainer.setLineWidth(1);
        this.graphicContainer.setLineDash([5, 15]);
        this.graphicContainer.moveTo(previousControlPoint.x, previousControlPoint.y);
        this.graphicContainer.lineTo(controlPoint.x, controlPoint.y);
        this.graphicContainer.setStrokeStyle("#000000");
        this.graphicContainer.stroke();
    };
    Bspline.prototype.draw = function () {
        this.graphicContainer.setLineWidth(5);
        this.graphicContainer.setLineDash([0, 0]);
        var deltaU = 0.01;
        this.graphicContainer.beginPath();
        var u;
        var curvePoint;
        for (u = 0; u <= 1.001; u = u + deltaU) {
            curvePoint = this.getCurvePoint(u, false);
            if (u === 0) {
                this.graphicContainer.moveTo(curvePoint.x, curvePoint.y);
            }
            this.graphicContainer.lineTo(curvePoint.x, curvePoint.y);
        }
        this.graphicContainer.setStrokeStyle("#0000FF");
        this.graphicContainer.stroke();
    };
}());