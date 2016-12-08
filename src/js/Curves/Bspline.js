/*global mat4, vec4, vec3, BsplineMatrix, XCOORDINATE, YCOORDINATE, ZCOORDINATE*/
var Bspline;
(function () {
    "use strict";
    Bspline = function (controlPoints, pointsPerSegment, normal, interpolateExtreme) {
        this.interpolateExtreme = interpolateExtreme;
        this.controlPoints = controlPoints;
        this.pointsPerSegment = pointsPerSegment;
        this.normal = normal;
        if (this.interpolateExtreme) {
            this.createSlidingWindow();
        }
    };
    Bspline.prototype.createSlidingWindow = function () {
        this.slidingWindow = [0];
        this.controlPoints.forEach(function (element, index) {
            this.slidingWindow.push(index);
        }, this);
        if (this.interpolateExtreme) {
            this.slidingWindow.push(this.controlPoints.length - 1);
        }
    };
    Bspline.prototype.calculateCurvePointAndStoreIt = function (points, firstIndex, secondIndex, thirdIndex) {
        for (var j = 0; j < this.pointsPerSegment; j++) {
            var t = ((1 / (this.pointsPerSegment - 1)) * j);
            if (t === 0 && firstIndex > 0 && !this.interpolateExtreme) continue;
            if (t === 0 && this.interpolateExtreme) continue;
            //Calculo la funciÃ³n
            var b0 = Math.pow(t, 2) / 2;
            var b1 = -Math.pow(t, 2) + t + 1 / 2;
            var b2 = Math.pow(1 - t, 2) / 2;

            //Calculo la derivada
            var d0 = t;
            var d1 = -2 * t + 1;
            var d2 = t - 1;

            //Calculo los puntos de la curva
            var x = b2 * this.controlPoints[firstIndex][0] + b1 * this.controlPoints[secondIndex][0] + b0 * this.controlPoints[thirdIndex][0];
            var y = b2 * this.controlPoints[firstIndex][1] + b1 * this.controlPoints[secondIndex][1] + b0 * this.controlPoints[thirdIndex][1];
            var z = b2 * this.controlPoints[firstIndex][2] + b1 * this.controlPoints[secondIndex][2] + b0 * this.controlPoints[thirdIndex][2];

            //Calculo la tangente
            var dx = d2 * this.controlPoints[firstIndex][0] + d1 * this.controlPoints[secondIndex][0] + d0 * this.controlPoints[thirdIndex][0];
            var dy = d2 * this.controlPoints[firstIndex][1] + d1 * this.controlPoints[secondIndex][1] + d0 * this.controlPoints[thirdIndex][1];
            var dz = d2 * this.controlPoints[firstIndex][2] + d1 * this.controlPoints[secondIndex][2] + d0 * this.controlPoints[thirdIndex][2];

            //Creo el objeto Point para guardar los datos de posiciÃ³n, tangente, normal y binormal
            var position = vec3.fromValues(x, y, z);
            var tangent = vec3.normalize(vec3.create(), vec3.fromValues(dx, dy, dz));
            var binormal = this.normal ? vec3.normalize(vec3.create(), vec3.cross(vec3.create(), tangent, this.normal)) : null;
            points.push({"position": position, "tangent": tangent, "normal": this.normal, "binormal": binormal});
        }
    };
    Bspline.prototype.fullCurveFromSegmentControlPoints = function () {
        var segments = this.slidingWindow.length - 2;
        var startSliding;
        var currentWindow;
        var points = [];
        for (startSliding = 0; startSliding < segments; startSliding += 1) {
            currentWindow = vec3.fromValues(this.slidingWindow[startSliding], this.slidingWindow[startSliding + 1], this.slidingWindow[startSliding + 2]);
            this.calculateCurvePointAndStoreIt(points, currentWindow[0], currentWindow [1], currentWindow [2]);
        }
        return points.slice(0);
    };
    Bspline.prototype.getCurvePoints = function () {
        if (this.interpolateExtreme) {
            return this.fullCurveFromSegmentControlPoints();
        }
        var segments = this.controlPoints.length - 2;
        var points = [];
        for (var i = 0; i < segments; ++i) {
            this.calculateCurvePointAndStoreIt(points, i, i + 1, i + 2);
        }
        return points;
    };
}());