var TextureHandler = (function () {
    "use strict";
    var instance;

    function init(graphicContainer) {
        var gl = graphicContainer.getContext();
        var shaderProgram = graphicContainer.getShaderProgram();
        var terrainShaderProgram = graphicContainer.getTerrainShaderProgram();

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
            initializeTexture: function (path) {
                var currrentTextureHandler = this;
                var texture = gl.createTexture();
                texture.image = new Image();
                texture.image.onload = function () {
                    currrentTextureHandler.generateMipMap(texture);
                };
                texture.image.src = path;
                return texture;
            },
            setTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            },
            setTextureNormal: function (normalTexture) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, normalTexture);
                gl.uniform1i(shaderProgram.samplerNormal, 1);
            },
            setCubemapTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.uniform1i(shaderProgram.cubeSamplerUniform, 2);
            },
            setGrassTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.grassSamplerUniform, 0);
            },
            setRockTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.rockSamplerUniform, 1);
            },
            setSandTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.sandSamplerUniform, 2);
            },
            setGrassNormalTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE3);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.grassNormalSamplerUniform, 3);
            },
            setRockNormalTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE4);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.rockNormalSamplerUniform, 4);
            },
            setSandNormalTextureUniform: function (texture) {
                gl.activeTexture(gl.TEXTURE5);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(terrainShaderProgram.sandNormalSamplerUniform, 5);

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