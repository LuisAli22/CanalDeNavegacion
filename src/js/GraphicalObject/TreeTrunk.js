/*global Cylinder*/
var TreeTrunk;
(function () {
    "use strict";
    TreeTrunk = function (graphicContainer, slices, textureHandler) {
        this.textureHandler = textureHandler;
        var n = Math.floor((Math.random() * 6) + 1);
        this.texture = this.textureHandler.initializeTexture("img/trunk_" + n + ".jpg");
        this.cylinder = new Cylinder(graphicContainer, slices, 1.0, 2);
    };
    TreeTrunk.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.cylinder.draw(modelViewMatrix);
    };
}());
