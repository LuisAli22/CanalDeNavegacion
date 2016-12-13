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
        this.riverWidth = 70;
        this.streetWidth = 4.5;
        this.riverWidthStep = (this.riverWidth / this.levelControlPointsAmount);
        this.basin = new Basin(graphicContainer, this.riverWidth, this.levelControlPointsAmount, this.riverWidthStep);
        this.water = new Water(this.graphicContainer, 360, 720, 360, 360, [360, 0, 180]);
        var xLeftSide = this.basin.getLeftEdge();
        var xRightSide = this.basin.getRightEdge();
        this.street = new Street(graphicContainer, xRightSide, xLeftSide, this.streetWidth);
        this.bridge = new Bridge(graphicContainer, this.basin.getBottomRiver(), this.riverWidth, this.street, xLeftSide, xRightSide);
        this.materialKa = [0.3, 0.3, 0.3];
        this.materialKd = [0.9, 0.9, 0.9];
        this.materialKs = [1.0, 1.0, 1.0];
    };

    Ground.prototype.getStreet = function () {
        return this.street;
    };
    Ground.prototype.draw = function (modelViewMatrix) {
        this.basin.draw(modelViewMatrix);
        //this.grassLeft.draw(modelViewMatrix);
        //this.grassRight.draw(modelViewMatrix);
        this.street.draw(modelViewMatrix);
        this.bridge.draw(modelViewMatrix);
        this.water.draw(modelViewMatrix);
    };
}());
