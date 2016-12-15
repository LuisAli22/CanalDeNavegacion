/*jslint browser: true*/
/*global SceneGraphicContainer, Cylinder,Orbital, Camera, mat4,AnimationFrame*/
/*global FRUSTUMNEAR, FRUSTUMFAR, ModelViewMatrixStack, vec3, TextureHandler, Ground, TreeTrunk, riverMap, vec2, PedestrianCamera, Water*/
/*global SCENESCALEFACTOR, Sky, Basin*/
var Scene;
(function () {
    "use strict";
    Scene = function () {
        AnimationFrame.call(this, new SceneGraphicContainer(this));
        this.gl = this.graphicContainer.getContext();
        this.shaderProgram = this.graphicContainer.getShaderProgram();
        this.terrainShaderProgram = this.graphicContainer.getTerrainShaderProgram();
        this.projectionMatrix = mat4.create();
        this.verticalViewField = Math.PI / 12.0;
        this.aspectRatio = (this.gl.viewportWidth / this.gl.viewportHeight);
        this.modelViewMatrix = mat4.create();
    };
    Scene.prototype = Object.create(AnimationFrame.prototype);
    Scene.prototype.constructor = Scene;
    Scene.prototype.createSkyGroundAndCamera = function () {
        this.levelControlPointsAmount = 14;
        this.riverWidth = 90;
        this.riverWidthStep = (this.riverWidth / (this.levelControlPointsAmount));
        this.graphicContainer.useTerrainShaderProgram();
        this.basin = new Basin(this.graphicContainer, this.riverWidth, this.levelControlPointsAmount, this.riverWidthStep);
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.graphicContainer.useDefaultShaderProgram();
        this.sky = new Sky(this.graphicContainer);
        this.ground = new Ground(this.graphicContainer, this.basin);
        this.cameras = {
            "Orbital": new Orbital(500, 0.39 * Math.PI, 1.6 * Math.PI),
            "Pedestrian": new PedestrianCamera(this.ground.getStreet())
        };
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
    Scene.prototype.configureProjectionMatrix = function (useTerrainShader) {
        mat4.perspective(this.projectionMatrix, this.verticalViewField, this.aspectRatio, FRUSTUMNEAR, FRUSTUMFAR);
        if (useTerrainShader) {
            this.gl.uniformMatrix4fv(this.terrainShaderProgram.pMatrixUniform, false, this.projectionMatrix);
        } else {
            this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
        }
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
    Scene.prototype.configureLighting = function (useTerrainShader) {
        var cameraMatrix = this.camera.getMatrix();
        var lightPosition = vec3.fromValues(530, 334, -720);
        vec3.transformMat4(lightPosition, lightPosition, cameraMatrix);
        if (useTerrainShader) {
            this.gl.uniformMatrix4fv(this.terrainShaderProgram.inverseVMatrixUniform, false, mat4.invert(mat4.create(), cameraMatrix));
            this.gl.uniform3fv(this.terrainShaderProgram.lightingPositionUniform, lightPosition);
            this.gl.uniform3fv(this.terrainShaderProgram.lightLa, [0.5, 0.5, 0.5]);
            this.gl.uniform3fv(this.terrainShaderProgram.lightLd, [1.0, 1.0, 1.0]);
            this.gl.uniform3fv(this.terrainShaderProgram.lightLs, [1.0, 1.0, 1.0]);
        } else {
            this.gl.uniformMatrix4fv(this.shaderProgram.inverseVMatrixUniform, false, mat4.invert(mat4.create(), cameraMatrix));
            this.gl.uniform3fv(this.shaderProgram.lightingPositionUniform, lightPosition);
            this.gl.uniform3fv(this.shaderProgram.lightLa, [0.5, 0.5, 0.5]);
            this.gl.uniform3fv(this.shaderProgram.lightLd, [1.0, 1.0, 1.0]);
            this.gl.uniform3fv(this.shaderProgram.lightLs, [1.0, 1.0, 1.0]);
        }
        mat4.identity(this.modelViewMatrix);
        mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, cameraMatrix);
    };
    Scene.prototype.draw = function () {
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.graphicContainer.useTerrainShaderProgram();
        this.drawObject(true);
        this.graphicContainer.useDefaultShaderProgram();
        this.drawObject(false);
    };
    Scene.prototype.drawObject = function (useTerrainShader) {
        this.configureProjectionMatrix(useTerrainShader);
        this.configureLighting(useTerrainShader);
        if (!useTerrainShader) {
            this.sky.draw(this.modelViewMatrix);
        }
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(this.modelViewMatrix);
        mat4.scale(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(SCENESCALEFACTOR, SCENESCALEFACTOR, SCENESCALEFACTOR));
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(-1 * this.riverMapCenter[0], 0, -1 * this.riverMapCenter[1]));
        if (useTerrainShader) {
            this.basin.draw(this.modelViewMatrix);
        } else {
            this.ground.draw(this.modelViewMatrix);
        }
        mat4.copy(this.modelViewMatrix, mvStack.pop());
    };
}());