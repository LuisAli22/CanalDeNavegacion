/*global Grass, vec3*/
var GrassLeftSide;
(function () {
    "use strict";
    GrassLeftSide = function (graphicContainer, sandPositions, levelControlPointsAmount) {
        Grass.call(this, graphicContainer, sandPositions, levelControlPointsAmount, 360);
    };
    GrassLeftSide.prototype = Object.create(Grass.prototype);
    GrassLeftSide.prototype.constructor = Grass;
    GrassLeftSide.prototype.isEdge = function (index) {
        return (index % (this.levelControlPointsAmount * 3) === 0);
    };
    GrassLeftSide.prototype.addBankPoints = function (index) {
        var xCoordinate = this.sandPositions[index];
        var y = this.sandPositions[index + 1];
        var z = this.sandPositions[index + 2];
        var stepDistanceBetweenVertex = (this.grassLimit - (xCoordinate)) / (this.grassVertexAmountInABank - 1);
        var currentIndex;
        if (stepDistanceBetweenVertex > 0) {
            this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            for (currentIndex = 0; currentIndex < this.grassVertexAmountInABank - 2; currentIndex += 1) {
                xCoordinate += stepDistanceBetweenVertex;
                this.grassPositions.push(vec3.fromValues(xCoordinate, y, z));
            }
            this.grassPositions.push(vec3.fromValues(this.grassLimit, y, z));
        }
    };
}());
