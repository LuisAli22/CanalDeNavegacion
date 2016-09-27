/*jslint browser: true*/
/*global RUTAIMAGENMARTE, Buffer*/
var GraphicalObject;
(function () {
    "use strict";
    GraphicalObject = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        //this.gl = this.graphicContainer.getContext();
        this.texture = null;
        this.bufferList = {"position": [], "normal": [], "texture_coord": [], "index": []};
    };

    GraphicalObject.prototype.mapBuffersToDataStore = function () {
        this.graphicContainer.createDataStore(this.bufferList);
        /*var graphicalObject = this;
         Object.keys(this.bufferList).forEach(function (key) {
         graphicalObject.graphicContainer.createDataStore(graphicalObject.bufferList[key]);
         });*/
    };
    GraphicalObject.prototype.draw = function (modelViewMatrix) {
        this.graphicContainer.defineGenericVertexAtributeArray();
        /*var graphicalObject = this;
         Object.keys(this.bufferList).forEach(function (key) {
         if (key !== "index") {
         graphicalObject.graphicContainer.defineGenericVertexAtributeArray(graphicalObject.bufferList[key]);
         }
         });*/
        this.graphicContainer.setTextureModelViewMatrixNormalMatrixTAndDraw(modelViewMatrix, this.texture);
    };
    GraphicalObject.prototype.initializeTexture = function () {
        this.graphicContainer.initializeTexture();
    };
}());