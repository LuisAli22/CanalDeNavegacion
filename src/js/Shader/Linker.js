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
        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, AVERTEXPOSITION);
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
        this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, ATEXTURECOORD);
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
        this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, AVERTEXNORMAL);
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
        this.shaderProgram.vertexTangentAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexTangent");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexTangentAttribute);
        this.shaderProgram.vertexBinormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexBinormal");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexBinormalAttribute);
        this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, UPMATRIX);
        this.shaderProgram.ViewMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, UVIEWMATRIX);
        this.shaderProgram.ModelMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, UMODELMATRIX);
        this.shaderProgram.nMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, UNMATRIX);
        this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, USAMPLER);
        this.shaderProgram.useLightingUniform = this.gl.getUniformLocation(this.shaderProgram, UUSELIGHTING);
        this.shaderProgram.ambientColorUniform = this.gl.getUniformLocation(this.shaderProgram, UAMBIENTCOLOR);
        this.shaderProgram.lightingDirectionUniform = this.gl.getUniformLocation(this.shaderProgram, ULIGHTPOSITION);
        this.shaderProgram.directionalColorUniform = this.gl.getUniformLocation(this.shaderProgram, UDIRECTIONALCOLOR);
        this.shaderProgram.useTextureUniform = this.gl.getUniformLocation(this.shaderProgram, "uUseTexture");
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