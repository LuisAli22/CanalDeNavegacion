/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3, WebGlRenderingContext*/
var ThreeDimensionRenderingContext;
(function () {
    "use strict";
    ThreeDimensionRenderingContext = function (canvas, fragmentShaderIdentifier, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvas, "experimental-webgl");
        this.fragmentShaderIdentifier = fragmentShaderIdentifier;
        this.vertexShaderIdentifier = vertexShaderIdentifier;
        this.webgl_position_buffer = this.gl.createBuffer();
        this.webgl_normal_buffer = this.gl.createBuffer();
        this.webgl_texture_coord_buffer = this.gl.createBuffer();
        this.webgl_index_buffer = this.gl.createBuffer();
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        this.offsetLeft = canvas.offsetLeft;
        this.offsetTop = canvas.offsetTop;
        this.shaderProgram = this.gl.createProgram();
        this.compileAndLinkShaders();
    };
    ThreeDimensionRenderingContext.prototype = Object.create(WebGlRenderingContext.prototype);
    ThreeDimensionRenderingContext.constructor = ThreeDimensionRenderingContext;
    ThreeDimensionRenderingContext.prototype.contextEnableDepthTest = function () {
        this.gl.enable(this.gl.DEPTH_TEST);
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
    ThreeDimensionRenderingContext.prototype.setViewPort = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    };
    ThreeDimensionRenderingContext.prototype.clearBuffer = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    ThreeDimensionRenderingContext.prototype.createDataStore = function (dataBufferList) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(dataBufferList.normal), this.gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = dataBufferList.normal.length / 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(dataBufferList.texture_coord), this.gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = dataBufferList.texture_coord.length / 2;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(dataBufferList.position), this.gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = dataBufferList.position.length / 3;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dataBufferList.index), this.gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = dataBufferList.index.length;
    };
    ThreeDimensionRenderingContext.prototype.getAspectRatio = function () {
        return (this.gl.viewportWidth / this.gl.viewportHeight);
    };
    ThreeDimensionRenderingContext.prototype.createBuffer = function () {
        return this.gl.createBuffer();
    };
    ThreeDimensionRenderingContext.prototype.createTexture = function () {
        return this.gl.createTexture();
    };
    ThreeDimensionRenderingContext.prototype.contextColor = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    };
    ThreeDimensionRenderingContext.prototype.configureLighting = function () {
        var lighting = 1;
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);
        var lightPosition = vec3.fromValues(-100.0, 0.0, -60.0);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.05, 0.05, 0.05);
    };
    ThreeDimensionRenderingContext.prototype.uniformMatrix4fv = function (location, transpose, value) {
        this.gl.uniformMatrix4fv(location, transpose, value);
    };
    ThreeDimensionRenderingContext.prototype.defineGenericVertexAtributeArray = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    };
    ThreeDimensionRenderingContext.prototype.setViewMatrixToShaderProgram = function (lookAtMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.ViewMatrixUniform, false, lookAtMatrix);
    };
    ThreeDimensionRenderingContext.prototype.setProjectionMatrixToShaderProgram = function (projectionMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, projectionMatrix);
    };
    ThreeDimensionRenderingContext.prototype.setModelMatrixNormalMatrixAndSamplerToShaderProgram = function (modelViewMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.ModelMatrixUniform, false, modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelViewMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
    };
    ThreeDimensionRenderingContext.prototype.draw = function () {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    };
    ThreeDimensionRenderingContext.prototype.getContext = function () {
        return this.gl;
    };
}());