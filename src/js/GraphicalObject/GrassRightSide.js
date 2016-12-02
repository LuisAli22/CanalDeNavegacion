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
        var currentLastPoint;
        if (stepDistanceBetweenVertex > 0) {
            this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            this.createRandomTree(index, y, z);
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            }
            currentLastPoint = this.grassPositions[this.grassPositions.length - 1];
            this.setRiverStreetIntersection(currentLastPoint[2], currentLastPoint[0], -1);
            this.grassPositions.push(vec3.fromValues(this.sandPositions[index], y, z));
        }
    };
}());
