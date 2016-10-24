/*global Cylinder*/
var TreeTrunk;
(function () {
    "use strict";
    TreeTrunk = function (graphicContainer, textureHandler) {
        this.graphicContainer = graphicContainer;
        var n = Math.floor((Math.random() * 6) + 1);
        this.texture = textureHandler.initializeTexture("img/trunk_" + n + ".jpg");
        this.cylinder = new Cylinder(graphicContainer, 24, 1.0, 2);
    };
    TreeTrunk.prototype.draw = function (modelViewMatrix) {
        this.graphicContainer.setTextureUniform(this.texture);
        this.cylinder.draw(modelViewMatrix);
    };
}());
