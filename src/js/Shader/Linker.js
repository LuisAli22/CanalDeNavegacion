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

        this.shaderProgram.lightingPositionUniform = this.gl.getUniformLocation(this.shaderProgram, "uLight.Position");
        this.shaderProgram.lightLa = this.gl.getUniformLocation(this.shaderProgram, "uLight.La");
        this.shaderProgram.lightLd = this.gl.getUniformLocation(this.shaderProgram, "uLight.Ld");
        this.shaderProgram.lightLs = this.gl.getUniformLocation(this.shaderProgram, "uLight.Ls");

        this.shaderProgram.materialKa = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Ka");
        this.shaderProgram.materialKd = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Kd");
        this.shaderProgram.materialKs = this.gl.getUniformLocation(this.shaderProgram, "uMaterial.Ks");

        this.shaderProgram.useNormalMap = this.gl.getUniformLocation(this.shaderProgram, "uUseNormalMap");
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