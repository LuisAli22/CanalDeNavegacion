/*global GraphicalObject, vec3*/
var SweptSurface;
(function () {
    "use strict";
    SweptSurface = function (graphicContainer) {
        GraphicalObject.call(this, graphicContainer);
        this.trajectory = [];
        this.levelGeometry = [];
        this.pathAmount = 1;
        this.offsetIndexSameValue = 0;
    };
    SweptSurface.prototype = Object.create(GraphicalObject.prototype);
    SweptSurface.prototype.constructor = SweptSurface;
    /* SweptSurface.prototype.loadTextureBuffer = function (trajectoryIndex, levelGeometryIndex) {
     var u = 1.0 - (trajectoryIndex / this.trajectory.length);
     var v = 1.0 - (levelGeometryIndex / this.levelGeometry.length);
     this.bufferList.texture_coord.push(u);
     this.bufferList.texture_coord.push(v);
     };
     SweptSurface.prototype.copyValueFromPreviousPosition = function(index){
     var element;
     if ((index % this.pointsAmount) === 0) {
     this.offsetIndexSameValue = 0;
     }
     element = this.bufferList.index[index - (4 * (this.offsetIndexSameValue) + 1)];
     this.offsetIndexSameValue += 1;
     return element;
     }
     SweptSurface.prototype.fillFirstPathElement = function (position) {
     if (position < 2) {
     return position;
     }
     return this.bufferList.index[position - 2] + this.cols;
     }
     SweptSurface.prototype.fillLastPathElement = function (position) {
     if ((position % (this.pathAmount * this.pointsAmount + 1)) === 0) {
     this.pathAmount += 1;
     return this.bufferList.index[position - 1] + 1;
     }
     if (position % 2 === 0) {
     return this.copyValueFromPreviousPosition(position);
     }
     return this.bufferList.index[position - 2] + Math.pow(-1, this.pathAmount - 1) * this.cols;
     }
     SweptSurface.prototype.loadIndexBuffer = function () {
     this.cols = this.trajectory.length / 3;
     this.rows = this.levelGeometry.length / 3;
     this.pointsAmount = 2 * this.rows;
     this.appendExtraPointsAmount = (this.cols - 2) * Math.max(this.rows, this.cols);
     this.indexBufferLength = this.rows * this.cols + this.appendExtraPointsAmount;
     var position;
     for (position = 0; position < this.indexBufferLength; position += 1) {
     if (position < this.pointsAmount) {
     this.bufferList.index[position] = this.fillFirstPathElement(position);
     } else {
     this.bufferList.index[position] = this.fillLastPathElement(position);
     }
     }
     };
     SweptSurface.prototype.loadBuffers = function () {
     var trajectoryPoint;
     var levelPoint;
     var levelPointInTrajectory = vec3.create();
     var index;
     var levelIndex;
     for (index = 0; index < this.trajectory.length; index += 3) {
     trajectoryPoint = vec3.fromValues(this.trajectory[index], this.trajectory[index + 1], this.trajectory[index + 2]);
     vec3.scale(trajectoryPoint, trajectoryPoint, -1);
     for (levelIndex = 0; levelIndex < this.levelGeometry.length; levelIndex += 3) {
     levelPoint = vec3.fromValues(this.levelGeometry[levelIndex], this.levelGeometry[levelIndex + 1], this.levelGeometry[levelIndex + 2]);
     vec3.add(levelPointInTrajectory, levelPoint, trajectoryPoint);
     levelPointInTrajectory.forEach(function (element) {
     this.bufferList.normal.push(element);
     this.bufferList.position.push(element);
     }, this)
     /!*  this.bufferList.normal.concat(levelPointInTrajectory);
     this.bufferList.position.concat(levelPointInTrajectory);*!/
     this.loadTextureBuffer(index, levelIndex);
     }
     }
     this.loadIndexBuffer();
     };
     SweptSurface.prototype.setUpBuffers = function () {
     this.loadBuffers();
     this.mapBuffersToDataStore();
     };*/

}());