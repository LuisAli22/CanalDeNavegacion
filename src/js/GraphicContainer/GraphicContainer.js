/*jslint browser: true*/
/*global CANVASERRORMESSAGE, CANVASCONTEXTERROR,FRAGMENTSHADERID,VERTEXSHADERID, Linker,Compiler, vec3*/
var GraphicContainer;
(function () {
    "use strict";
    GraphicContainer = function () {
        this.canvas = document.getElementById("TpSistemasGraficosCanvas");
        if (!this.canvas) {
            throw new Error(CANVASERRORMESSAGE);
        }
        this.gl = this.canvas.getContext("experimental-webgl");
        if (!this.gl) {
            throw new Error(CANVASCONTEXTERROR);
        }
        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;
        this.shaderProgram = this.gl.createProgram();
        this.compileAndLinkShaders();
    };
    GraphicContainer.prototype.contextColorBlack = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    };
    GraphicContainer.prototype.contextEnableDepthTest = function () {
        this.gl.enable(this.gl.DEPTH_TEST);
    };
    GraphicContainer.prototype.configureLighting = function () {
        var lighting = 1;
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);
        var lightPosition = vec3.fromValues(-100.0, 0.0, -60.0);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);

        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.05, 0.05, 0.05);
    };
    GraphicContainer.prototype.getCompiledShader = function (shaderIdentifier, shaderType) {
        var compiler = new Compiler(shaderIdentifier, shaderType, this.gl);
        return compiler.start();
    };
    GraphicContainer.prototype.compileAndLinkShaders = function () {
        var fragmentShader = this.getCompiledShader(FRAGMENTSHADERID, this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getCompiledShader(VERTEXSHADERID, this.gl.VERTEX_SHADER);
        var linker = new Linker(vertexShader, fragmentShader, this.shaderProgram, this.gl);
        linker.start();
    };
    GraphicContainer.prototype.setViewPort = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    };
    GraphicContainer.prototype.clearBuffer = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    GraphicContainer.prototype.getAspectRatio = function () {
        return (this.gl.viewportWidth / this.gl.viewportHeight);
    };
    GraphicContainer.prototype.getShaderProgram = function () {
        return this.shaderProgram;
    };
    GraphicContainer.prototype.uniformMatrix4fv = function (location, transpose, value) {
        this.gl.uniformMatrix4fv(location, transpose, value);
    };
    GraphicContainer.prototype.getContext = function () {
        return this.gl;
    };
    GraphicContainer.prototype.getCanvas = function () {
        return this.canvas;
    };
}());