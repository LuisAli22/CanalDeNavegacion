/*global  Camera, MOUSESENSITIVENESS, MINIMUMRADIUS, MAXIMUMRADIUS */
/*global $, THETAMIN, THETAMAX, YCOORDINATE,XCOORDINATE, ZOOMINSTEP, ZOOMOUTSTEP, vec3, PHIMIN, PHIMAX, console*/
var Orbital;
(function () {
    "use strict";
    Orbital = function (radius, theta, phi) {
        Camera.call(this);
        this.radius = radius;
        this.theta = theta;
        this.phi = phi;
    };
    Orbital.prototype = Object.create(Camera.prototype);
    Orbital.prototype.constructor = Orbital;
    Orbital.prototype.updateRadius = function (increment) {
        if (this.betweenLimits(this.radius + increment, MINIMUMRADIUS, MAXIMUMRADIUS)) {
            this.radius += increment;
            this.update();
        }
    };
    Orbital.prototype.betweenLimits = function (value, min, max) {
        return ((value >= min) && (value <= max));
    };
    Orbital.prototype.setAngles = function (initialPosition, endPosition) {
        var incrementTheta = ((endPosition[YCOORDINATE] - initialPosition[YCOORDINATE]) / (MOUSESENSITIVENESS));
        var incrementPhi = ((endPosition[XCOORDINATE] - initialPosition[XCOORDINATE]) / (MOUSESENSITIVENESS));
        if (this.betweenLimits(this.theta - incrementTheta, THETAMIN, THETAMAX)) {
            this.theta -= incrementTheta;
        }
        if (this.betweenLimits(this.phi + incrementPhi, PHIMIN, PHIMAX)) {
            this.phi += incrementPhi;
        }
    };
    Orbital.prototype.setPositionsAndUpdate = function (initialPosition, endPosition) {
        this.setAngles(initialPosition, endPosition);
        this.update();
    };
    Orbital.prototype.onWheel = function (event) {
        this.updateRadius(event.deltaY);
    };
    Orbital.prototype.setTargetAnEyePositions = function () {
        this.eye = this.getSpatialCoordinate();
    };
    Orbital.prototype.getSpatialCoordinate = function () {
        var x = this.radius * Math.sin(this.theta) * Math.cos(this.phi);
        var y = this.radius * Math.cos(this.theta);
        var z = this.radius * Math.sin(this.theta) * Math.sin(this.phi);
        return vec3.fromValues(x, y, z);
    };
}());
