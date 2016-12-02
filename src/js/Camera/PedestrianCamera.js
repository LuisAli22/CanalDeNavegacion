/*global Orbital, PEDESTRIANPOSITION, RADIUSPEDESTRIANPOSITION, TITAPEDESTRIANPOSITION, FIPEDESTRIANPOSITION*/
/*global vec3, MOVELEFT, MOVERIGHT, MOVEBACKWARD, MOVEFORWARD, vec2, riverMap, SCENESCALEFACTOR, Calculator*/
/*global XCOORDINATE, YCOORDINATE, ZCOORDINATE, MOUSESENSITIVENESS, PHIMIN, PHIMAX, THETAMIN, THETAMAX, vec4, mat4*/
var PedestrianCamera;
(function () {
    "use strict";
    PedestrianCamera = function (sceneGraphicContainer, street) {
        Orbital.call(this, sceneGraphicContainer, RADIUSPEDESTRIANPOSITION, TITAPEDESTRIANPOSITION, FIPEDESTRIANPOSITION);
        this.trajectory = street.getTrajectory();
        this.streetZPosition = street.getZPositionValue();
        this.streetWidth = street.getWidth();
        this.pedestrianPosition = PEDESTRIANPOSITION;
        this.personHeight = 1.5 * SCENESCALEFACTOR;
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.moveAside = false;
    };
    PedestrianCamera.prototype = Object.create(Orbital.prototype);
    PedestrianCamera.prototype.constructor = PedestrianCamera;
    /* PedestrianCamera.prototype.setModelViewMatrix = function (modelViewMatrix) {
     this.modelViewMatrix = mat4.clone(modelViewMatrix);
     };*/
    PedestrianCamera.prototype.setTargetAnEyePositions = function () {
        if (!this.moveAside) {
            this.eye = this.getPedestrianPosition();
        }
        this.target = this.getSpatialCoordinate();
    };
    PedestrianCamera.prototype.getPedestrianPosition = function () {
        var threeDimensionPoint = vec3.clone(this.trajectory[this.pedestrianPosition].position);
        var currentPedestrianPoint = vec4.fromValues(threeDimensionPoint[0], threeDimensionPoint[1], threeDimensionPoint[2], 1);
        currentPedestrianPoint[1] += this.personHeight;
        currentPedestrianPoint[0] -= this.riverMapCenter[0];
        currentPedestrianPoint[1] += this.personHeight;
        currentPedestrianPoint[2] = this.streetZPosition - (this.riverMapCenter[1] - (this.streetWidth / 2));
        return vec3.fromValues(currentPedestrianPoint[0], currentPedestrianPoint[1], currentPedestrianPoint[2]);
        /*var calculator = Calculator.getInstance();
         var realPedestrianPoint = calculator.multiplyMatrixByVector(this.modelViewMatrix, currentPedestrianPoint);
         return vec3.fromValues(realPedestrianPoint[0], realPedestrianPoint[1], realPedestrianPoint[2]);*/
    };
    PedestrianCamera.prototype.moveBackwardOrForward = function (moveSense) {
        this.pedestrianPosition += moveSense;
        this.pedestrianPosition = Math.min(this.pedestrianPosition, this.trajectory.length);
        this.pedestrianPosition = Math.max(this.pedestrianPosition, 0);
        this.update();
    };
    PedestrianCamera.prototype.moveForward = function () {
        var moveSense = -10;
        if (Math.cos(this.phi) >= 0) {
            moveSense *= -1;
        }
        this.moveBackwardOrForward(moveSense);
    };
    PedestrianCamera.prototype.moveBackward = function () {
        var moveSense = 10;
        if (Math.cos(this.phi) >= 0) {
            moveSense *= -1;
        }
        this.moveBackwardOrForward(moveSense);
    };
    PedestrianCamera.prototype.moveLeft = function () {
        var moveSense = MOVELEFT;
        if (Math.cos(this.phi) < 0) {
            moveSense *= -1;
        }
        this.checkAndApplyLeftOrRightMove(moveSense);
    };
    PedestrianCamera.prototype.moveRight = function () {
        var moveSense = MOVERIGHT;
        if (Math.cos(this.phi) < 0) {
            moveSense *= -1;
        }
        this.checkAndApplyLeftOrRightMove(moveSense);
    };
    PedestrianCamera.prototype.checkAndApplyLeftOrRightMove = function (moveSense) {
        if (Math.abs(this.eye[2] + moveSense) <= this.streetWidth / 2) {
            this.moveAside = true;
            this.eye[2] += moveSense;
            this.update();
        }
        this.moveAside = false;
    };
    PedestrianCamera.prototype.getSpatialCoordinate = function () {
        var x = this.radius * Math.sin(this.theta) * Math.cos(this.phi) + this.eye[0];
        var y = this.radius * Math.cos(this.theta) + this.eye[1];
        var z = this.radius * Math.sin(this.theta) * Math.sin(this.phi) + this.eye[2];
        return vec3.fromValues(x, y, z);
    };
    PedestrianCamera.prototype.setAngles = function (initialPosition, endPosition) {
        var incrementTheta = ((endPosition[YCOORDINATE] - initialPosition[YCOORDINATE]) / (MOUSESENSITIVENESS));
        var incrementPhi = ((endPosition[XCOORDINATE] - initialPosition[XCOORDINATE]) / (MOUSESENSITIVENESS));
        if (this.betweenLimits(this.theta + incrementTheta, THETAMIN, THETAMAX)) {
            this.theta += incrementTheta;
        }
        if (this.betweenLimits(this.phi + incrementPhi, PHIMIN, PHIMAX)) {
            this.phi += incrementPhi;
        }
    };
}());