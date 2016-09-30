/*jslint browser: true*/
/*global mat4, vec2, vec3, BOTONIZQUIERDODELMOUSE*/
var Camera;
(function () {
    "use strict";
    Camera = function (sceneGraphicContainer) {
        this.sceneGraphicContainer = sceneGraphicContainer;
        this.eye = vec3.create();
        vec3.set(this.eye, 0, 0, 0);
        this.target = vec3.create();
        vec3.set(this.target, 0, 0, 0);
        this.up = vec3.create();
        vec3.set(this.up, 0, 1, 0);
        this.lookAtMatrix = mat4.create();
        this.initialPosition = vec2.create();
        this.endPosition = vec2.create();
        this.leftButtonPressed = false;
    };
    Camera.prototype.update = function () {
        mat4.identity(this.lookAtMatrix);
        this.setViewDirection();
        mat4.lookAt(this.lookAtMatrix, this.eye, this.target, this.up);
        this.sceneGraphicContainer.setViewMatrixToShaderProgram(this.lookAtMatrix);
    };
    Camera.prototype.isLeftButton = function (event) {
        return (event.which === BOTONIZQUIERDODELMOUSE);
    };
    Camera.prototype.getScreenCoordinate = function (event) {
        var canvasOffset = this.sceneGraphicContainer.getCanvasOffset();
        var screenCoordinate = vec2.create();
        vec2.set(screenCoordinate, event.clientX, event.clientY);
        vec2.subtract(screenCoordinate, screenCoordinate, canvasOffset);
        return screenCoordinate;
    };
    Camera.prototype.onMouseDown = function (event) {
        this.leftButtonPressed = this.isLeftButton(event);
        this.initialPosition = this.getScreenCoordinate(event);
    };
    Camera.prototype.onMouseUp = function (event) {
        if (this.isLeftButton(event)) {
            this.leftButtonPressed = false;
        }
    };
}());