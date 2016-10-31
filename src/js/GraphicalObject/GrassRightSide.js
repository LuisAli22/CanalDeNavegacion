/*global Grass, vec3*/
var GrassRightSide;
(function () {
    "use strict";
    GrassRightSide = function (graphicContainer, sandPositions, levelControlPointsAmount) {
        Grass.call(this, graphicContainer, sandPositions, levelControlPointsAmount, 0);
    };
    GrassRightSide.prototype = Object.create(Grass.prototype);
    GrassRightSide.prototype.constructor = Grass;
    GrassRightSide.prototype.isEdge = function (index) {
        return ((index + 3) % (this.levelControlPointsAmount * 3) === 0);
    };
    GrassRightSide.prototype.addBankPoints = function (index) {
        var xCoordinate = this.grassLimit;
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var stepDistanceBetweenVertex = (this.sandPositions[index] - this.grassLimit) / (this.grassVertexAmountInABank - 1);
        var currentIndex;
        if (stepDistanceBetweenVertex > 0) {
            this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            }
            this.grassPositions.push(vec3.fromValues(this.sandPositions[index], y, z));
        }

    };
}());
