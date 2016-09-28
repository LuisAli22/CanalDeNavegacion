/*jslint browser: true*/
/*global GraphicContainer, Cylinder,Orbital, Camera, mat4,requestAnimFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, BasicShapeContainer, FRAGMENTSHADERID, VERTEXSHADERID, RUTAIMAGENMARTE*/
var Scene;
(function () {
    "use strict";
    Scene = function (canvasID, fragmentShaderIdentifier, vertexShaderIdentifier) {
        this.mvStack = new ModelViewMatrixStack();
        this.graphicContainer = new GraphicContainer(canvasID, fragmentShaderIdentifier, vertexShaderIdentifier);
        this.basicShapeContainer = new BasicShapeContainer(this.graphicContainer);
        this.basicShapeContainer.cylinder.initializeTexture(RUTAIMAGENMARTE);
        this.camera = new Orbital(this.graphicContainer);
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = this.graphicContainer.getAspectRatio();
        this.graphicContainer.contextColor();
        this.graphicContainer.contextEnableDepthTest();
        this.modelViewMatrix = mat4.create();
        this.graphicContainer.bindEventFunctions(this);
    };
    Scene.prototype.onMouseDown = function (event) {
        this.camera.onMouseDown(event);
    };
    Scene.prototype.onMouseUp = function (event) {
        this.camera.onMouseUp(event);
    };
    Scene.prototype.onMouseMove = function (event) {
        this.camera.onMouseMove(event);
    };
    Scene.prototype.onWheel = function (event) {
        this.camera.onWheel(event);
    };
    Scene.prototype.tick = function () {
        requestAnimFrame(this.tick.bind(this));
        this.draw();
    };
    Scene.prototype.configureProjectionMatrix = function () {
        mat4.perspective(this.projectionMatrix, this.verticalViewField, this.aspectRatio, FRUSTUMNEAR, FRUSTUMFAR);
        this.graphicContainer.setProjectionMatrixToShaderProgram(this.projectionMatrix);
    };
    Scene.prototype.draw = function () {
        this.graphicContainer.setViewPort();
        this.graphicContainer.clearBuffer();
        this.configureProjectionMatrix();
        this.graphicContainer.configureLighting();
        this.mvStack.push(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(0, 10, 10));
        this.basicShapeContainer.cylinder.draw(this.modelViewMatrix);
        mat4.copy(this.modelViewMatrix, this.mvStack.pop());
    };
    Scene.prototype.generateMipMap = function () {
        this.basicShapeContainer.cylinder.generateMipMap();
    };
}());