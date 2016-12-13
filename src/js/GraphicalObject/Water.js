/*global vec3, TextureHandler, vec2, mat4, ModelViewMatrixStack, Grid*/
var Water;
(function () {
    "use strict";
    Water = function (graphicContainer, dimZ, dimX, nz, nx, center) {
        this.graphicContainer = graphicContainer;
        this.center = center;
        this.waterLevel = -5;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.nx = nx;
        this.nz = nz;
        this.uTextureScale = 50 / (this.nz - 1);
        this.vTextureScale = 50 / (this.nx - 1);
        this.texture = this.textureHandler.initializeTexture(["img/aguaDeMar.jpg"]);
        this.textureNormal = this.textureHandler.initializeTexture(["img/aguaDeMarNormalMap.png"]);
        this.grid = new Grid(graphicContainer, dimZ, dimX, nz, nx, this.uTextureScale, this.vTextureScale);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.9, 0.9, 0.9];
        this.materialShininess = 40.0;
        this.alpha = 0.75;
        this.reflectFactor = 1.0;
        this.lastTime = 0;

        this.wavesNumber = 4;
        this.wavesAmplitudes = [];
        this.wavesDirections = [];
        this.wavesFrequencies = [];
        this.wavesPhases = [];
        this.textureWavesDisplacements = [];
        this.waveTime = 0;

        this.initWaves();
        this.initShaderUniforms();
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    };
    Water.prototype.initWaves = function () {
        var i;
        var angle;
        var direction;
        var waveLength;
        var speed;
        var uDisplacement;
        var vDisplacement;
        for (i = 0; i < this.wavesNumber; i += 1) {
            this.wavesAmplitudes.push(0.08 / (i + 1));
            angle = -(Math.PI / 3) + (2 * Math.PI / 3) * Math.random();
            direction = vec2.fromValues(Math.sin(angle), Math.cos(angle));
            this.wavesDirections.push(direction[0], direction[1]);
            waveLength = (8 * Math.PI) / (i + 1);
            this.wavesFrequencies.push((2 * Math.PI) / waveLength);
            speed = (0.5 + i) / 2;
            this.wavesPhases.push((speed * 2 * Math.PI) / waveLength);
            direction = vec2.normalize(vec2.create(), direction);

            uDisplacement = direction[0] * ((this.uTextureScale * (this.nz - 1)) / this.nz) * 0.5 * speed;
            vDisplacement = direction[1] * ((this.vTextureScale * (this.nx - 1)) / this.nx) * 0.5 * speed;
            this.textureWavesDisplacements.push(uDisplacement, vDisplacement);
        }
    };
    Water.prototype.initShaderUniforms = function () {
        this.gl.uniform1fv(this.shaderProgram.wavesAmplitudesUniform, this.wavesAmplitudes);
        this.gl.uniform2fv(this.shaderProgram.wavesDirectionsUniform, this.wavesDirections);
        this.gl.uniform1fv(this.shaderProgram.wavesFrequenciesUniform, this.wavesFrequencies);
        this.gl.uniform1fv(this.shaderProgram.wavesPhasesUniform, this.wavesPhases);
        this.gl.uniform2fv(this.shaderProgram.textureWavesDisplacementsUniform, this.textureWavesDisplacements);
    };
    Water.prototype.animate = function () {
        var date = new Date();
        var timeNow = date.getTime();
        if (this.lastTime !== 0) {
            var elapsed = timeNow - this.lastTime;
            this.waveTime += elapsed;
        }
        this.lastTime = timeNow;
    };

    Water.prototype.draw = function (modelViewMatrix) {
        this.animate();
        this.gl.enable(this.gl.BLEND);
        this.textureHandler.setTextureUniform(this.texture);
        this.textureHandler.setTextureNormal(this.textureNormal, this.texture.length);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
        this.gl.uniform1i(this.shaderProgram.useBlendingUniform, 1);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 1);
        this.gl.uniform1f(this.shaderProgram.alphaUniform, this.alpha);
        this.gl.uniform1i(this.shaderProgram.useWaveEffectUniform, 1);
        this.gl.uniform1f(this.shaderProgram.reflectFactorUniform, this.reflectFactor);
        this.gl.uniform1f(this.shaderProgram.waveTimeUniform, this.waveTime / 1000);
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.center[0], this.waterLevel, this.center[2]));
        this.grid.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        this.gl.uniform1i(this.shaderProgram.useBlendingUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useWaveEffectUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        this.gl.disable(this.gl.BLEND);
    };
}());
