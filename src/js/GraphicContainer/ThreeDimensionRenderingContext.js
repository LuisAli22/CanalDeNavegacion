/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3, WebGlRenderingContext*/
var ThreeDimensionRenderingContext;
(function () {
    "use strict";
    ThreeDimensionRenderingContext = function (canvas, fragmentShaderIdentifier, vertexShaderIdentifier) {
        WebGlRenderingContext.call(this, canvas, "experimental-webgl");
        this.fragmentShaderIdentifier = fragmentShaderIdentifier;
        this.vertexShaderIdentifier = vertexShaderIdentifier;
        this.gl.viewportWidth = canvas.width;
        this.gl.viewportHeight = canvas.height;
        this.offsetLeft = canvas.offsetLeft;
        this.offsetTop = canvas.offsetTop;
        this.shaderProgram = this.gl.createProgram();
        this.compileAndLinkShaders();
    };
    ThreeDimensionRenderingContext.prototype = Object.create(WebGlRenderingContext.prototype);
    ThreeDimensionRenderingContext.constructor = ThreeDimensionRenderingContext;
    ThreeDimensionRenderingContext.prototype.getContext = function () {
        return this.gl;
    };
    ThreeDimensionRenderingContext.prototype.getShaderProgram = function () {
        return this.shaderProgram;
    };
    ThreeDimensionRenderingContext.prototype.getCompiledShader = function (shaderIdentifier, shaderType) {
        var compiler = new Compiler(shaderIdentifier, shaderType, this.gl);
        return compiler.start();
    };
    ThreeDimensionRenderingContext.prototype.compileAndLinkShaders = function () {
        var fragmentShader = this.getCompiledShader(this.fragmentShaderIdentifier, this.gl.FRAGMENT_SHADER);
        var vertexShader = this.getCompiledShader(this.vertexShaderIdentifier, this.gl.VERTEX_SHADER);
        var linker = new Linker(vertexShader, fragmentShader, this.shaderProgram, this.gl);
        linker.start();
    };
}());