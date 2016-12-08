/*global GraphicalObject*/
var Grid;
(function () {
    "use strict";
    Grid = function (graphicContainer, dimZ, dimX, nz, nx, uTextureScale, vTextureScale) {
        GraphicalObject.call(this, graphicContainer);

        this.uTextureScale = uTextureScale;
        this.vTextureScale = vTextureScale;

        this.dimZ = dimZ;
        this.dimX = dimX;
        this.nz = nz;
        this.nx = nx;
        this.initBuffers();
    };
    Grid.prototype = Object.create(GraphicalObject.prototype);
    Grid.prototype.constructor = Grid;
    Grid.prototype.initBuffers = function () {
        var posZ = -this.dimZ / 2;
        var posX = -this.dimX / 2;
        var stepZ = this.dimZ / (this.nz - 1);
        var stepX = this.dimX / (this.nx - 1);

        for (var i = 0; i < this.nx; i++) {
            for (var j = 0; j < this.nz; j++) {
                this.bufferList.position.push(posX);
                this.bufferList.position.push(0);
                this.bufferList.position.push(posZ);
                this.bufferList.normal.push(0, 1, 0);
                this.bufferList.binormal.push(1, 0, 0);
                this.bufferList.tangent.push(0, 0, 1);
                this.bufferList.texture_coord.push(this.uTextureScale * j);
                this.bufferList.texture_coord.push(this.vTextureScale * i);
                posZ += stepZ;
            }
            posZ = -this.dimZ / 2;
            posX += stepX;
        }
        this.loadIndexBufferData(this.nz, this.nx);
        this.bindBuffers();
    };
}());
