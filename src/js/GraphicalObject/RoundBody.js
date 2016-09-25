/*jslint browser: true*/
/*global GraphicalObject, XCOORD,YCOORD,ZCOORD*/
var RoundBody;
(function () {
    "use strict";
    RoundBody = function (graphicContainer) {
        GraphicalObject.call(this, graphicContainer);
        this.latitudeBands = 64;
        this.longitudeBands = 64;
        this.currentLatitude = 0;
        this.currentLongitude = 0;
        this.phi = 0;
    };
    RoundBody.prototype = Object.create(GraphicalObject.prototype);
    RoundBody.prototype.constructor = RoundBody;
    RoundBody.prototype.loadPositionAndNormalBuffers = function () {
        this.phi = this.currentLongitude * 2 * Math.PI / this.longitudeBands;
        var cartesianCoordinates = [XCOORD, YCOORD, ZCOORD];
        cartesianCoordinates.forEach(function (element) {
            var cartesianCoordinate = this.getCartesianCoordinate(element);
            this.normal_buffer.push(cartesianCoordinate);
            this.position_buffer.push(cartesianCoordinate);
        }, this);
    };
    RoundBody.prototype.loadTextureBuffer = function () {
        var u = 1.0 - (this.currentLongitude / this.longitudeBands);
        var v = 1.0 - (this.currentLatitude / this.latitudeBands);
        this.texture_coord_buffer.push(u);
        this.texture_coord_buffer.push(v);
    };
    RoundBody.prototype.checkAndLoadIndexBuffer = function () {
        if ((this.currentLatitude < this.latitudeBands) && (this.currentLongitude < this.longitudeBands)) {
            this.loadIndexBuffer();
        }
    };
    RoundBody.prototype.exploreLongitudeAndLoadBuffers = function () {
        for (this.currentLongitude = 0; this.currentLongitude <= this.longitudeBands; this.currentLongitude += 1) {
            this.loadPositionAndNormalBuffers();
            this.loadTextureBuffer();
            this.checkAndLoadIndexBuffer();
        }
    };
    RoundBody.prototype.loadBuffers = function () {
        for (this.currentLatitude = 0; this.currentLatitude <= this.latitudeBands; this.currentLatitude += 1) {
            this.exploreLongitudeAndLoadBuffers();
        }
    };
    RoundBody.prototype.loadIndexBuffer = function () {
        var first = (this.currentLatitude * (this.longitudeBands + 1)) + this.currentLongitude;
        var second = first + this.longitudeBands + 1;
        this.index_buffer.push(first);
        this.index_buffer.push(second);
        this.index_buffer.push(first + 1);
        this.index_buffer.push(second);
        this.index_buffer.push(second + 1);
        this.index_buffer.push(first + 1);
    };
    RoundBody.prototype.setUpBuffers = function () {
        this.loadBuffers();
        this.mapBuffersToDataStore();
    };
}());