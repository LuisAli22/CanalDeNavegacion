/*jslint browser: true*/
/*global mat4, vec3, BOTONIZQUIERDODELMOUSE*/
var Camera;
(function () {
    "use strict";
    Camera = function (graphicContainer) {
        this.canvas = graphicContainer.getCanvas();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.gl = graphicContainer.getContext();
        this.eye = vec3.create();
        vec3.set(this.eye, 0, 0, 0);
        this.target = vec3.create();
        vec3.set(this.target, 0, 0, 0);
        this.up = vec3.create();
        vec3.set(this.up, 0, 1, 0);
        this.lookAtMatrix = mat4.create();
        this.initialPosition = [0, 0];
        this.endPosition = [0, 0];
        this.leftButtonPressed = false;
    };
    Camera.prototype.update = function () {
        mat4.identity(this.lookAtMatrix);
        this.setViewDirection();
        mat4.lookAt(this.lookAtMatrix, this.eye, this.target, this.up);
        this.gl.uniformMatrix4fv(this.shaderProgram.ViewMatrixUniform, false, this.lookAtMatrix);
    };
    Camera.prototype.isLeftButton = function (event) {
        return (event.which === BOTONIZQUIERDODELMOUSE);
    };
    Camera.prototype.getScreenCoordinate = function (event) {
        var x = event.clientX - this.canvas.offsetLeft;
        var y = event.clientY - this.canvas.offsetTop;
        return [x, y];
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