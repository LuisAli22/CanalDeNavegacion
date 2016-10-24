var GraphicalObject;
(function () {
    "use strict";
    GraphicalObject = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.bufferList = {
            "position": [],
            "normal": [],
            "texture_coord": [],
            "index": [],
            "tangent": [],
            "binormal": []
        };
    };
    GraphicalObject.prototype.mapBuffersToDataStore = function () {
        this.graphicContainer.createDataStore(this.bufferList);
    };
    GraphicalObject.prototype.draw = function (modelViewMatrix) {
        this.graphicContainer.defineGenericVertexAtributeArray();
        this.graphicContainer.setModelMatrixNormalMatrixAndSamplerToShaderProgramAndDraw(modelViewMatrix);
    };
    GraphicalObject.prototype.setUpBuffers = function (slices, height) {
        this.loadBuffers(slices, height);
        this.mapBuffersToDataStore();
    };
}());