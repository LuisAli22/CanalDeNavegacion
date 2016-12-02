/*global vec3, vec4, TOWERWIDTH*/
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
                normal = crossProductAndNormalize(vec3.fromValues(1, 0, 1), tangent);
                binormal = crossProductAndNormalize(normal, tangent);
            } else {
                binormal = crossProductAndNormalize(previousPointPosition, tangent);//(tangent, previousPointPosition);
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

        function setXValue(index) {
            if (index === 1 || index === 2 || index === 9 || index === 10) {
                return (3 / 8) * TOWERWIDTH;
            }
            if (index === 3 || index === 4 || index === 7 || index === 8) {
                return (5 / 8) * TOWERWIDTH;
            }
            if (index === 5 || index === 6) {
                return TOWERWIDTH;
            }
            return 0;
        }

        function setYValue(index, pointsAmount) {
            if ((index === 2) || (index === 3)) {
                return (1 / 4) * TOWERWIDTH;
            }
            if ((index === 8) || (index === 9)) {
                return (3 / 4) * TOWERWIDTH;
            }
            if ((index === 6) || (index === 7) || (index === 10) || (index === pointsAmount - 1)) {
                return TOWERWIDTH;
            }
            return 0;
        }

        function createBinormalXSense(index) {
            if ((index === 0) || (index === 3) || (index === 4) || (index === 7) || (index === 8) || (index === 11) || (index === 12)) {
                return vec3.fromValues(-1, 0, 0).slice(0);
            }
            return vec3.fromValues(1, 0, 0).slice(0);
        }

        function createBinormalYSense(index) {
            if ((index <= 5) || (index === 12)) {
                return vec3.fromValues(0, -1, 0).slice(0);
            }
            return vec3.fromValues(0, 1, 0).slice(0);
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
            },
            towerMainLevelGeometry: function (storeByThreeValues) {
                var i;
                var x;
                var y;
                var pointsAmount = 12;
                var geometry = [];
                var binormal1;
                var binormal2;
                for (i = 0; i <= pointsAmount; i += 1) {
                    x = setXValue(i);
                    y = setYValue(i, pointsAmount);
                    binormal1 = createBinormalXSense(i);
                    binormal2 = createBinormalYSense(i);
                    /*geometry.push({"position": vec3.fromValues(x, y, 0), "binormal": binormal2, "normal": null, "tangent": null});
                     geometry.push({"position": vec3.fromValues(x, y, 0), "binormal": binormal1, "normal": null, "tangent": null});*/
                    if (storeByThreeValues) {
                        /*binormal1 = createBinormalXSense(i);
                         binormal2 = createBinormalYSense(i);*/
                        geometry.push({
                            "position": vec3.fromValues(x, y, 0),
                            "binormal": binormal2,
                            "normal": null,
                            "tangent": null
                        });
                        geometry.push({
                            "position": vec3.fromValues(x, y, 0),
                            "binormal": binormal1,
                            "normal": null,
                            "tangent": null
                        });
                    } else {
                        //geometry.push(x, y, 0);
                        geometry.push({
                            "position": vec3.fromValues(x, y, 0),
                            "binormal": binormal1,
                            "normal": null,
                            "tangent": null
                        });
                    }
                }
                return geometry.slice(0);
            },
            multiplyMatrixByVector: function (matrix, vector) {
                var product = vec4.create();
                var addition = 0;
                matrix.forEach(function (element, index) {
                    if (((index % 4) === 0) && (index !== 0)) {
                        product[Math.floor((index - 1) / 4)] = addition;
                        addition = 0;
                    }
                    addition += element * vector[index % 4];
                    if (index === matrix.length - 1) {
                        product[Math.floor((index) / 4)] = addition;
                    }
                });
                return product.slice(0);
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
