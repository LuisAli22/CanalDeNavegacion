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
    RevolutionSurface.prototype.singleProfileSurface = function () {
        return (this.profiles.length === 1);
    };
    RevolutionSurface.prototype.rotatePointPositionNormalBinormalAndTangentAndStoreInBufferList = function (currentProfilePoint, angle, i, j, rotatedProfilePoints) {
        var rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, this.rotationAxis);
        var levelPoint = currentProfilePoint.position;
        levelPoint = vec3.transformMat4(vec3.create(), levelPoint, rotationMatrix);
        if (rotatedProfilePoints) {
            rotatedProfilePoints.push(levelPoint);
        } else {
            var pbn = currentProfilePoint.binormal;
            var pn = currentProfilePoint.normal;
            var pt = currentProfilePoint.tangent;
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
    };
    RevolutionSurface.prototype.rotateAndStoreProfilePoints = function (profilePoints, i, angle, rotatedProfilePoints) {
        var j;
        for (j = 0; j < this.profilePointsNumber; j += 1) {
            this.rotatePointPositionNormalBinormalAndTangentAndStoreInBufferList(profilePoints[j], angle, i, j, rotatedProfilePoints);
        }
    };
    RevolutionSurface.prototype.rotateSingleProfileAndStoreDataToBufferList = function (angle, angleDif) {
        var i;
        var profilePoints = this.profiles[0];
        var deltaAngle = angleDif / this.slicesPerSection;
        for (i = 0; i <= this.slicesPerSection; i += 1) {
            this.rotateAndStoreProfilePoints(profilePoints, i, angle, null);
            angle += deltaAngle;
        }
    };
    RevolutionSurface.prototype.rotateAllProfiles = function (angle, angleDif) {
        var rotatedProfiles = [];
        var rotatedProfilePoints;
        var profilePoints;
        var i;
        var deltaAngle = angleDif / this.profiles.length;
        for (i = 0; i < this.profiles.length; i += 1) {
            profilePoints = this.profiles[i];
            rotatedProfilePoints = [];
            this.rotateAndStoreProfilePoints(profilePoints, i, angle, rotatedProfilePoints);
            rotatedProfiles.push(rotatedProfilePoints);
            angle += deltaAngle;
        }
        return rotatedProfiles.slice(0);
    };
    RevolutionSurface.prototype.storeBsplineCurvePointsToBufferListPositionColorAndTexture = function (profileIndex, levelCurve) {
        var curvePointIndex;
        var curveLength = levelCurve.length;
        var position;
        for (curvePointIndex = 0; curvePointIndex < curveLength; curvePointIndex += 1) {
            position = levelCurve[curvePointIndex].position;
            this.bufferList.position.push(position[0], position[1], position[2]);
            this.bufferList.color.push(this.color[0], this.color[1], this.color[2]);
            this.bufferList.texture_coord.push(this.uTextureScale * curvePointIndex, this.vTextureScale * profileIndex);
            if (curvePointIndex < curveLength - 1) {
                this.storeNormalBinormalAndTangentToBufferList(profileIndex, curvePointIndex, curveLength);
            }
        }
        var pos = this.bufferList.normal.length - (curveLength - 1) * 3;
        this.bufferList.normal.push(this.bufferList.normal[pos], this.bufferList.normal[pos + 1], this.bufferList.normal[pos + 2]);
        this.bufferList.binormal.push(this.bufferList.binormal[pos], this.bufferList.binormal[pos + 1], this.bufferList.binormal[pos + 2]);
        this.bufferList.tangent.push(this.bufferList.tangent[pos], this.bufferList.tangent[pos + 1], this.bufferList.tangent[pos + 2]);
    };
    RevolutionSurface.prototype.storeNormalBinormalAndTangentToBufferList = function (profileIndex, curvePointIndex, curveLength) {
        var calculator = Calculator.getInstance();
        var v = calculator.calculateNormalFromNeighbors(curvePointIndex, profileIndex, this.bufferList.position, curveLength, this.profilePointsNumber, true);
        var binormal = v[0];
        var normal = v[1];
        var tangent = v[2];
        this.bufferList.normal.push(normal[0], normal[1], normal[2]);
        this.bufferList.binormal.push(binormal[0], binormal[1], binormal[2]);
        this.bufferList.tangent.push(tangent[0], tangent[1], tangent[2]);
    };
    RevolutionSurface.prototype.createControlPoints = function (profilePointIndex, rotatedProfiles) {
        var profileIndex;
        var controlPoints = [];
        for (profileIndex = 0; profileIndex < this.profiles.length; profileIndex += 1) {
            controlPoints.push(rotatedProfiles[profileIndex][profilePointIndex]);
        }
        controlPoints.push(controlPoints[0], controlPoints[1]);
        return controlPoints.slice(0);
    };
    RevolutionSurface.prototype.forEachProfileGetBsplineCurveAndStoreDataToBufferList = function (rotatedProfiles) {
        var profilePointIndex;
        var controlPoints;
        var levelCurve;
        var bSpline;
        for (profilePointIndex = 0; profilePointIndex < this.profilePointsNumber; profilePointIndex += 1) {
            controlPoints = this.createControlPoints(profilePointIndex, rotatedProfiles);
            bSpline = new Bspline(controlPoints, this.slicesPerSection + 1, null);
            levelCurve = bSpline.getCurvePoints();
            this.storeBsplineCurvePointsToBufferListPositionColorAndTexture(profilePointIndex, levelCurve);
        }
        this.loadIndexBufferData(levelCurve.length, this.profilePointsNumber);
    };
    RevolutionSurface.prototype.initBuffers = function () {
        var angleDif = this.endAngle - this.startAngle;
        var angle = this.startAngle;
        if (this.singleProfileSurface()) {
            this.rotateSingleProfileAndStoreDataToBufferList(angle, angleDif);
            this.loadIndexBufferData(this.profilePointsNumber, this.slicesPerSection + 1);

        } else {
            var rotatedProfiles = this.rotateAllProfiles(angle, angleDif);
            this.forEachProfileGetBsplineCurveAndStoreDataToBufferList(rotatedProfiles);
        }
        this.bindBuffers();
    };
}());