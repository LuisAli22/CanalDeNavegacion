/*jslint browser: true*/
/*global CANVASERRORMESSAGE, WebGlRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID, vec2*/
var GraphicContainer;
(function () {
    "use strict";
    GraphicContainer = function (canvasID) {
        this.canvas = document.getElementById(canvasID);
        if (!this.canvas) {
            throw new Error(CANVASERRORMESSAGE);
        }
    };
    GraphicContainer.prototype.bindEventFunctions = function (geographicView) {
        this.canvas.onmousedown = geographicView.onMouseDown.bind(geographicView);
        this.canvas.onmouseup = geographicView.onMouseUp.bind(geographicView);
        this.canvas.onmousemove = geographicView.onMouseMove.bind(geographicView);
    };
}());