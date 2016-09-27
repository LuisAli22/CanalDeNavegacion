/**
 * Created by LuisAli22 on 26/09/16.
 */
/*jslint browser: true*/
/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3, RUTAIMAGENMARTE*/
var WebGlRenderingContext;
(function () {
    "use strict";
    WebGlRenderingContext = function (canvas, fragmentShaderIdentifier, vertexShaderIdentifier) {
        this.fragmentShaderIdentifier = fragmentShaderIdentifier;
        this.vertexShaderIdentifier = vertexShaderIdentifier;
        this.gl = canvas.getContext("experimental-webgl");
        if (!this.gl) {
            throw new Error(CANVASCONTEXTERROR);
        }
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
    WebGlRenderingContext.prototype.contextEnableDepthTest = function () {
        this.gl.enable(this.gl.DEPTH_TEST);
    };
    WebGlRenderingContext.prototype.getCompiledShader = function (shaderIdentifier, shaderType) {
        var compiler = new Compiler(shaderIdentifier, shaderType, this.gl);
        return compiler.start();
    };
    WebGlRenderingContext.prototype.compileAndLinkShaders = function () {
        var fragmentShader = this.getCompiledShader(this.fragmentShaderIdentifier, this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getCompiledShader(this.vertexShaderIdentifier, this.gl.VERTEX_SHADER);
        var linker = new Linker(vertexShader, fragmentShader, this.shaderProgram, this.gl);
        linker.start();
    };
    WebGlRenderingContext.prototype.setViewPort = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    };
    WebGlRenderingContext.prototype.clearBuffer = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    WebGlRenderingContext.prototype.createDataStore = function (dataBufferList) {
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
    WebGlRenderingContext.prototype.getAspectRatio = function () {
        return (this.gl.viewportWidth / this.gl.viewportHeight);
    };
    WebGlRenderingContext.prototype.createBuffer = function () {
        return this.gl.createBuffer();
    };
    WebGlRenderingContext.prototype.createTexture = function () {
        return this.gl.createTexture();
    };
    WebGlRenderingContext.prototype.uniformMatrix4fv = function (location, transpose, value) {
        this.gl.uniformMatrix4fv(location, transpose, value);
    };
    WebGlRenderingContext.prototype.defineGenericVertexAtributeArray = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
    };
    WebGlRenderingContext.prototype.setTextureModelViewMatrixNormalMatrixTAndDraw = function (modelViewMatrix, texture) {
        this.gl.uniformMatrix4fv(this.shaderProgram.ModelMatrixUniform, false, modelViewMatrix);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelViewMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    };
    WebGlRenderingContext.prototype.setViewMatrixToShaderProgram = function (lookAtMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.ViewMatrixUniform, false, lookAtMatrix);
    };
    WebGlRenderingContext.prototype.setProjectionMatrixToShaderProgram = function (projectionMatrix) {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, projectionMatrix);
    };
    WebGlRenderingContext.prototype.initializeTexture = function () {
        var aux_texture = this.gl.createTexture();
        var currentGraphicalObject = this;
        this.texture = aux_texture;
        this.texture.image = new Image();
        this.texture.image.onload = function () {
            currentGraphicalObject.generateMipMap();
        };
        this.texture.image.src = RUTAIMAGENMARTE;
    };
    WebGlRenderingContext.prototype.generateMipMap = function () {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };
}());