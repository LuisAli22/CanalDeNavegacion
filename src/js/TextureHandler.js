var TextureHandler;
(function () {
    "use strict";
    TextureHandler = function (graphicContainer) {
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
    };
    TextureHandler.prototype.generateMipMap = function (texture) {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };
    TextureHandler.prototype.initializeTexture = function (texturePath) {
        var currrentTextureHandler = this;
        var texture = this.gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
            currrentTextureHandler.generateMipMap(texture);
        };
        texture.image.src = texturePath;
        return texture;
    };
    TextureHandler.prototype.setTextureUniform = function (texture) {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);
    };
}());