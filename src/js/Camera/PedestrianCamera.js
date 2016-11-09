/*global Orbital, PEDESTRIANPOSITION, RADIUSPEDESTRIANPOSITION, TITAPEDESTRIANPOSITION, FIPEDESTRIANPOSITION*/
/*global vec3, MOVELEFT, MOVERIGHT, MOVEBACKWARD, MOVEFORWARD, vec2, riverMap*/
/*global XCOORDINATE, YCOORDINATE, ZCOORDINATE, MOUSESENSITIVENESS, PHIMIN, PHIMAX, THETAMIN, THETAMAX*/
var PedestrianCamera;
(function () {
    "use strict";
    PedestrianCamera = function (sceneGraphicContainer, street) {
        Orbital.call(this, sceneGraphicContainer, RADIUSPEDESTRIANPOSITION, TITAPEDESTRIANPOSITION, FIPEDESTRIANPOSITION);
        this.trajectory = street.getTrajectory();
        this.streetZPosition = street.getZPositionValue();
        this.streetWidth = street.getWidth();
        this.pedestrianPosition = PEDESTRIANPOSITION;
        this.personHeight = 1.5;
        this.riverMapCenter = vec2.clone(riverMap.getCurveCenter());
        this.moveAside = false;
    };
    PedestrianCamera.prototype = Object.create(Orbital.prototype);
    PedestrianCamera.prototype.constructor = PedestrianCamera;
    PedestrianCamera.prototype.setTargetAnEyePositions = function () {
        if (!this.moveAside) {
            this.eye = this.getPedestrianPosition();
        }
        this.target = this.getSpatialCoordinate();
    };
    PedestrianCamera.prototype.getPedestrianPosition = function () {
        var currentPedestrianPoint = vec3.clone(this.trajectory[this.pedestrianPosition].position);
        currentPedestrianPoint[0] -= this.riverMapCenter[0];
        currentPedestrianPoint[1] += this.personHeight;
        currentPedestrianPoint[2] = this.streetZPosition - (this.riverMapCenter[1] - (this.streetWidth / 2));
        return currentPedestrianPoint;
    };
    PedestrianCamera.prototype.moveBackwardOrForward = function (moveSense) {
        this.pedestrianPosition += moveSense;
        if (this.pedestrianPositionIsInsideTrajectory()) {
            this.update();
        } else {
            this.pedestrianPosition -= moveSense;
        }
    };
    PedestrianCamera.prototype.moveForward = function () {
        var moveSense = -1;
        if (Math.cos(this.phi) >= 0) {
            moveSense *= -1;
        }
        this.moveBackwardOrForward(moveSense);
    };
    PedestrianCamera.prototype.pedestrianPositionIsInsideTrajectory = function () {
        return ((this.pedestrianPosition >= 0) && (this.pedestrianPosition < this.trajectory.length));
    };
    PedestrianCamera.prototype.moveBackward = function () {
        var moveSense = 1;
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