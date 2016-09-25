/*jslint browser: true*/
/*global handleLoadedTexture, RUTAIMAGENMARTE, Float32Array, Uint16Array, mat3*/
var GraphicalObject;
(function () {
    "use strict";
    GraphicalObject = function (graphicContainer) {
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.gl = graphicContainer.getContext();
        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        this.texture = null;
        this.normal_buffer = [];
        this.position_buffer = [];
        this.texture_coord_buffer = [];
        this.index_buffer = [];
    };
    GraphicalObject.prototype.initializeTexture = function () {
        var aux_texture = this.gl.createTexture();
        var currentGraphicalObject = this;
        this.texture = aux_texture;
        this.texture.image = new Image();
        this.texture.image.onload = function () {
            currentGraphicalObject.generateMipMap();
        };
        this.texture.image.src = RUTAIMAGENMARTE;
    };
    GraphicalObject.prototype.generateMipMap = function () {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };
    GraphicalObject.prototype.mapBuffersToDataStore = function () {
        this.webgl_normal_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), this.gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;
        this.webgl_texture_coord_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), this.gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;
        this.webgl_position_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), this.gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;
        this.webgl_index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), this.gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
    };
    GraphicalObject.prototype.draw = function (modelViewMatrix) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.uniformMatrix4fv(this.shaderProgram.ModelMatrixUniform, false, modelViewMatrix);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
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
}());