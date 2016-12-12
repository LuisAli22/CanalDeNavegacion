/*global Grass, vec3, Calculator, controlValues, Bspline*/
var GrassLeftSide;
(function () {
    "use strict";
    GrassLeftSide = function (graphicContainer, sandPositions, levelControlPointsAmount, streetWidth) {
        Grass.call(this, graphicContainer, sandPositions, levelControlPointsAmount, 360, streetWidth);
    };
    GrassLeftSide.prototype = Object.create(Grass.prototype);
    GrassLeftSide.prototype.constructor = Grass;
    GrassLeftSide.prototype.isEdge = function (index) {
        return (index % (this.levelControlPointsAmount * 3) === 0);
    };
    GrassLeftSide.prototype.createRandomTree = function (xCoordinate, y, z) {
        var coinValue = Math.floor((Math.random() * 10) + 1) - 1;
        if (coinValue === 7) {
            var lowerXLimit = Math.ceil(xCoordinate);
            var xRandomValue = Math.floor((Math.random() * (this.grassLimit - lowerXLimit)) + lowerXLimit);
            if ((z > (this.streetZPositionValue + this.streetWidth / 2)) || (z < this.streetZPositionValue - this.streetWidth / 2)) {
                this.treesPositions.push([xRandomValue, y, z]);
            }
        }
    };
    GrassLeftSide.prototype.addBankPoints = function (index) {
        var xCoordinate = this.sandPositions[index];
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var stepDistanceBetweenVertex = (this.grassLimit - (xCoordinate)) / (this.grassVertexAmountInABank - 1);
        var currentIndex;
        var position;
        var binormal = vec3.fromValues(0, -1, 0);
        var tangent = vec3.fromValues(1, 0, 0);
        var normal = vec3.cross(vec3.create(), tangent, binormal);
        if (stepDistanceBetweenVertex > 0) {
            position = vec3.fromValues(xCoordinate, y, z);
            this.loadBufferList({
                "position": position,
                "normal": normal,
                "tangent": tangent,
                "binormal": binormal
            }, index / 128, 1 / 2);
            this.createRandomTree(xCoordinate, y, z);
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                position = vec3.fromValues(xCoordinate, y, z);
                this.loadBufferList({
                    "position": position,
                    "normal": normal,
                    "tangent": tangent,
                    "binormal": binormal
                }, index / 128, currentIndex / 2);
                if (currentIndex === 0) {
                    this.setRiverStreetIntersection(z, xCoordinate, 1);
                }
            }
            position = vec3.fromValues(this.grassLimit, y, z);
            this.loadBufferList({
                "position": position,
                "normal": normal,
                "tangent": tangent,
                "binormal": binormal
            }, 1, 1);
        }
    };
}());
