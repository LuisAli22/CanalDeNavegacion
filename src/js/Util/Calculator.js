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

        function storeTangentNormalAndBinormal(previousPointPosition, currentPointPosition, geometry, isLastPoint) {
            var tangent = createTangent(previousPointPosition, currentPointPosition);
            if (isLastPoint) {
                vec3.scale(tangent, tangent, -1);
            }
            var binormal;
            var normal;
            if (previousPointPosition[0] === 0 && previousPointPosition[1] === 0 && previousPointPosition[2] === 0) {
                normal = crossProductAndNormalize(tangent, vec3.fromValues(1, 0, 1));
                binormal = crossProductAndNormalize(normal, tangent);
            } else {
                binormal = crossProductAndNormalize(tangent, previousPointPosition);
                normal = crossProductAndNormalize(binormal, tangent);
            }
            geometry.push({
                "position": previousPointPosition,
                "tangent": tangent,
                "normal": normal,
                "binormal": binormal
            });
        }

        function setNeighbors(top, right, bottom, left, neighbors, vertexXIndex, vertexZIndex, vertexIndex, zMax, circular) {
            if (top) {
                neighbors[0] = null;
            } else {
                neighbors[0] = ((vertexXIndex + 1) * zMax + vertexZIndex);
            }
            if (right) {
                if (!circular) {
                    neighbors[1] = null;
                } else {
                    neighbors[1] = (vertexIndex - (zMax - 2));
                }
            } else {
                neighbors[1] = vertexIndex + 1;
            }
            if (bottom) {
                neighbors[2] = null;
            } else {
                neighbors[2] = (vertexXIndex - 1) * zMax + vertexZIndex;
            }
            if (left) {
                if (!circular) {
                    neighbors[3] = null;
                } else {
                    neighbors[3] = (vertexIndex + zMax - 2);
                }
            } else {
                neighbors[3] = vertexIndex - 1;
            }
        }
        return {
            storePositionsTangentNormalAndBinormal: function (positions, geometry) {
                var previousPointPosition = vec3.create();
                positions.forEach(function (element, index) {
                    if (index === 0) {
                        previousPointPosition = vec3.clone(element);
                    } else {
                        storeTangentNormalAndBinormal(previousPointPosition, element, geometry, false);
                        previousPointPosition = vec3.clone(element);
                    }
                }, this);
                var lastPointIndex = positions.length - 1;
                storeTangentNormalAndBinormal(positions[lastPointIndex], positions[lastPointIndex - 1], geometry, true);
            },
            calculateNormalFromNeighbors: function (vertexZIndex, vertexXIndex, vertexPositionData, zMax, xMax, circular) {
                var neighbors = [];
                var top = (vertexXIndex === (xMax - 1));
                var bottom = (vertexXIndex === 0);
                var left = (vertexZIndex === 0);
                var right = (vertexZIndex === (zMax - 1));
                var vertexIndex = vertexXIndex * zMax + vertexZIndex;
                setNeighbors(top, right, bottom, left, neighbors, vertexXIndex, vertexZIndex, vertexIndex, zMax, circular);
                var normals = [];
                var binormal;
                var tangent;
                var i;
                var v1x;
                var v1y;
                var v1z;
                var v2x;
                var v2y;
                var v2z;
                var n;
                for (i = 0; i < 4; i += 1) {
                    if (neighbors[i] && neighbors[(i + 1) % 4]) {
                        v1x = vertexPositionData[neighbors[(i + 1) % 4] * 3] - vertexPositionData[vertexIndex * 3];
                        v1y = vertexPositionData[neighbors[(i + 1) % 4] * 3 + 1] - vertexPositionData[vertexIndex * 3 + 1];
                        v1z = vertexPositionData[neighbors[(i + 1) % 4] * 3 + 2] - vertexPositionData[vertexIndex * 3 + 2];
                        v2x = vertexPositionData[neighbors[i] * 3] - vertexPositionData[vertexIndex * 3];
                        v2y = vertexPositionData[neighbors[i] * 3 + 1] - vertexPositionData[vertexIndex * 3 + 1];
                        v2z = vertexPositionData[neighbors[i] * 3 + 2] - vertexPositionData[vertexIndex * 3 + 2];
                        n = vec3.cross(vec3.create(), vec3.fromValues(v1x, v1y, v1z), vec3.fromValues(v2x, v2y, v2z));
                        binormal = [v1x, v1y, v1z];
                        tangent = [v2x, v2y, v2z];
                        normals.push(vec3.normalize(vec3.create(), n));
                    }
                }
                var l = normals.length;
                n = [0, 0, 0];
                for (i = 0; i < normals.length; i += 1) {
                    n[0] += normals[i][0];
                    n[1] += normals[i][1];
                    n[2] += normals[i][2];
                }

                return [vec3.normalize([], binormal), vec3.normalize(vec3.create(), vec3.fromValues(n[0] / l, n[1] / l, n[2] / l)), vec3.normalize(vec3.create(), tangent)];
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
