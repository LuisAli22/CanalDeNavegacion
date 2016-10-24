/*global mat4, vec4, createMatrixFromValues, multiplyMatrixByVector, CLICKDISTANCESENSITIVENESS, Math*/
var Bspline = (function () {
    "use strict";
    var instance;

    function init() {
        function createBsplineMatrix() {
            var bMatrix = mat4.create();
            var values = [-1, 3, -3, 1, 3, -6, 3, 0, -3, 0, 3, 0, 1, 4, 1, 0];
            values.forEach(function (element, index) {
                bMatrix[index] = element / 6;
            });
            return bMatrix;
        }

        var bSplineMatrix = createBsplineMatrix();
        var xControPointsAndBsplineMatrixSubproduct;
        var yControPointsAndBsplineMatrixSubproduct;

        function multiplyMatrixByVector(controlPoints) {
            var product = vec4.create();
            var addition = 0;
            bSplineMatrix.forEach(function (element, index) {
                if (((index % 4) === 0) && (index !== 0)) {
                    product[Math.floor((index - 1) / 4)] = addition;
                    addition = 0;
                }
                addition += element * controlPoints[index % 4];
                if (index === bSplineMatrix.length - 1) {
                    product[Math.floor((index) / 4)] = addition;
                }
            });
            return product;
        }

        function createCanonicalBasis(u) {
            var canonical = vec4.create();
            vec4.set(canonical, Math.pow(u, 3), Math.pow(u, 2), u, 1);
            return canonical;
        }

        return {
            multiplyMatrixAndControlPoints: function (xControlPoints, yControlPoints) {
                xControPointsAndBsplineMatrixSubproduct = multiplyMatrixByVector(xControlPoints);
                yControPointsAndBsplineMatrixSubproduct = multiplyMatrixByVector(yControlPoints);
            },
            getCurvePoint: function (u) {
                var canonicalBasis = createCanonicalBasis(u);
                var point = {};
                point.x = vec4.dot(canonicalBasis, xControPointsAndBsplineMatrixSubproduct);
                point.y = vec4.dot(canonicalBasis, yControPointsAndBsplineMatrixSubproduct);
                return point;
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
}());