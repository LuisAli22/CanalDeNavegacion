/*global vec3, Calculator, TextureHandler, riverMap, SweptSurface, vec2, mat4, ModelViewMatrixStack*/
var Water;
(function () {
    "use strict";
    Water = function (graphicContainer, rivertWidth, levelControlPointsAmount, riverWidthStep) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.riverWidth = rivertWidth;
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.riverWidthStep = riverWidthStep;
        this.waterLevelGeometry = [];
        this.createLevelPoints();
        this.nx = this.waterLevelGeometry.length / 3;
        this.nz = riverMap.trajectory.length / 3;
        this.uTextureScale = 3 / (this.nz - 1);
        this.vTextureScale = 3 / (this.nx - 1);
        this.texture = this.textureHandler.initializeTexture("img/aguaDeMar.jpg");
        this.textureNormal = this.textureHandler.initializeTexture("img/aguaDeMarNormalMap.png");
        this.sweptSurface = new SweptSurface(graphicContainer, this.waterLevelGeometry, riverMap.trajectory, null, false);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.9, 0.9, 0.9];
        this.materialShininess = 40.0;
        this.alpha = 0.9;
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
            this.wavesAmplitudes.push(0.15 / (i + 1));
            angle = -(Math.PI / 3) + (2 * Math.PI / 3) * Math.random();
            direction = vec2.fromValues(Math.sin(angle), Math.cos(angle));
            this.wavesDirections.push(direction[0], direction[1]);
            waveLength = (8 * Math.PI) / (i + 1);
            this.wavesFrequencies.push((2 * Math.PI) / waveLength);
            speed = 0.5 + i;
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

    Water.prototype.createLevelPoints = function () {
        var controlPointIndex;
        var currentPoint;
        var xCoordinate = (-1 * this.riverWidth) / 2;
        var yCoordinate = -1;
        var levelPointsPosition = [];
        for (controlPointIndex = 0; controlPointIndex <= this.levelControlPointsAmount; controlPointIndex += 1) {
            currentPoint = vec3.fromValues(xCoordinate, yCoordinate, 0);
            levelPointsPosition.push(currentPoint);
            xCoordinate += this.riverWidthStep;
        }
        var calculator = Calculator.getInstance();
        calculator.storePositionsTangentNormalAndBinormal(levelPointsPosition, this.waterLevelGeometry);
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
        this.textureHandler.setTextureNormal(this.textureNormal);
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
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, -1.5, 0));
        this.sweptSurface.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        this.gl.uniform1i(this.shaderProgram.useBlendingUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useWaveEffectUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 0);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        this.gl.disable(this.gl.BLEND);
    };
}());
