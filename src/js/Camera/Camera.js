/*jslint browser: true*/
/*global mat4, vec2, vec3, TwoDimensionCamera*/
var Camera;
(function () {
    "use strict";
    Camera = function (sceneGraphicContainer) {
        this.sceneGraphicContainer = sceneGraphicContainer;
        this.gl = sceneGraphicContainer.getContext();
        this.shaderProgram = this.sceneGraphicContainer.getShaderProgram();
        this.eye = vec3.create();
        vec3.set(this.eye, 0, 0, 0);
        this.target = vec3.create();
        vec3.set(this.target, 0, 0, 0);
        this.up = vec3.create();
        vec3.set(this.up, 0, 1, 0);
        this.lookAtMatrix = mat4.create();
    };
    Camera.prototype.update = function () {
        mat4.identity(this.lookAtMatrix);
        this.setTargetAnEyePositions();
    };
    Camera.prototype.getMatrix = function () {
        return mat4.lookAt(this.lookAtMatrix, this.eye, this.target, this.up);
    };
}());