/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3, WebGlRenderingContext*/
var ThreeDimensionRenderingContext;
(function () {
    "use strict";
    ThreeDimensionRenderingContext = function (canvas, fragmentShaderIdentifier, fragmentShaderGround, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvas, "experimental-webgl");
        this.fragmentShaderIdentifier = fragmentShaderIdentifier;
        this.fragmentShaderGroundId = fragmentShaderGround;
        this.vertexShaderIdentifier = vertexShaderIdentifier;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        this.offsetLeft = canvas.offsetLeft;
        this.offsetTop = canvas.offsetTop;
        this.shaderProgram = this.gl.createProgram();
        this.terrainShaderProgram = this.gl.createProgram();
        this.compileAndLinkShaders();
    };
    ThreeDimensionRenderingContext.prototype = Object.create(WebGlRenderingContext.prototype);
    ThreeDimensionRenderingContext.constructor = ThreeDimensionRenderingContext;
    ThreeDimensionRenderingContext.prototype.getContext = function () {
        return this.gl;
    };
    ThreeDimensionRenderingContext.prototype.useDefaultShaderProgram = function () {
        this.gl.useProgram(this.shaderProgram);
        this.linker.assignLocationToShaderProgramVariables();
    };
    ThreeDimensionRenderingContext.prototype.useTerrainShaderProgram = function () {
        this.gl.useProgram(this.terrainShaderProgram);
        this.linker.assignLocationToTerrainShaderProgramVariables();
    };
    ThreeDimensionRenderingContext.prototype.getShaderProgram = function () {
        return this.shaderProgram;
    };
    ThreeDimensionRenderingContext.prototype.getTerrainShaderProgram = function () {
        return this.terrainShaderProgram;
    };
    ThreeDimensionRenderingContext.prototype.getCompiledShader = function (shaderIdentifier, shaderType) {
        var compiler = new Compiler(shaderIdentifier, shaderType, this.gl);
        return compiler.start();
    };
    ThreeDimensionRenderingContext.prototype.compileAndLinkShaders = function () {
        var fragmentShader = this.getCompiledShader(this.fragmentShaderIdentifier, this.gl.FRAGMENT_SHADER);
        var fragmentShaderGround = this.getCompiledShader(this.fragmentShaderGroundId, this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getCompiledShader(this.vertexShaderIdentifier, this.gl.VERTEX_SHADER);
        this.linker = new Linker(vertexShader, fragmentShader, fragmentShaderGround, this.shaderProgram, this.terrainShaderProgram, this.gl);
        this.linker.start();
    };
    ThreeDimensionRenderingContext.prototype.setMaterialUniforms = function (ka, kd, ks, shininess, useTerrainProgram) {
        if (useTerrainProgram) {
            this.gl.uniform3fv(this.terrainShaderProgram.materialKa, ka);
            this.gl.uniform3fv(this.terrainShaderProgram.materialKd, kd);
            this.gl.uniform3fv(this.terrainShaderProgram.materialKs, ks);
            this.gl.uniform1f(this.terrainShaderProgram.materialShininess, shininess);
        } else {
            this.gl.uniform3fv(this.shaderProgram.materialKa, ka);
            this.gl.uniform3fv(this.shaderProgram.materialKd, kd);
            this.gl.uniform3fv(this.shaderProgram.materialKs, ks);
            this.gl.uniform1f(this.shaderProgram.materialShininess, shininess);
        }
    };
    ThreeDimensionRenderingContext.prototype.setMatrixUniforms = function (modelViewMatrix) {
        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelViewMatrix);
        this.gl.uniformMatrix4fv(this.terrainShaderProgram.mvMatrixUniform, false, modelViewMatrix);
        this.gl.uniformMatrix3fv(this.terrainShaderProgram.nMatrixUniform, false, normalMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, modelViewMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
    };
}());