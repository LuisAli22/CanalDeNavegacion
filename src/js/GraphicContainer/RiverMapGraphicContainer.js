/*global CANVASERRORMESSAGE, WebGlRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID, vec2, GraphicContainer*/
var RiverMapGraphicContainer;
(function () {
    "use strict";
    RiverMapGraphicContainer = function () {
        GraphicContainer.call(this, "riverMap");
        this.gl = this.canvas.getContext("2d");
    };
    RiverMapGraphicContainer.prototype = Object.create(GraphicContainer.prototype);
    RiverMapGraphicContainer.constructor = RiverMapGraphicContainer;
    RiverMapGraphicContainer.prototype.draw = function () {

    };

}());