/*global TextureHandler, RevolutionSurface, vec3, Math, Bspline*/
var TreeCrown;
(function () {
    "use strict";
    TreeCrown = function (graphicContainer, slices, pointsPerSegment) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.crownTexture = this.textureHandler.initializeTexture("img/hojas.jpg");
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.0, 0.0, 0.0];
        this.materialShininess = 4.0;
        this.uTextureScale = 1 / 4;
        this.vTextureScale = 1 / 8;
        this.pointsPerSegment = pointsPerSegment;
        this.randomizeFactor = 0.5;
        this.radius = 1.0;
        this.profilesLength = 4;
        this.profileControlPointsLength = 19;
        this.profiles = [];
        this.initProfiles();
        this.crown = new RevolutionSurface(graphicContainer, this.profiles, 0, 2 * Math.PI, Math.floor(slices / this.profilesLength), [0, 1, 0], this.uTextureScale, this.vTextureScale, [0x00, 0x33, 0x00]);
    };
    TreeCrown.prototype.createControlPoints = function () {
        var j;
        var angle;
        var v1;
        var y;
        var z;
        var profileControlPoints = [];
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
        return profileControlPoints.slice(0);
    };
    TreeCrown.prototype.initProfiles = function () {
        var i;
        var profileControlPoints;
        var bSpline;
        var curvePoints;
        for (i = 0; i < this.profilesLength; i += 1) {
            profileControlPoints = this.createControlPoints();
            bSpline = new Bspline(profileControlPoints, this.pointsPerSegment, [-1, 0, 0], false);
            curvePoints = bSpline.getCurvePoints();
            this.profiles.push(curvePoints);
        }
    };

    TreeCrown.prototype.draw = function (modelViewMatrix) {
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
        this.textureHandler.setTextureUniform(this.crownTexture);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess);
        this.crown.draw(modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);
    };
}());