/*global mat4, vec4*/
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

        return {
            multiplyByVector: function (controlPoints) {
                controPointsAndBsplineMatrixSubproduct = multiplyMatrixByVector(controlPoints);
            },
            getCurvePoint: function (u, getCoordinateValue) {
                var canonicalBasis = vec4.create();
                if (getCoordinateValue) {
                    vec4.set(canonicalBasis, Math.pow(u, 3), Math.pow(u, 2), u, 1);
                } else {
                    vec4.set(canonicalBasis, 3 * Math.pow(u, 2), 2 * u, 1, 0);
                }
                return vec4.dot(canonicalBasis, controPointsAndBsplineMatrixSubproduct);
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
