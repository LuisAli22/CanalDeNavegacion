/*jslint browser: true*/
/*global SceneGraphicContainer, Cylinder,Orbital, Camera, mat4,AnimationFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, TextureHandler, Ground, TreeTrunk, riverMap, vec2, PedestrianCamera, Water*/
/*global SCENESCALEFACTOR, Sky*/
var Scene;
(function () {
    "use strict";
    Scene = function () {
        AnimationFrame.call(this, new SceneGraphicContainer(this));
        this.gl = this.graphicContainer.getContext();
        this.shaderProgram = this.graphicContainer.getShaderProgram();
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = (this.gl.viewportWidth / this.gl.viewportHeight);
        this.modelViewMatrix = mat4.create();
    };
    Scene.prototype = Object.create(AnimationFrame.prototype);
    Scene.prototype.constructor = Scene;
    Scene.prototype.createSkyGroundAndCamera = function () {
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.sky = new Sky(this.graphicContainer);
        this.ground = new Ground(this.graphicContainer, riverMap);
        this.cameras = {"Orbital": new Orbital(this.graphicContainer, 500, 0.39 * Math.PI, 1.6 * Math.PI)};
        /*this.cameras = {
            "Orbital": new Orbital(this.graphicContainer, 500, 0.39 * Math.PI, 1.6 * Math.PI),
            "Pedestrian": new PedestrianCamera(this.graphicContainer, this.ground.getStreet())
         };*/
        this.currentCameraIndex = "Orbital";
        this.camera = this.cameras[this.currentCameraIndex];
        this.camera.update();
    };
    Scene.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        this.camera.setPositionsAndUpdate(initialPosition, endPosition);
    };
    Scene.prototype.onWheel = function (event) {
        if (!this.currentCameraIsPedestrianCam()) {
            this.camera.onWheel(event);
        }
    };
    Scene.prototype.configureProjectionMatrix = function () {
        mat4.perspective(this.projectionMatrix, this.verticalViewField, this.aspectRatio, FRUSTUMNEAR, FRUSTUMFAR);
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
    };
    Scene.prototype.currentCameraIsPedestrianCam = function () {
        return (this.currentCameraIndex === "Pedestrian");
    };
    Scene.prototype.moveBackward = function () {
        if (this.currentCameraIsPedestrianCam()) {
            this.camera.moveBackward();
        }
    };
    Scene.prototype.moveForward = function () {
        if (this.currentCameraIsPedestrianCam()) {
            this.camera.moveForward();
        }
    };
    Scene.prototype.moveLeft = function () {
        if (this.currentCameraIsPedestrianCam()) {
            this.camera.moveLeft();
        }
    };
    Scene.prototype.moveRight = function () {
        if (this.currentCameraIsPedestrianCam()) {
            this.camera.moveRight();
        }
    };
    Scene.prototype.toogleCamera = function () {
        if (this.currentCameraIndex === "Orbital") {
            this.currentCameraIndex = "Pedestrian";
        } else {
            this.currentCameraIndex = "Orbital";
        }
        this.camera = this.cameras[this.currentCameraIndex];
        this.camera.update();
    };
    Scene.prototype.configureLighting = function () {
        var cameraMatrix = this.camera.getMatrix();
        var lightPosition = vec3.fromValues(530, 333.4, -720);
        this.gl.uniformMatrix4fv(this.shaderProgram.inverseVMatrixUniform, false, mat4.invert(mat4.create(), cameraMatrix));
        vec3.transformMat4(lightPosition, lightPosition, cameraMatrix);
        this.gl.uniform3fv(this.shaderProgram.lightingPositionUniform, lightPosition);
        this.gl.uniform3fv(this.shaderProgram.lightLa, [0.5, 0.5, 0.5]);
        this.gl.uniform3fv(this.shaderProgram.lightLd, [1.0, 1.0, 1.0]);
        this.gl.uniform3fv(this.shaderProgram.lightLs, [1.0, 1.0, 1.0]);
        mat4.identity(this.modelViewMatrix);
        mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, cameraMatrix);
    };
    Scene.prototype.draw = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.configureProjectionMatrix();
        this.drawObject();
    };
    Scene.prototype.drawObject = function () {
        var mvStack = ModelViewMatrixStack.getInstance();
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.configureLighting();
        this.sky.draw(this.modelViewMatrix);
        mvStack.push(this.modelViewMatrix);
        mat4.scale(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(SCENESCALEFACTOR, SCENESCALEFACTOR, SCENESCALEFACTOR));
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(-1 * this.riverMapCenter[0], 0, -1 * this.riverMapCenter[1]));
        this.ground.draw(this.modelViewMatrix);
        mat4.copy(this.modelViewMatrix, mvStack.pop());
    };
}());