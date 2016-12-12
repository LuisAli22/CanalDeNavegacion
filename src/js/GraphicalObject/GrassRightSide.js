/*global Grass, vec3, Calculator, controlValues, Bspline*/
var GrassRightSide;
(function () {
    "use strict";
    GrassRightSide = function (graphicContainer, sandPositions, levelControlPointsAmount, streetWidth) {
        Grass.call(this, graphicContainer, sandPositions, levelControlPointsAmount, 0, streetWidth);
    };
    GrassRightSide.prototype = Object.create(Grass.prototype);
    GrassRightSide.prototype.constructor = Grass;
    GrassRightSide.prototype.isEdge = function (index) {
        return ((index + 3) % (this.levelControlPointsAmount * 3) === 0);
    };
    GrassRightSide.prototype.createRandomTree = function (index, y, z) {
        var coinValue = Math.floor((Math.random() * 10) + 1) - 1;
        if (coinValue === 7) {
            var upperXLimit = Math.ceil(this.sandPositions[index]);
            var xRandomValue = Math.floor((Math.random() * (upperXLimit - this.grassLimit)) + this.grassLimit);
            if ((z > (this.streetZPositionValue + this.streetWidth / 2)) || (z < this.streetZPositionValue - this.streetWidth / 2)) {
                this.treesPositions.push([xRandomValue, y, z]);
            }
        }
    };
    GrassRightSide.prototype.addBankPoints = function (index) {
        var xCoordinate = this.grassLimit;
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var stepDistanceBetweenVertex = (this.sandPositions[index] - this.grassLimit) / (this.grassVertexAmountInABank - 1);
        var currentIndex;
        var currentLastPointX;
        var currentLastPointZ;
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
            this.createRandomTree(index, y, z);
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                position = vec3.fromValues(xCoordinate, y, z);
                this.loadBufferList({
                    "position": position,
                    "normal": normal,
                    "tangent": tangent,
                    "binormal": binormal
                }, index / 128, currentIndex / 2);
            }
            currentLastPointX = this.bufferList.position[this.bufferList.position.length - 3];
            currentLastPointZ = this.bufferList.position[this.bufferList.position.length - 1];
            this.setRiverStreetIntersection(currentLastPointZ, currentLastPointX, -1);
            position = vec3.fromValues(this.sandPositions[index], y, z);
            this.loadBufferList({
                "position": position,
                "normal": normal,
                "tangent": tangent,
                "binormal": binormal
            }, 1, 1);
        }
    };
}());
