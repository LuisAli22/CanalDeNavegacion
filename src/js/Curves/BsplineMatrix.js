/*global mat4, vec4, Calculator*/
var BsplineMatrix = (function () {
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
        var controPointsAndBsplineMatrixSubproduct;

        return {
            multiplyByVector: function (controlPoints) {
                var calculator = Calculator.getInstance();
                controPointsAndBsplineMatrixSubproduct = calculator.multiplyMatrixByVector(bSplineMatrix, controlPoints);
            },
            getCurvePoint: function (u, getCoordinateValue) {
                var canonicalBasis = vec4.create();
                if (getCoordinateValue) {
                    vec4.set(canonicalBasis, Math.pow(u, 3), Math.pow(u, 2), u, 1);
                } else {
                    vec4.set(canonicalBasis, 3 * Math.pow(u, 2), 2 * u, 1, 0);
                }
                return Math.round(vec4.dot(canonicalBasis, controPointsAndBsplineMatrixSubproduct) * 1000) / 1000;
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
