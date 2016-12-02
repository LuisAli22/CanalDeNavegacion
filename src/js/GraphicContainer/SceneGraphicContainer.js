/*global CANVASERRORMESSAGE, ThreeDimensionRenderingContext,FRAGMENTSHADERID, VERTEXSHADERID, vec2, GraphicContainer*/
var SceneGraphicContainer;
(function () {
    "use strict";
    SceneGraphicContainer = function (animationFrame) {
        GraphicContainer.call(this, "scene", animationFrame);
        this.gl = new ThreeDimensionRenderingContext(this.canvas, FRAGMENTSHADERID, VERTEXSHADERID);
    };
    SceneGraphicContainer.prototype = Object.create(GraphicContainer.prototype);
    SceneGraphicContainer.constructor = SceneGraphicContainer;
    SceneGraphicContainer.prototype.getContext = function () {
        return this.gl.getContext();
    };
    SceneGraphicContainer.prototype.getShaderProgram = function () {
        return this.gl.getShaderProgram();
    };
    SceneGraphicContainer.prototype.setMaterialUniforms = function (ka, kd, ks, shininess) {
        this.gl.setMaterialUniforms(ka, kd, ks, shininess);
    };
    SceneGraphicContainer.prototype.setMatrixUniforms = function (modelViewMatrix) {
        this.gl.setMatrixUniforms(modelViewMatrix);
    };
}());
