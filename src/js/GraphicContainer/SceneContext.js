/*jslint browser: true*/
/*global vec3, WebGlRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID*/
var SceneContext;
(function () {
    "use strict";
    SceneContext = function (canvasID, fragmentShaderIdentifier, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvasID, fragmentShaderIdentifier, vertexShaderIdentifier);
    };
    SceneContext.prototype = Object.create(WebGlRenderingContext.prototype);
    SceneContext.prototype.constructor = SceneContext;
    SceneContext.prototype.contextColor = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    };
    SceneContext.prototype.configureLighting = function () {
        var lighting = 1;
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);
        var lightPosition = vec3.fromValues(-100.0, 0.0, -60.0);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.05, 0.05, 0.05);
    };
}());