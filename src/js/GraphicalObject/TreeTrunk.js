/*global Cylinder, TextureHandler*/
var TreeTrunk;
(function () {
    "use strict";
    TreeTrunk = function (graphicContainer, slices) {
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.cylinder = new Cylinder(graphicContainer, slices, 1.0, 2, [0x99, 0x4c, 0x00]);
    };
    TreeTrunk.prototype.draw = function (modelViewMatrix) {
        this.cylinder.draw(modelViewMatrix);
    };
}());
