/*jslint browser: true*/
/*jslint browser: true*/
/*global vec3, WebGlRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID*/
var RiverMapContext;
(function () {
    "use strict";
    RiverMapContext = function (canvasID, fragmentShaderIdentifier, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvasID, fragmentShaderIdentifier, vertexShaderIdentifier);
    };
    RiverMapContext.prototype = Object.create(WebGlRenderingContext.prototype);
    RiverMapContext.prototype.constructor = RiverMapContext;
    RiverMapContext.prototype.contextColor = function () {
        this.gl.clearColor(0.211, 0.211, 0.211, 0.5);
    };
    RiverMapContext.prototype.configureLighting = function () {
        var lighting = 1;
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);
        var lightPosition = vec3.fromValues(-100.0, 0.0, -60.0);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.05, 0.05, 0.05);
    };
}());