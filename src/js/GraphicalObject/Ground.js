/*global SweptSurface, vec3, Calculator, controlValues, YCOORDINATE, ZCOORDINATE, XCOORDINATE, GrassRightSide*/
/*global ModelViewMatrixStack, GrassLeftSide, mat4, TextureHandler, Water, Street, Bridge, Basin*/
var Ground;
(function () {
    "use strict";
    Ground = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.levelControlPointsAmount = 8;
        this.riverWidth = 35;
        this.streetWidth = 4.5;
        this.riverWidthStep = (this.riverWidth / this.levelControlPointsAmount);
        this.basin = new Basin(graphicContainer, this.riverWidth, this.levelControlPointsAmount, this.riverWidthStep);
        this.water = new Water(graphicContainer, this.riverWidth, this.levelControlPointsAmount, this.riverWidthStep);
        this.grassRight = new GrassRightSide(graphicContainer, this.basin.getPositionBuffer(), this.levelControlPointsAmount, this.streetWidth);
        this.grassLeft = new GrassLeftSide(graphicContainer, this.basin.getPositionBuffer(), this.levelControlPointsAmount, this.streetWidth);
        this.street = new Street(graphicContainer, this.grassRight.getRiverIntersection(), this.grassLeft.getRiverIntersection(), this.streetWidth);
        var xLeftSide = this.grassLeft.getRiverIntersection();
        var xRightSide = this.grassRight.getRiverIntersection();
        this.bridge = new Bridge(graphicContainer, this.basin.getBottomRiver(), this.riverWidth, this.street, xLeftSide, xRightSide);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [1.0, 1.0, 1.0];
    };

    Ground.prototype.getStreet = function () {
        return this.street;
    };
    Ground.prototype.draw = function (modelViewMatrix) {
        this.water.draw(modelViewMatrix);
        this.basin.draw(modelViewMatrix);
        this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, 4);
        this.grassLeft.draw(modelViewMatrix);
        this.grassRight.draw(modelViewMatrix);
        this.street.draw(modelViewMatrix);
        this.bridge.draw(modelViewMatrix);
    };
}());
