/*global vec3*/
var Calculator = (function () {
    "use strict";
    var instance;

    function init() {
        function createTangent(previousPointPosition, element) {
            var newTangent = vec3.create();
            vec3.scale(previousPointPosition, previousPointPosition, -1);
            vec3.add(newTangent, previousPointPosition, element);
            vec3.normalize(newTangent, newTangent);
            vec3.scale(previousPointPosition, previousPointPosition, -1);
            return newTangent;
        }

        function crossProductAndNormalize(firstVectorOperand, secondVectorOperand) {
            var resultVector = vec3.create();
            vec3.cross(resultVector, firstVectorOperand, secondVectorOperand);
            vec3.normalize(resultVector, resultVector);
            return resultVector;
        }

        function storeTangentNormalAndBinormal(previousPointPosition, currentPointPosition, levelGeometry, isLastPoint) {
            var tangent = createTangent(previousPointPosition, currentPointPosition);
            if (isLastPoint) {
                vec3.scale(tangent, tangent, -1);
            }
            var binormal = crossProductAndNormalize(tangent, previousPointPosition);
            var normal = crossProductAndNormalize(binormal, tangent);
            levelGeometry.push({
                "position": previousPointPosition,
                "tangent": tangent,
                "normal": normal,
                "binormal": binormal
            });
        }

        return {
            storePositionsTangentNormalAndBinormal: function (positions, levelGeometry) {
                var previousPointPosition = vec3.create();
                positions.forEach(function (element, index) {
                    if (index === 0) {
                        previousPointPosition = vec3.clone(element);
                    } else {
                        storeTangentNormalAndBinormal(previousPointPosition, element, levelGeometry, false);
                        previousPointPosition = vec3.clone(element);
                    }
                }, this);
                var lastPointIndex = positions.length - 1;
                storeTangentNormalAndBinormal(positions[lastPointIndex], positions[lastPointIndex - 1], levelGeometry, true);
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
