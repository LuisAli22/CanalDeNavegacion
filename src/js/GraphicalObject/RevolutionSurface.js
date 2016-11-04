/*global GraphicalObject, mat4, vec3, Bspline, Calculator*/
var RevolutionSurface;
(function () {
    "use strict";
    RevolutionSurface = function (graphicContainer, profiles, startAngle, endAngle, slicesPerSection, rotationAxis, uTextureScale, vTextureScale, color) {
        GraphicalObject.call(this, graphicContainer);
        this.color = color;
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
    RevolutionSurface.prototype.initBuffers = function () {
        var angleDif = this.endAngle - this.startAngle;
        var angle = this.startAngle;
        var i;
        var rotationMatrix;
        var j;
        var levelPoint;
        var pbn;
        var pn;
        var pt;
        var deltaAngle;
        var profilePoints;
        if (this.profiles.length === 1) {
            profilePoints = this.profiles[0];
            deltaAngle = angleDif / this.slicesPerSection;
            for (i = 0; i <= this.slicesPerSection; i += 1) {
                rotationMatrix = mat4.create();
                mat4.rotate(rotationMatrix, rotationMatrix, angle, this.rotationAxis);

                for (j = 0; j < this.profilePointsNumber; j += 1) {
                    levelPoint = profilePoints[j].position;
                    levelPoint = vec3.transformMat4(vec3.create(), levelPoint, rotationMatrix);
                    pbn = profilePoints[j].binormal;
                    pn = profilePoints[j].normal;
                    pt = profilePoints[j].tangent;
                    pbn = vec3.transformMat4(vec3.create(), pbn, rotationMatrix);
                    pn = vec3.transformMat4(vec3.create(), pn, rotationMatrix);
                    pt = vec3.transformMat4(vec3.create(), pt, rotationMatrix);

                    this.bufferList.position.push(levelPoint[0], levelPoint[1], levelPoint[2]);
                    this.bufferList.color.push(this.color[0], this.color[1], this.color[2]);
                    this.bufferList.normal.push(pbn[0], pbn[1], pbn[2]);
                    this.bufferList.binormal.push(pn[0], pn[1], pn[2]);
                    this.bufferList.tangent.push(pt[0], pt[1], pt[2]);
                    this.bufferList.texture_coord.push(this.uTextureScale * i, this.vTextureScale * j);
                }
                angle += deltaAngle;
            }

            this.loadIndexData(this.profilePointsNumber, this.slicesPerSection + 1, this.bufferList.index);

        } else {
            var rotatedProfiles = [];
            var rotatedProfilePoints;
            deltaAngle = angleDif / this.profiles.length;
            for (i = 0; i < this.profiles.length; i += 1) {
                profilePoints = this.profiles[i];
                rotationMatrix = mat4.create();
                mat4.rotate(rotationMatrix, rotationMatrix, angle, this.rotationAxis);
                rotatedProfilePoints = [];
                for (j = 0; j < this.profilePointsNumber; j += 1) {
                    levelPoint = profilePoints[j].position;
                    levelPoint = vec3.transformMat4(vec3.create(), levelPoint, rotationMatrix);
                    rotatedProfilePoints.push(levelPoint);
                }
                rotatedProfiles.push(rotatedProfilePoints);
                angle += deltaAngle;
            }

            var l = 0;
            var controlPoints;
            var levelCurve;
            var k;
            var position;
            var v;
            var binormal;
            var normal;
            var tangent;
            var pos;
            var bSpline;
            var calculator = Calculator.getInstance();
            for (i = 0; i < this.profilePointsNumber; i += 1) {
                controlPoints = [];
                for (j = 0; j < this.profiles.length; j += 1) {
                    controlPoints.push(rotatedProfiles[j][i]);
                }
                controlPoints.push(controlPoints[0], controlPoints[1]);
                bSpline = new Bspline(controlPoints, this.slicesPerSection + 1, null);
                levelCurve = bSpline.getCurvePoints();
                l = levelCurve.length;
                for (k = 0; k < l; k += 1) {
                    position = levelCurve[k].position;
                    this.bufferList.position.push(position[0], position[1], position[2]);
                    this.bufferList.color.push(this.color[0], this.color[1], this.color[2]);
                    this.bufferList.texture_coord.push(this.uTextureScale * k, this.vTextureScale * i);
                }
            }
            for (i = 0; i < this.profilePointsNumber; i += 1) {
                for (j = 0; j < l - 1; j += 1) {
                    v = calculator.calculateNormalFromNeighbors(j, i, this.bufferList.position, l, this.profilePointsNumber, true);
                    binormal = v[0];
                    normal = v[1];
                    tangent = v[2];
                    this.bufferList.normal.push(normal[0], normal[1], normal[2]);
                    this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
                    this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
                }
                pos = this.bufferList.normal.length - (l - 1) * 3;
                this.bufferList.normal.push(this.bufferList.normal[pos], this.bufferList.normal[pos + 1], this.bufferList.normal[pos + 2]);
                this.bufferList.binormal.push(this.bufferList.binormal[pos], this.bufferList.binormal[pos + 1], this.bufferList.binormal[pos + 2]);
                this.bufferList.tangent.push(this.bufferList.tangent[pos], this.bufferList.tangent[pos + 1], this.bufferList.tangent[pos + 2]);
            }
            this.loadIndexData(l, this.profilePointsNumber, this.bufferList.index);
        }
        this.bindBuffers(this.bufferList.position, this.bufferList.normal, this.bufferList.texture_coord, this.bufferList.index, this.bufferList.tangent, this.bufferList.binormal);
    };
    RevolutionSurface.prototype.loadIndexData = function (nz, nx) {
        var i;
        var j;
        for (i = 0; i < nx - 1; i += 1) {
            for (j = 0; j < nz - 1; j += 1) {
                this.bufferList.index.push(i * nz + j);
                this.bufferList.index.push((i + 1) * nz + (j + 1));
                this.bufferList.index.push(i * nz + (j + 1));
                this.bufferList.index.push(i * nz + j);
                this.bufferList.index.push((i + 1) * nz + j);
                this.bufferList.index.push((i + 1) * nz + (j + 1));
            }
        }
    };
}());