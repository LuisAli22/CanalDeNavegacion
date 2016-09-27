/**
 * Created by LuisAli22 on 26/09/16.
 */
/*jslint browser: true*/
/*global CANVASERRORMESSAGE, WebGlRenderingContext*/
var RenderingContextFactory;
(function () {
    "use strict";
    RenderingContextFactory = function () {
        this.renderingContextTypes = {};
    };
    RenderingContextFactory.prototype.getRenderingContext = function (type, canvas, fragmentShaderIdentifier, vertexShaderIdentifier) {
        var RenderingContext = this.renderingContextTypes[type];
        if (!RenderingContext) {
            return null;
        }
        return new RenderingContext(canvas, fragmentShaderIdentifier, vertexShaderIdentifier);
    };
    RenderingContextFactory.prototype.registerRenderingContext = function (type, renderingContext) {
        this.renderingContextTypes[type] = renderingContext;
    };
}());