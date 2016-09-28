/*jslint browser: true*/
/*global CANVASERRORMESSAGE, RenderingContextFactory, SceneContext, RiverMapContext, vec2*/
var GraphicContainer;
(function () {
    "use strict";
    GraphicContainer = function (canvasID, fragmentShaderIdentifier, vertexShaderIdentifier) {
        this.canvas = document.getElementById(canvasID);
        if (!this.canvas) {
            throw new Error(CANVASERRORMESSAGE);
        }
        this.renderingContextFactory = new RenderingContextFactory();
        this.renderingContextFactory.registerRenderingContext("scene", SceneContext);
        this.renderingContextFactory.registerRenderingContext("riverMap", RiverMapContext);
        this.gl = this.renderingContextFactory.getRenderingContext(canvasID, this.canvas, fragmentShaderIdentifier, vertexShaderIdentifier);
    };
    GraphicContainer.prototype.getContext = function () {
        return this.gl.getContext();
    };
    GraphicContainer.prototype.contextEnableDepthTest = function () {
        this.gl.contextEnableDepthTest();
    };
    GraphicContainer.prototype.setViewPort = function () {
        this.gl.setViewPort();
    };
    GraphicContainer.prototype.clearBuffer = function () {
        this.gl.clearBuffer();
    };
    GraphicContainer.prototype.getAspectRatio = function () {
        return this.gl.getAspectRatio();
    };
    GraphicContainer.prototype.uniformMatrix4fv = function (location, transpose, value) {
        this.gl.uniformMatrix4fv(location, transpose, value);
    };
    GraphicContainer.prototype.createDataStore = function (bufferList) {
        this.gl.createDataStore(bufferList);
    };
    GraphicContainer.prototype.defineGenericVertexAtributeArray = function (bufferList) {
        this.gl.defineGenericVertexAtributeArray(bufferList);
    };
    GraphicContainer.prototype.setTextureModelViewMatrixNormalMatrixTAndDraw = function (modelViewMatrix, texture, indexBuffer) {
        this.gl.setTextureModelViewMatrixNormalMatrixTAndDraw(modelViewMatrix, texture, indexBuffer);
    };
    GraphicContainer.prototype.setViewMatrixToShaderProgram = function (lookAtMatrix) {
        this.gl.setViewMatrixToShaderProgram(lookAtMatrix);
    };
    GraphicContainer.prototype.setProjectionMatrixToShaderProgram = function (projectionMatrix) {
        this.gl.setProjectionMatrixToShaderProgram(projectionMatrix);
    };
    GraphicContainer.prototype.setModelMatrixNormalMatrixAndSamplerToShaderProgram = function (modelViewMatrix) {
        this.gl.setModelMatrixNormalMatrixAndSamplerToShaderProgram(modelViewMatrix);
    };
    GraphicContainer.prototype.getCanvasOffset = function () {
        return this.gl.getCanvasOffset();
    };
    GraphicContainer.prototype.contextColor = function () {
        this.gl.contextColor();
    };
    GraphicContainer.prototype.getCanvasOffset = function () {
        var offset = vec2.create();
        vec2.set(offset, this.canvas.offsetLeft, this.canvas.offsetTop);
        return offset;
    };
    GraphicContainer.prototype.bindEventFunctions = function (geographicView) {
        this.canvas.onmousedown = geographicView.onMouseDown.bind(geographicView);
        this.canvas.onmouseup = geographicView.onMouseUp.bind(geographicView);
        this.canvas.onmousemove = geographicView.onMouseMove.bind(geographicView);
        this.canvas.onwheel = geographicView.onWheel.bind(geographicView);
    };
    GraphicContainer.prototype.configureLighting = function () {
        this.gl.configureLighting();
    };
    GraphicContainer.prototype.draw = function () {
        this.gl.draw();
    };
}());