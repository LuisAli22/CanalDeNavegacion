/*global TextureHandler, Cube, ModelViewMatrixStack, mat4, vec3, SKYDIMENSION*/
var Sky;
(function () {
    "use strict";
    Sky = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initCubemapTexture(this.initTextureSources());
        this.cube = new Cube(graphicContainer);
    };
    Sky.prototype.draw = function (modelViewMatrix) {
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 1);
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
        this.gl.uniform1i(this.shaderProgram.drawSkyBoxUniform, 1);
        this.textureHandler.setCubemapTextureUniform(this.texture);

        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI / 2, vec3.fromValues(0, 1, 0));
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(-1 / 2, 1 / 2, -1 / 2));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(SKYDIMENSION, SKYDIMENSION, SKYDIMENSION));
        this.cube.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());

        this.gl.uniform1i(this.shaderProgram.drawSkyBoxUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);
    };
    Sky.prototype.initTextureSources = function () {
        var sources = {};
        sources[this.gl.TEXTURE_CUBE_MAP_POSITIVE_X] = "img/sky_posx.png";
        sources[this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X] = "img/sky_negx.png";
        sources[this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y] = "img/sky_posy.png";
        sources[this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y] = "img/sky_negy.png";
        sources[this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z] = "img/sky_posz.png";
        sources[this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z] = "img/sky_negz.png";

        return sources;
    };
}());