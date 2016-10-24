/*global GraphicalObject, Bspline, ControlPoints, vec4*/
var River;
(function () {
    "use strict";
    River = function (graphicContainer, riverMap) {
        GraphicalObject.call(this, graphicContainer);
        this.trajectory = riverMap.trajectory.slice(0);
        this.levelGeometry = [0, -40, 0, -10, -30, 0, -20, -20, 0, -30, -10, 0, -30, 10, 0, -20, 20, 0, -10, 30, 0, 0, 40, 0];
        this.latitudeBands = this.trajectory.length / 3;
        this.longitudeBands = this.levelGeometry.length / 3;
        this.setUpBuffers();
    };
    River.prototype = Object.create(GraphicalObject.prototype);
    River.prototype.constructor = River;
    River.prototype.loadPositionAndNormalBuffers = function () {
        if ((this.currentLongitude < this.longitudeBands) && (this.currentLatitude < this.latitudeBands)) {
            var levelIndex = 3 * this.currentLongitude;
            var trajectoryIndex = 3 * this.currentLatitude;
            var i;
            var coordinate = 0;
            for (i = 0; i < 3; i += 1) {
                coordinate = this.trajectory[trajectoryIndex + i] - this.levelGeometry[levelIndex + i];
                this.bufferList.normal.push(coordinate);
                this.bufferList.position.push(coordinate);
            }
        }
    };
}());
