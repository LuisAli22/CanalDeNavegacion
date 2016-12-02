/*jslint browser: true*/
/*global AVERTEXPOSITION, ATEXTURECOORD, AVERTEXNORMAL, UPMATRIX, UVIEWMATRIX, UMODELMATRIX, UNMATRIX, USAMPLER, UUSELIGHTING, UAMBIENTCOLOR, ULIGHTPOSITION, UDIRECTIONALCOLOR, PROGRAMPARAM*/
var Linker;
(function () {
    "use strict";
    Linker = function (vertexShaderObject, fragmentShaderObject, shaderProgram, gl) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.vertexShader = vertexShaderObject;
        this.fragmentShader = fragmentShaderObject;
    };
    Linker.prototype.assignLocationToShaderProgramVariables = function () {
        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

        this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);

        this.shaderProgram.vertexTangentAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexTangent");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexTangentAttribute);

        this.shaderProgram.vertexBinormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexBinormal");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexBinormalAttribute);

        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.shaderProgram.inverseVMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uInverseVMatrix");
        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.shaderProgram.nMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uNMatrix");
        this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
        this.shaderProgram.cubeSamplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uCubeSampler");
        this.shaderProgram.samplerNormal = this.gl.getUniformLocation(this.shaderProgram, "uNormalSampler");

        this.shaderProgram.lightingPositionUniform = this.gl.getUniformLocation(this.shaderProgram, "uLight.Position");
        this.shaderProgram.lightLa = this.gl.getUniformLocation(this.shaderProgram, "uLight.La");
        this.shaderProgram.lightLd = this.gl.getUniformLocation(this.shaderProgram, "uLight.Ld");
        this.shaderProgram.lightLs = this.gl.getUniformLocation(this.shaderProgram, "uLight.Ls");

        this.shaderProgram.materialKa = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Ka");
        this.shaderProgram.materialKd = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Kd");
        this.shaderProgram.materialKs = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Ks");

        this.shaderProgram.materialShininess = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Shininess");

        this.shaderProgram.useWaveEffectUniform = this.gl.getUniformLocation(this.shaderProgram, "uUseWaveEffect");
        this.shaderProgram.wavesAmplitudesUniform = this.gl.getUniformLocation(this.shaderProgram, "uWavesAmplitudes");
        this.shaderProgram.wavesDirectionsUniform = this.gl.getUniformLocation(this.shaderProgram, "uWavesDirections");
        this.shaderProgram.wavesFrequenciesUniform = this.gl.getUniformLocation(this.shaderProgram, "uWavesFrequencies");
        this.shaderProgram.wavesPhasesUniform = this.gl.getUniformLocation(this.shaderProgram, "uWavesPhases");
        this.shaderProgram.textureWavesDisplacementsUniform = this.gl.getUniformLocation(this.shaderProgram, "uTextureWavesDisplacements");
        this.shaderProgram.waveTimeUniform = this.gl.getUniformLocation(this.shaderProgram, "uWaveTime");

        this.shaderProgram.useNormalMap = this.gl.getUniformLocation(this.shaderProgram, "uUseNormalMap");

        this.shaderProgram.useBlendingUniform = this.gl.getUniformLocation(this.shaderProgram, "uUseBlending");
        this.shaderProgram.alphaUniform = this.gl.getUniformLocation(this.shaderProgram, "uAlpha");

        this.shaderProgram.useReflectionUniform = this.gl.getUniformLocation(this.shaderProgram, "uUseReflection");
        this.shaderProgram.drawSkyBoxUniform = this.gl.getUniformLocation(this.shaderProgram, "uDrawSkyBox");
        this.shaderProgram.reflectFactorUniform = this.gl.getUniformLocation(this.shaderProgram, "uReflectFactor");
    };
    Linker.prototype.start = function () {
        this.gl.attachShader(this.shaderProgram, this.vertexShader);
        this.gl.attachShader(this.shaderProgram, this.fragmentShader);
        this.gl.linkProgram(this.shaderProgram);
        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            throw new Error(PROGRAMPARAM);
        }
        this.gl.useProgram(this.shaderProgram);
        this.assignLocationToShaderProgramVariables();
    };
}());