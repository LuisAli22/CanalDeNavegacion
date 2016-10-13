/*global CANVASERRORMESSAGE, ThreeDimensionRenderingContext, FRAGMENTSHADERID, VERTEXSHADERID, vec2, GraphicContainer*/
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
    SceneGraphicContainer.prototype.contextEnableDepthTest = function () {
        this.gl.contextEnableDepthTest();
    };
    SceneGraphicContainer.prototype.setViewPort = function () {
        this.gl.setViewPort();
    };
    SceneGraphicContainer.prototype.clearBuffer = function () {
        this.gl.clearBuffer();
    };
    SceneGraphicContainer.prototype.getAspectRatio = function () {
        return this.gl.getAspectRatio();
    };
    SceneGraphicContainer.prototype.uniformMatrix4fv = function (location, transpose, value) {
        this.gl.uniformMatrix4fv(location, transpose, value);
    };
    SceneGraphicContainer.prototype.createDataStore = function (bufferList) {
        this.gl.createDataStore(bufferList);
    };
    SceneGraphicContainer.prototype.defineGenericVertexAtributeArray = function (bufferList) {
        this.gl.defineGenericVertexAtributeArray(bufferList);
    };
    SceneGraphicContainer.prototype.setTextureModelViewMatrixNormalMatrixTAndDraw = function (modelViewMatrix, texture, indexBuffer) {
        this.gl.setTextureModelViewMatrixNormalMatrixTAndDraw(modelViewMatrix, texture, indexBuffer);
    };
    SceneGraphicContainer.prototype.setViewMatrixToShaderProgram = function (lookAtMatrix) {
        this.gl.setViewMatrixToShaderProgram(lookAtMatrix);
    };
    SceneGraphicContainer.prototype.setProjectionMatrixToShaderProgram = function (projectionMatrix) {
        this.gl.setProjectionMatrixToShaderProgram(projectionMatrix);
    };
    SceneGraphicContainer.prototype.setModelMatrixNormalMatrixAndSamplerToShaderProgram = function (modelViewMatrix) {
        this.gl.setModelMatrixNormalMatrixAndSamplerToShaderProgram(modelViewMatrix);
    };
    /*  SceneGraphicContainer.prototype.getCanvasOffset = function () {
        return this.gl.getCanvasOffset();
     };*/
    SceneGraphicContainer.prototype.contextColor = function () {
        this.gl.contextColor();
    };
    SceneGraphicContainer.prototype.bindEventFunctions = function (geographicView) {
        GraphicContainer.prototype.bindEventFunctions.call(this, geographicView);
        this.canvas.onwheel = geographicView.onWheel.bind(geographicView);
    };
    SceneGraphicContainer.prototype.configureLighting = function () {
        this.gl.configureLighting();
    };
    SceneGraphicContainer.prototype.draw = function () {
        this.gl.draw();
    };
}());
