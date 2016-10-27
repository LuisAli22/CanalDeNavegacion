/*jslint browser: true*/
/*global SceneGraphicContainer, Cylinder,Orbital, Camera, mat4,AnimationFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, TextureHandler, Ground, TreeTrunk, riverMap, vec2*/
var Scene;
(function () {
    "use strict";
    Scene = function () {
        AnimationFrame.call(this);
        this.sceneGraphicContainer = new SceneGraphicContainer(this);
        this.gl = this.sceneGraphicContainer.getContext();
        this.shaderProgram = this.sceneGraphicContainer.getShaderProgram();
        this.textureHandler = new TextureHandler(this.sceneGraphicContainer);
        this.camera = new Orbital(this.sceneGraphicContainer);
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = (this.gl.viewportWidth / this.gl.viewportHeight);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.modelViewMatrix = mat4.create();
        this.trunk = new TreeTrunk(this.sceneGraphicContainer, this.textureHandler);
        this.ground = new Ground(this.sceneGraphicContainer, riverMap, this.textureHandler);
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
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
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
    };
    Scene.prototype.configureLighting = function () {
        var lighting = 1;
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);
        var lightPosition = vec3.fromValues(-100.0, 0.0, -60.0);
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.05, 0.05, 0.05);
    };
    Scene.prototype.draw = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.configureProjectionMatrix();
        this.configureLighting();
        this.drawObject();
    };
    Scene.prototype.drawObject = function () {
        this.mvStack.push(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(-1 * this.riverMapCenter[0], 0, -1 * this.riverMapCenter[1]));
        this.ground.draw(this.modelViewMatrix);
        mat4.copy(this.modelViewMatrix, this.mvStack.pop());
        this.trunk.draw(this.modelViewMatrix);
    };
}());