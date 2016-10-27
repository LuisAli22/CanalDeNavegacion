/*global mat4, vec4, vec3, BsplineMatrix, XCOORDINATE, YCOORDINATE, ZCOORDINATE*/
var Bspline;
(function () {
    "use strict";
    Bspline = function (controlPoints, pointsPerSegment, normal) {
        this.controlPoints = controlPoints;
        this.pointsPerSegment = pointsPerSegment;
        this.normal = normal;
    };
    Bspline.prototype.getPositionOrTangent = function (u, coordinate, slidingWindow, getPosition) {
        var bSplineMatrix = BsplineMatrix.getInstance();
        var x = this.controlPoints[slidingWindow[0]][coordinate];
        var y = this.controlPoints[slidingWindow[1]][coordinate];
        var z = this.controlPoints[slidingWindow[2]][coordinate];
        var w = this.controlPoints[slidingWindow[3]][coordinate];
        var currentControlPointsInOneCoordinate = [x, y, z, w];
        if (x === 0 && y === 0 && z === 0 && w === 0) {
            return 0;
        }
        bSplineMatrix.multiplyByVector(currentControlPointsInOneCoordinate);
        return bSplineMatrix.getCurvePoint(u, getPosition);
        /*position.add(bSplineMatrix.getCurvePoint(u, true));
         tangent.add(bSplineMatrix.getCurvePoint(u, false));*/
    };
    Bspline.prototype.getIndex = function (position) {
        if (position < 2) {
            return 0;
        }
        if ((position - 2) < (this.controlPoints.length)) {
            return (position - 2);
        }
        return (this.controlPoints.length - 1);
    };
    Bspline.prototype.getCurrentPoint = function (u, slidingWindow) {
        var xPosition = this.getPositionOrTangent(u, XCOORDINATE, slidingWindow, true);
        var yPosition = this.getPositionOrTangent(u, YCOORDINATE, slidingWindow, true);
        var zPosition = this.getPositionOrTangent(u, ZCOORDINATE, slidingWindow, true);
        var position = vec3.fromValues(xPosition, yPosition, zPosition);
        var xTangent = this.getPositionOrTangent(u, XCOORDINATE, slidingWindow, false);
        var yTangent = this.getPositionOrTangent(u, YCOORDINATE, slidingWindow, false);
        var zTangent = this.getPositionOrTangent(u, ZCOORDINATE, slidingWindow, false);
        var tangent = vec3.fromValues(xTangent, yTangent, zTangent);
        vec3.normalize(tangent, tangent);
        var binormal = vec3.create();
        if (this.normal) {
            vec3.normalize(binormal, vec3.cross(vec3.create(), tangent, this.normal));
        }
        return {"position": position, "tangent": tangent, "normal": this.normal, "binormal": binormal};
    };
    Bspline.prototype.slideSegmentsAndStorePoints = function (points) {
        var curveIdentifier;
        var curveAmount = this.controlPoints.length + 1;
        var slidingWindow = vec4.create();
        var u;
        var pointId;
        for (curveIdentifier = 0; curveIdentifier < curveAmount; curveIdentifier += 1) {
            vec4.set(slidingWindow, this.getIndex(curveIdentifier), this.getIndex(curveIdentifier + 1), this.getIndex(curveIdentifier + 2), this.getIndex(curveIdentifier + 3));
            for (pointId = 0; pointId < this.pointsPerSegment; pointId += 1) {
                u = (pointId / (this.pointsPerSegment - 1));
                if (!((u === 0) && (curveAmount > 0))) {
                    points.push(this.getCurrentPoint(u, slidingWindow));
                }
            }
        }
    };
    Bspline.prototype.getCurvePoints = function () {
        var points = [];
        this.slideSegmentsAndStorePoints(points);
        return points.slice(0);
    };
}());