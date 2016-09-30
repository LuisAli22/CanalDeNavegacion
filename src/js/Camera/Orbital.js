/*jslint browser: true*/
/*global  Camera, MOUSESENSITIVENESS, MINIMUMRADIUS, MAXIMUMRADIUS */
/*global $, THETAMIN, THETAMAX, YCOORDINATE,XCOORDINATE, ZOOMINSTEP, ZOOMOUTSTEP, vec3, PHIMIN, PHIMAX, console*/
var Orbital;
(function () {
    "use strict";
    Orbital = function (sceneGraphicContainer) {
        Camera.call(this, sceneGraphicContainer);
        this.radius = 85;
        this.theta = 0.5 * Math.PI;
        this.phi = 0.5 * Math.PI;
        this.update();
    };
    Orbital.prototype = Object.create(Camera.prototype);
    Orbital.prototype.constructor = Orbital;
    Orbital.prototype.increaseAngle = function (eje) {
        return ((this.endPosition[eje] - this.initialPosition[eje]) / (MOUSESENSITIVENESS));
    };
    Orbital.prototype.updateRadius = function (increment) {
        if (this.betweenLimits(this.radius + increment, MINIMUMRADIUS, MAXIMUMRADIUS)) {
            this.radius += increment;
            this.update();
        }
    };
    Orbital.prototype.betweenLimits = function (value, min, max) {
        return ((value >= min) && (value <= max));
    };
    Orbital.prototype.updateAngles = function (incrementTheta, incrementPhi) {
        if (this.betweenLimits(this.theta - incrementTheta, THETAMIN, THETAMAX)) {
            this.theta -= incrementTheta;
        }
        if (this.betweenLimits(this.phi + incrementPhi, PHIMIN, PHIMAX)) {
            this.phi += incrementPhi;
        }
    };
    Orbital.prototype.onMouseMove = function (event) {
        if (this.leftButtonPressed) {
            this.endPosition = this.getScreenCoordinate(event);
            this.updateAngles(this.increaseAngle(YCOORDINATE), this.increaseAngle(XCOORDINATE));
            this.initialPosition = this.endPosition;
            this.update();
        }
    };
    Orbital.prototype.onWheel = function (event) {
        this.updateRadius(event.deltaY);
    };
    Orbital.prototype.setViewDirection = function () {
        var x = this.radius * Math.sin(this.theta) * Math.cos(this.phi);
        var y = this.radius * Math.cos(this.theta);
        var z = this.radius * Math.sin(this.theta) * Math.sin(this.phi);
        vec3.set(this.eye, x, y, z);
    };
}());
