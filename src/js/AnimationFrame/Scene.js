/*jslint browser: true*/
/*global SceneGraphicContainer, Cylinder,Orbital, Camera, mat4,AnimationFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, TextureHandler, Ground, TreeTrunk, riverMap, vec2*/
var Scene;
(function () {
    "use strict";
    Scene = function () {
        AnimationFrame.call(this, new SceneGraphicContainer(this));
        this.gl = this.graphicContainer.getContext();
        this.shaderProgram = this.graphicContainer.getShaderProgram();
        this.camera = new Orbital(this.graphicContainer);
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = (this.gl.viewportWidth / this.gl.viewportHeight);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.modelViewMatrix = mat4.create();
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.ground = new Ground(this.graphicContainer, riverMap, this.riverMapCenter);
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
        var lighting = 0;
        this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.1, 0.1, 0.1);
        this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.12, 0.12, 0.10);
        this.gl.uniform1i(this.shaderProgram.useLightingUniform, lighting);

        var lightPosition = vec3.fromValues(-100, 100, 100);
        /*var cameraMatrix = this.camera.getMatrix();
         vec3.transformMat4(lightPosition, lightPosition, cameraMatrix);
         vec3.transformMat4(lightPosition, lightPosition, this.modelViewMatrix);*/
        this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        /*this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
         this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.5, 0.5, 0.5);*/
    };
    Scene.prototype.draw = function () {
        this.gl.uniform1i(this.shaderProgram.useTextureUniform, 1);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.configureProjectionMatrix();
        this.drawObject();
    };
    Scene.prototype.drawObject = function () {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(this.modelViewMatrix);
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(-1 * this.riverMapCenter[0], 0, -1 * this.riverMapCenter[1]));
        this.configureLighting();
        this.ground.draw(this.modelViewMatrix);
        mat4.copy(this.modelViewMatrix, mvStack.pop());
    };
}());