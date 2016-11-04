var TextureHandler = (function () {
    "use strict";
    var instance;

    function init(graphicContainer) {
        var gl = graphicContainer.getContext();
        var shaderProgram = graphicContainer.getShaderProgram();
        return {
            generateMipMap: function (texture) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
            },
            initializeTexture: function (texturePath) {
                var currrentTextureHandler = this;
                var texture = gl.createTexture();
                texture.image = new Image();
                texture.image.onload = function () {
                    currrentTextureHandler.generateMipMap(texture);
                };
                texture.image.src = texturePath;
                return texture;
            },
            setTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            }
        };
    }

    return {
        getInstance: function (graphicContainer) {
            if (!instance) {
                instance = init(graphicContainer);
            }
            return instance;
        }
    };
}());