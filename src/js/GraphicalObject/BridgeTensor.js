/*global SweptSurface, Calculator, vec3, ModelViewMatrixStack, mat4, TOWERSCALEFACTOR*/
var BridgeTensor;
(function () {
    "use strict";
    BridgeTensor = function (graphicContainer, trajectory, radius, uTextureScale, vTextureScale) {
        this.radius = radius;
        this.levelGeometry = [];
        this.createLevelGeometry();
        this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, trajectory, uTextureScale, vTextureScale, false);
    };
    BridgeTensor.prototype.createLevelGeometry = function () {
        var angle;
        var x;
        var y;
        var position;
        var tangent;
        var normal;
        var binormal;
        var stepAngle = Math.PI / 24;
        var rotationMatrix = mat4.create();
        mat4.rotateZ(rotationMatrix, rotationMatrix, Math.PI / 2);
        for (angle = 0; angle <= 2 * Math.PI; angle += stepAngle) {
            x = this.radius * Math.cos(angle);
            y = this.radius * Math.sin(angle);
            position = vec3.fromValues(x, y, 0);
            binormal = vec3.normalize(vec3.create(), position);
            tangent = vec3.normalize(vec3.create(), vec3.fromValues(this.radius * Math.cos((Math.PI / 2) + angle), this.radius * Math.sin((Math.PI / 2) + angle), 0));
            normal = vec3.cross(vec3.create(), tangent, binormal);
            this.levelGeometry.push({"position": position, "normal": normal, "tangent": tangent, "binormal": binormal});
        }
    };
    BridgeTensor.prototype.draw = function (modelViewMatrix) {
        /*var mvStack = ModelViewMatrixStack.getInstance();
         mvStack.push(modelViewMatrix);*/
        this.sweptSurface.draw(modelViewMatrix);
        //mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());