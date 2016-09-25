/*jslint browser: true*/
/*global MENSAJEERRORSHADER, $*/
var Compiler;
(function () {
    "use strict";
    Compiler = function (shaderIdentifier, shaderType, gl) {
        this.gl = gl;
        this.script = document.getElementById(shaderIdentifier);
        if (!this.script) {
            throw new Error(MENSAJEERRORSHADER + ": " + shaderIdentifier);
        }
        this.textContent = this.getSourceCode();
        this.shaderObjectReference = this.gl.createShader(shaderType);
    };
    Compiler.prototype.isTypeTextNode = function (node) {
        return (node.nodeType === 3);
    };
    Compiler.prototype.getSourceCode = function () {
        var str = "";
        var k = this.script.firstChild;
        while (k) {
            if (this.isTypeTextNode(k)) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        return str;
    };
    Compiler.prototype.start = function () {
        this.gl.shaderSource(this.shaderObjectReference, this.textContent);
        this.gl.compileShader(this.shaderObjectReference);
        if (!this.gl.getShaderParameter(this.shaderObjectReference, this.gl.COMPILE_STATUS)) {
            throw new Error(this.gl.getShaderInfoLog(this.shaderObjectReference));
        }
        return this.shaderObjectReference;
    };
}());
