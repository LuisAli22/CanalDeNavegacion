/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3, WebGlRenderingContext*/
var ThreeDimensionRenderingContext;
(function () {
    "use strict";
    ThreeDimensionRenderingContext = function (canvas, fragmentShaderIdentifier, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvas, "experimental-webgl");
        this.fragmentShaderIdentifier = fragmentShaderIdentifier;
        this.vertexShaderIdentifier = vertexShaderIdentifier;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        this.offsetLeft = canvas.offsetLeft;
        this.offsetTop = canvas.offsetTop;
        this.shaderProgram = this.gl.createProgram();
        this.compileAndLinkShaders();
    };
    ThreeDimensionRenderingContext.prototype = Object.create(WebGlRenderingContext.prototype);
    ThreeDimensionRenderingContext.constructor = ThreeDimensionRenderingContext;
    ThreeDimensionRenderingContext.prototype.getContext = function () {
        return this.gl;
    };
    ThreeDimensionRenderingContext.prototype.getShaderProgram = function () {
        return this.shaderProgram;
    };
    ThreeDimensionRenderingContext.prototype.getCompiledShader = function (shaderIdentifier, shaderType) {
        var compiler = new Compiler(shaderIdentifier, shaderType, this.gl);
        return compiler.start();
    };
    ThreeDimensionRenderingContext.prototype.compileAndLinkShaders = function () {
        var fragmentShader = this.getCompiledShader(this.fragmentShaderIdentifier, this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getCompiledShader(this.vertexShaderIdentifier, this.gl.VERTEX_SHADER);
        var linker = new Linker(vertexShader, fragmentShader, this.shaderProgram, this.gl);
        linker.start();
    };
    ThreeDimensionRenderingContext.prototype.setMaterialUniforms = function (ka, kd, ks) {
        this.gl.uniform3fv(this.shaderProgram.materialKa, ka);
        this.gl.uniform3fv(this.shaderProgram.materialKd, kd);
        this.gl.uniform3fv(this.shaderProgram.materialKs, ks);
    };
    ThreeDimensionRenderingContext.prototype.setMatrixUniforms = function (modelViewMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, modelViewMatrix);
        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelViewMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
    };
}());