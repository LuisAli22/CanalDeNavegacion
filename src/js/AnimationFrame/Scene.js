/*jslint browser: true*/
/*global SceneGraphicContainer, Cylinder,Orbital, Camera, mat4,AnimationFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, TextureHandler, TreeTrunk*/
var Scene;
(function () {
    "use strict";
    Scene = function (riverMap) {
        AnimationFrame.call(this);
        this.sceneGraphicContainer = new SceneGraphicContainer(this);
        this.textureHandler = new TextureHandler(this.sceneGraphicContainer);
        this.camera = new Orbital(this.sceneGraphicContainer);
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = this.sceneGraphicContainer.getAspectRatio();
        this.sceneGraphicContainer.contextColor();
        this.sceneGraphicContainer.contextEnableDepthTest();
        this.modelViewMatrix = mat4.create();
        this.trunk = new TreeTrunk(this.sceneGraphicContainer, this.textureHandler);
    };
    Scene.prototype = Object.create(AnimationFrame.prototype);
    Scene.prototype.constructor = Scene;
    Scene.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        this.camera.setPositionsAndUpdate(initialPosition, endPosition);
    };
    Scene.prototype.onWheel = function (event) {
        this.camera.onWheel(event);
    };
    Scene.prototype.configureProjectionMatrix = function () {
        mat4.perspective(this.projectionMatrix, this.verticalViewField, this.aspectRatio, FRUSTUMNEAR, FRUSTUMFAR);
        this.sceneGraphicContainer.setProjectionMatrixToShaderProgram(this.projectionMatrix);
    };
    Scene.prototype.draw = function () {
        this.sceneGraphicContainer.setViewPort();
        this.sceneGraphicContainer.clearBuffer();
        this.configureProjectionMatrix();
        this.sceneGraphicContainer.configureLighting();
        this.drawObject();
    };
    Scene.prototype.drawObject = function () {
        this.trunk.draw(this.modelViewMatrix);
        /* this.mvStack.push(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(0, 10, 10));
        this.basicShapeContainer.cylinder.draw(this.modelViewMatrix);
        mat4.copy(this.modelViewMatrix, this.mvStack.pop());
         this.basicShapeContainer.river.draw(this.modelViewMatrix);*/
    };
    /*Scene.prototype.generateMipMap = function () {
     this.trunk.generateMipMap();
     //this.basicShapeContainer.river.generateMipMap();
     };*/
}());