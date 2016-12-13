/*global Cylinder, TextureHandler, TREEDIAMETER*/
var TreeTrunk;
(function () {
    "use strict";
    TreeTrunk = function (graphicContainer, slices) {
        this.graphicContainer = graphicContainer;
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture(["img/trunk.jpg"]);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.0, 0.0, 0.0];
        this.materialShininess = 4.0;
        this.cylinder = new Cylinder(graphicContainer, slices, TREEDIAMETER / 2, 2, [0, 0, 0]);
    };
    TreeTrunk.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess);
        this.cylinder.draw(modelViewMatrix);
    };
}());
