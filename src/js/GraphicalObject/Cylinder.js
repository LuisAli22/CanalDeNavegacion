/*jslint browser: true*/
/*global CYLINDERFINALHEIGHT, XCOORD, YCOORD, RoundBody, RUTAIMAGENMARTE*/
var Cylinder;
(function () {
    "use strict";
    Cylinder = function (graphicContainer) {
        RoundBody.call(this, graphicContainer);
        this.currentHeight = 0;
        this.setUpBuffers();
        this.initializeTexture();
    };
    Cylinder.prototype = Object.create(RoundBody.prototype);
    Cylinder.prototype.constructor = Cylinder;
    Cylinder.prototype.getCartesianCoordinate = function (coordinate) {
        if (coordinate === XCOORD) {
            return Math.cos(this.phi);
        }
        if (coordinate === YCOORD) {
            return Math.sin(this.phi);
        }
        this.currentHeight = (CYLINDERFINALHEIGHT / 2) - (this.currentLatitude * CYLINDERFINALHEIGHT / (this.latitudeBands - 2));
        return this.currentHeight;
    };
    Cylinder.prototype.loadLidPositionAndNormalBuffer = function (value) {
        this.bufferList.normal.push(value);
        this.bufferList.position.push(value);
    };
    Cylinder.prototype.loadLidCentralPoint = function (lidHeight) {
        var indexCoordinate = [0, 1, 2];
        indexCoordinate.forEach(function (element) {
            if (element === 2) {
                this.loadLidPositionAndNormalBuffer(lidHeight);
            } else {
                this.loadLidPositionAndNormalBuffer(0.0);
            }
        }, this);
    };
    Cylinder.prototype.loadLid = function (lidHeight) {
        var i;
        for (i = 0; i <= this.longitudeBands; i += 1) {
            this.loadLidCentralPoint(lidHeight);
            this.loadTextureBuffer();
        }
    };
    Cylinder.prototype.completeIndexBuffer = function () {
        for (this.currentLongitude = 0; this.currentLongitude <= this.longitudeBands; this.currentLongitude += 1) {
            this.checkAndLoadIndexBuffer();
        }
    };
    Cylinder.prototype.loadBuffers = function () {
        this.loadLid(CYLINDERFINALHEIGHT / 2);
        for (this.currentLatitude = 0; this.currentLatitude < this.latitudeBands - 1; this.currentLatitude += 1) {
            this.exploreLongitudeAndLoadBuffers();
        }
        this.completeIndexBuffer();
        this.loadLid(-CYLINDERFINALHEIGHT / 2);
    };
}());