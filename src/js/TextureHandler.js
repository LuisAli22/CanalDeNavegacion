var TextureHandler;
(function () {
    "use strict";
    TextureHandler = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
    };
    TextureHandler.prototype.generateMipMap = function (texture) {
        this.graphicContainer.generateMipMap(texture);
    };
    TextureHandler.prototype.initializeTexture = function (texturePath) {
        var currrentTextureHandler = this;
        var texture = this.graphicContainer.createTexture();
        texture.image = new Image();
        texture.image.onload = function () {
            currrentTextureHandler.generateMipMap(texture);
        };
        texture.image.src = texturePath;
        return texture;
    };
}());