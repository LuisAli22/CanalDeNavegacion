/*global Float32Array, Uint16Array, mat3*/
var GraphicalObject;
(function () {
    "use strict";
    GraphicalObject = function (graphicContainer) {
        this.graphicContainer = graphicContainer;
        this.gl = graphicContainer.getContext();
        this.shaderProgram = graphicContainer.getShaderProgram();
        this.bufferList = {
            "position": [],
            "normal": [],
            "texture_coord": [],
            "index": [],
            "tangent": [],
            "binormal": [],
            "color": []
        };
        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        this.webgl_tangent_buffer = null;
        this.webgl_binormal_buffer = null;
        this.webgl_color_buffer = null;
    };
    GraphicalObject.prototype.incrementIndex = function (index) {
        return (index % 2 === 0);
    };
    GraphicalObject.prototype.loadIndexBufferData = function (nz, nx) {
        var trajectoryIndex;
        var levelIndex;
        var levelLength = nz;
        var trajectoryLength = nx;
        var lowerStartIndex = 0;
        var upperStartIndex;
        for (trajectoryIndex = 0; trajectoryIndex < trajectoryLength - 1; trajectoryIndex += 1) {
            upperStartIndex = lowerStartIndex + levelLength;
            for (levelIndex = 0; levelIndex < levelLength; levelIndex += 1) {
                this.bufferList.index.push(lowerStartIndex);
                this.bufferList.index.push(upperStartIndex);
                if (this.incrementIndex(trajectoryIndex)) {
                    lowerStartIndex += 1;
                    upperStartIndex += 1;
                } else {
                    lowerStartIndex -= 1;
                    upperStartIndex -= 1;
                }
            }
            lowerStartIndex = this.bufferList.index[this.bufferList.index.length - 1];
        }
    };
    GraphicalObject.prototype.bindBuffers = function () {
        this.webgl_normal_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.normal), this.gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.bufferList.normal.length / 3;
        this.webgl_texture_coord_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.texture_coord), this.gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.bufferList.texture_coord.length / 2;
        this.webgl_position_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.position), this.gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.bufferList.position.length / 3;
        this.webgl_index_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.bufferList.index), this.gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.bufferList.index.length;
        if (this.bufferList.tangent.length !== 0) {
            this.webgl_tangent_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.tangent), this.gl.STATIC_DRAW);
            this.webgl_tangent_buffer.itemSize = 3;
            this.webgl_tangent_buffer.numItems = this.bufferList.tangent.length / 3;
        }
        if (this.bufferList.binormal.length !== 0) {
            this.webgl_binormal_buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.binormal), this.gl.STATIC_DRAW);
            this.webgl_binormal_buffer.itemSize = 3;
            this.webgl_binormal_buffer.numItems = this.bufferList.binormal.length / 3;
        }
        this.webgl_color_buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.bufferList.color), this.gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.bufferList.color.length / 3;
    };
    GraphicalObject.prototype.defineGenericVertexAtributeArray = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webgl_position_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
        if (this.webgl_tangent_buffer !== null) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexTangentAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        }
        if (this.webgl_binormal_buffer !== null) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_binormal_buffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexBinormalAttribute, this.webgl_binormal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexBinormalAttribute, this.webgl_normal_buffer.itemSize, this.gl.FLOAT, false, 0, 0);
        }
    };
    GraphicalObject.prototype.draw = function (modelViewMatrix) {
        this.defineGenericVertexAtributeArray();
        this.graphicContainer.setMatrixUniforms(modelViewMatrix);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, this.gl.UNSIGNED_SHORT, 0);
    };
}());