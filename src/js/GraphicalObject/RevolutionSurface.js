/*global GraphicalObject, mat4, vec3, Bspline, Calculator*/
var RevolutionSurface;
(function () {
    "use strict";
    RevolutionSurface = function (graphicContainer, profiles, startAngle, endAngle, slicesPerSection, rotationAxis, uTextureScale, vTextureScale) {
        GraphicalObject.call(this, graphicContainer);

        this.uTextureScale = uTextureScale;
        this.vTextureScale = vTextureScale;

        this.profiles = profiles;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.slicesPerSection = slicesPerSection;
        this.rotationAxis = rotationAxis;
        this.profilePointsNumber = this.profiles[0].length;
        this.initBuffers();
    };
    RevolutionSurface.prototype = Object.create(GraphicalObject.prototype);
    RevolutionSurface.prototype.constructor = RevolutionSurface;
    RevolutionSurface.prototype.rotateAllProfiles = function (angle, angleDif) {
        var rotatedProfiles = [];
        var deltaAngle = angleDif / this.profiles.length;
        var i;
        var j;
        var profilePoints;
        var rotationMatrix;
        var rotatedProfilePoints;
        var pp;
        for (i = 0; i < this.profiles.length; i += 1) {
            profilePoints = this.profiles[i];
            rotationMatrix = mat4.create();
            mat4.rotate(rotationMatrix, rotationMatrix, angle, this.rotationAxis);
            rotatedProfilePoints = [];
            for (j = 0; j < this.profilePointsNumber; j += 1) {
                pp = profilePoints[j].position;
                pp = vec3.transformMat4(vec3.create(), pp, rotationMatrix);
                rotatedProfilePoints.push(pp);
            }
            rotatedProfiles.push(rotatedProfilePoints);
            angle += deltaAngle;
        }
        return rotatedProfiles.slice(0);
    };
    RevolutionSurface.prototype.initBuffers = function () {

        var angleDif = this.endAngle - this.startAngle;
        var angle = this.startAngle;
        var calculator = Calculator.getInstance();
        var rotatedProfiles = this.rotateAllProfiles(angle, angleDif);
        var l = 0;
        var i;
        var j;
        var bSpline;
        var levelCurve;
        var k;
        var controlPoints;
        var position;
        for (i = 0; i < this.profilePointsNumber; i += 1) {
            controlPoints = [];
            for (j = 0; j < this.profiles.length; j += 1) {
                controlPoints.push(rotatedProfiles[j][i]);
            }
            controlPoints.push(controlPoints[0], controlPoints[1]);
            bSpline = new Bspline(controlPoints, this.slicesPerSection + 1, null, false);
            levelCurve = bSpline.getCurvePoints();
            l = levelCurve.length;
            for (k = 0; k < l; k += 1) {
                position = levelCurve[k].position;
                this.bufferList.position.push(position[0], position[1], position[2]);
                this.bufferList.texture_coord.push(this.uTextureScale * k, this.vTextureScale * i);
            }
        }
        for (i = 0; i < this.profilePointsNumber; i += 1) {
            for (j = 0; j < l - 1; j += 1) {
                var v = calculator.calculateNormalFromNeighbors(j, i, this.bufferList.position, l, this.profilePointsNumber, true);
                var binormal = v[0];
                var normal = v[1];
                var tangent = v[2];
                this.bufferList.normal.push(normal[0], normal[1], normal[2]);
                this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
                this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
            }
            var pos = this.bufferList.normal.length - (l - 1) * 3;
            this.bufferList.normal.push(this.bufferList.normal[pos], this.bufferList.normal[pos + 1], this.bufferList.normal[pos + 2]);
            this.bufferList.binormal.push(this.bufferList.binormal[pos], this.bufferList.binormal[pos + 1], this.bufferList.binormal[pos + 2]);
            this.bufferList.tangent.push(this.bufferList.tangent[pos], this.bufferList.tangent[pos + 1], this.bufferList.tangent[pos + 2]);
        }
        this.loadIndexBufferData(l, this.profilePointsNumber);
        this.bindBuffers();
    };
}());