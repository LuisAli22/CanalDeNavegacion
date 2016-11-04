/*global TreeCrown, TreeTrunk, mat4, vec3, ModelViewMatrixStack*/
var Tree;
(function () {
    "use strict";
    Tree = function (graphicContainer, slices, pointsPerSegment, randomize) {
        this.randomizeFactor = 0.4;
        this.trunkHeight = 1.0;
        this.trunkRadius = 0.1;
        this.crownRadius = 0.6;
        this.crown = new TreeCrown(graphicContainer, slices, pointsPerSegment);
        this.trunk = new TreeTrunk(graphicContainer, slices);
        if (randomize) {
            this.randomizeSize();
        }
    };
    Tree.prototype.randomizeSize = function () {
        var r = 1 + Math.random() * this.randomizeFactor;
        this.trunkHeight *= r;
        this.trunkRadius *= r;
        this.crownRadius *= r;
    };
    Tree.prototype.draw = function (modelViewMatrix) {
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.trunkRadius, this.trunkHeight, this.trunkRadius));
        this.trunk.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
        mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, this.trunkHeight, 0));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.crownRadius, this.crownRadius, this.crownRadius));
        this.crown.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());