/*jslint browser: true*/
/*global GraphicContainer, Cylinder,Orbital, Camera, mat4,requestAnimFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, BasicShapeContainer*/
var Scene;
(function () {
    "use strict";
    Scene = function () {
        this.mvStack = new ModelViewMatrixStack();
        this.graphicContainer = new GraphicContainer();
        this.basicShapeContainer = new BasicShapeContainer(this.graphicContainer);
        this.camera = new Orbital(this.graphicContainer);
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = this.graphicContainer.getAspectRatio();
        this.shaderProgram = this.graphicContainer.getShaderProgram();
        this.graphicContainer.contextColorBlack();
        this.graphicContainer.contextEnableDepthTest();
        this.modelViewMatrix = mat4.create();
        this.canvas = this.graphicContainer.getCanvas();
        this.canvas.onmousedown = this.onMouseDown.bind(this);
        this.canvas.onmouseup = this.onMouseUp.bind(this);
        this.canvas.onmousemove = this.onMouseMove.bind(this);
        this.canvas.onwheel = this.onWheel.bind(this);
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
        this.graphicContainer.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
    };
    Scene.prototype.draw = function () {
        this.graphicContainer.setViewPort();
        this.graphicContainer.clearBuffer();
        this.configureProjectionMatrix();
        this.graphicContainer.configureLighting();
    };
}());