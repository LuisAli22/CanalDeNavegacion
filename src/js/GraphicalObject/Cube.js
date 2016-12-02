/*global GraphicalObject*/
var Cube;
(function () {
    "use strict";
    Cube = function (graphicContainer) {
        GraphicalObject.call(this, graphicContainer);
        this.size = 1;
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
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size,

            // Back
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size,

            // Top
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size,

            // Bottom
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size,

            // Right
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size,

            // Left
            0.0, 0.0, this.size, 0.0, this.size, this.size, 0.0, this.size];
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
        /*this.bufferList.index = [0, 1, 2, 0, 2, 3, // front
         4, 5, 6, 4, 6, 7, // back
         8, 9, 10, 8, 10, 11, // top
         12, 13, 14, 12, 14, 15, // bottom
         16, 17, 18, 16, 18, 19, // right
         20, 21, 22, 20, 22, 23 // left
         ];*/
        this.bufferList.index = [0, 3, 1, 2, 7, 6, 4, 5, 0, 3, 3, 2, 5, 6, 6, 7, 7, 4, 1, 0];
        this.bindBuffers();
    };
}());