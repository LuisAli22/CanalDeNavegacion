/*global SweptSurface, Calculator, vec3, ModelViewMatrixStack, mat4, TOWERSCALEFACTOR, TextureHandler*/
var BridgeTensor;
(function () {
    "use strict";
    BridgeTensor = function (graphicContainer, trajectory, radius, uTextureScale, vTextureScale) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.radius = radius;
        this.levelGeometry = [];
        this.createLevelGeometry();
        this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, trajectory, uTextureScale, vTextureScale, false);
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.tensorTexture = this.textureHandler.initializeTexture("img/alambres.jpg");
        this.tensorTextureNormal = this.textureHandler.initializeTexture("img/alambres-mormalmap.jpg");
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [0.9, 0.9, 0.9];
        this.materialShininess = 4.0;
        this.reflectFactor = 0.6;
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
        this.textureHandler.setTextureUniform(this.tensorTexture);
        this.textureHandler.setTextureNormal(this.tensorTextureNormal);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess, false);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 1);
        this.gl.uniform1f(this.shaderProgram.reflectFactorUniform, this.reflectFactor);
        this.sweptSurface.draw(modelViewMatrix);
        this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
        this.gl.uniform1i(this.shaderProgram.useReflectionUniform, 0);
    };
}());