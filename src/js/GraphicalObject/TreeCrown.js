/*global TextureHandler, RevolutionSurface, vec3, Math, Bspline*/
var TreeCrown;
(function () {
    "use strict";
    TreeCrown = function (graphicContainer, slices, pointsPerSegment, textureHandler) {
        this.textureHandler = textureHandler;
        var n = Math.floor((Math.random() * 3) + 1);
        this.crownTexture = textureHandler.initializeTexture("img/crown_" + n + ".jpg");
        this.uTextureScale = 1 / 4;
        this.vTextureScale = 1 / 8;
        this.pointsPerSegment = pointsPerSegment;
        this.randomizeFactor = 0.5;
        this.radius = 1.0;
        this.profilesLength = 4;
        this.profileControlPointsLength = 19;
        this.profiles = [];
        this.initProfiles();
        this.crown = new RevolutionSurface(graphicContainer, this.profiles, 0, 2 * Math.PI, Math.floor(slices / this.profilesLength), [0, 1, 0], this.uTextureScale, this.vTextureScale);
    };
    TreeCrown.prototype.initProfiles = function () {
        var i;
        var j;
        var profileControlPoints;
        var angle;
        var v1;
        var y;
        var z;
        var bSpline;
        var curvePoints;
        for (i = 0; i < this.profilesLength; i += 1) {
            profileControlPoints = [];
            for (j = 0; j < this.profileControlPointsLength; j += 1) {
                angle = -(Math.PI / 2) + Math.PI * (j / (this.profileControlPointsLength - 1));
                if (j > 3 && (j - 1) % 3 === 0) {
                    v1 = vec3.subtract(vec3.create(), profileControlPoints[j - 1], profileControlPoints[j - 2]);
                    profileControlPoints.push(vec3.add(vec3.create(), profileControlPoints[j - 1], v1));
                } else {
                    y = this.radius * Math.sin(angle);
                    z = (this.radius * (1 + Math.random() * this.randomizeFactor)) * Math.cos(angle);
                    profileControlPoints.push([0, y, z]);
                }
            }
            bSpline = new Bspline(profileControlPoints, this.pointsPerSegment, [-1, 0, 0]);
            curvePoints = bSpline.getCurvePoints();
            this.profiles.push(curvePoints);
        }
    };

    TreeCrown.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.crownTexture);
        this.crown.draw(modelViewMatrix);
    };
}());