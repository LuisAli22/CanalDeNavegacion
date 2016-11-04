/*global Grass, vec3, Calculator, controlValues, Bspline*/
var GrassLeftSide;
(function () {
    "use strict";
    GrassLeftSide = function (graphicContainer, sandPositions, levelControlPointsAmount, sandDistance) {
        Grass.call(this, graphicContainer, sandPositions, levelControlPointsAmount, 360, sandDistance);
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
            this.treesPositions.push([xRandomValue, y + this.sandDistance, z]);
        }
    };
    GrassLeftSide.prototype.addBankPoints = function (index) {
        var xCoordinate = this.sandPositions[index];
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var stepDistanceBetweenVertex = (this.grassLimit - (xCoordinate)) / (this.grassVertexAmountInABank - 1);
        var currentIndex;
        if (stepDistanceBetweenVertex > 0) {
            this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            this.createRandomTree(xCoordinate, y, z);
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                this.grassPositions.push(vec3.fromValues(xCoordinate, y + this.sandDistance, z));
                if (currentIndex === 0) {
                    this.setRiverStreetIntersection(z, xCoordinate, 1);
                }
            }
            this.grassPositions.push(vec3.fromValues(this.grassLimit, y + this.sandDistance, z));
        }
    };
}());
