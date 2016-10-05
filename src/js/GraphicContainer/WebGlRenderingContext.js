/**
 * Created by LuisAli22 on 26/09/16.
 */
/*jslint browser: true*/
/*global CANVASCONTEXTERROR, vec3, Compiler, Linker, Float32Array, Uint16Array, mat3*/
var WebGlRenderingContext;
(function () {
    "use strict";
    WebGlRenderingContext = function (canvas, context) {
        this.gl = canvas.getContext(context);
        if (!this.gl) {
            throw new Error(CANVASCONTEXTERROR);
        }
    };
}());