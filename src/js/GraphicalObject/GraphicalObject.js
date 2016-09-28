/*jslint browser: true*/
/*global RUTAIMAGENMARTE, handleTexture, mat3*/
var GraphicalObject;
(function () {
    "use strict";
    GraphicalObject = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.gl = this.graphicContainer.getContext();
        this.bufferList = {"position": [], "normal": [], "texture_coord": [], "index": []};
    };
    GraphicalObject.prototype.mapBuffersToDataStore = function () {
        this.graphicContainer.createDataStore(this.bufferList);
    };
    GraphicalObject.prototype.draw = function (modelViewMatrix) {
        this.graphicContainer.defineGenericVertexAtributeArray();
        this.setTextureModelViewMatrixNormalMatrixTAndDraw(modelViewMatrix);
    };
    GraphicalObject.prototype.initializeTexture = function (texturePath) {
        var currentGraphicalObject = this;
        this.texture = this.gl.createTexture();
        this.texture.image = new Image();
        this.texture.image.onload = function () {
            currentGraphicalObject.generateMipMap();
        };
        this.texture.image.src = texturePath;
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
    GraphicalObject.prototype.setTextureModelViewMatrixNormalMatrixTAndDraw = function (modelViewMatrix) {
        this.graphicContainer.setModelMatrixNormalMatrixAndSamplerToShaderProgram(modelViewMatrix);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.graphicContainer.draw();
    };
}());