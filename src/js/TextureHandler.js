var TextureHandler = (function () {
    "use strict";
    var instance;

    function init(graphicContainer) {
        var gl = graphicContainer.getContext();
        var shaderProgram = graphicContainer.getShaderProgram();

        function loadCubemapFace(target, texture, src) {
            var image = new Image();
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            };
            image.src = src;
        }

        return {
            generateMipMap: function (texture) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
            },
            initializeTexture: function (texturePaths) {
                var textures = [];
                var currrentTextureHandler = this;
                texturePaths.forEach(function (path) {
                    var texture = gl.createTexture();
                    texture.image = new Image();
                    texture.image.onload = function () {
                        currrentTextureHandler.generateMipMap(texture);
                    };
                    texture.image.src = path;
                    textures.push(texture);
                }, this);
                return textures.slice(0);
            },
            setTextureUniform: function (textures) {
                textures.forEach(function (texture, index) {
                    gl.activeTexture(gl.TEXTURE0 + index);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.uniform1i(shaderProgram.samplerUniform, index);
                }, this);
            },
            setTextureNormal: function (normalTextures, textureUnitIndex) {
                normalTextures.forEach(function (normalTexture, index) {
                    gl.activeTexture(gl.TEXTURE0 + textureUnitIndex + index);
                    gl.bindTexture(gl.TEXTURE_2D, normalTexture);
                    gl.uniform1i(shaderProgram.samplerNormal, textureUnitIndex + index);
                }, this);
            },
            setCubemapTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.uniform1i(shaderProgram.cubeSamplerUniform, 2);
            },
            initCubemapTexture: function (sources) {
                var cubeTexture = gl.createTexture();

                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                Object.keys(sources).forEach(function (property) {
                    loadCubemapFace(property, cubeTexture, sources[property]);
                });

                return cubeTexture;
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