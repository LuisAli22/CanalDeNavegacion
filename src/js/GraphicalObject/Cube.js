/*global GraphicalObject*/
var Cube;
(function () {
    "use strict";
    Cube = function (graphicContainer, textureScaleU, textureScaleV) {
        GraphicalObject.call(this, graphicContainer);
        if (textureScaleU === null) {
            this.textureScaleU = 1;
        }
        this.textureScaleV = textureScaleV;
        if (textureScaleV === null) {
            this.textureScaleV = 1;
        }
        this.setUpBuffers();
    };
    Cube.prototype = Object.create(GraphicalObject.prototype);
    Cube.prototype.constructor = Cube;
    Cube.prototype.getSize = function () {
        return this.size;
    };
    Cube.prototype.setUpBuffers = function () {
        this.bufferList.position = [
            // Front face
            -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,

            // Back face
            -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

            // Top face
            -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

            // Right face
            0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,

            // Left face
            -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5];
        this.bufferList.texture_coord = [
            // Front
            0.0, 0.0, this.textureScaleV, 0.0, this.textureScaleV, this.textureScaleU, 0.0, this.textureScaleU,

            // Back
            0.0, 0.0, this.textureScaleU, 0.0, this.textureScaleU, this.textureScaleV, 0.0, this.textureScaleV,

            // Top
            0.0, 0.0, this.textureScaleU, 0.0, this.textureScaleU, this.textureScaleV, 0.0, this.textureScaleV,

            // Bottom
            0.0, 0.0, this.textureScaleU, 0.0, this.textureScaleU, this.textureScaleV, 0.0, this.textureScaleV,

            // Right
            0.0, 0.0, this.textureScaleU, 0.0, this.textureScaleU, this.textureScaleV, 0.0, this.textureScaleV,

            // Left
            0.0, 0.0, this.textureScaleV, 0.0, this.textureScaleV, this.textureScaleU, 0.0, this.textureScaleU];
        this.bufferList.normal = [
            // Front
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            // Back
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            // Bottom
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            // Left
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
        this.bufferList.binormal = [
            //Front
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            //Back
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

            //Top  
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            //Bottom
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

            //Right
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            //Left  
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0
        ];
        this.bufferList.tangent = [
            //Front
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            //Back
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

            //Top
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            //Bottom
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            //Right  
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            //Left
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0

        ];
        this.bufferList.index = [0, 3, 1, 2, 7, 6, 4, 5, 0, 3, 3, 2, 5, 6, 6, 7, 7, 4, 1, 0];
        this.bindBuffers();
    };
}());