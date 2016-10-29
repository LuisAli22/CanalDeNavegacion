/*global TreeCrown, TreeTrunk, mat4, vec3*/
var Tree;
(function () {
    "use strict";
    Tree = function (graphicContainer, slices, pointsPerSegment, randomize, mvStack, textureHandler) {
        this.mvStack = mvStack;
        this.randomizeFactor = 0.4;
        this.trunkHeight = 1.0;
        this.trunkRadius = 0.1;
        this.crownRadius = 0.6;
        this.crown = new TreeCrown(graphicContainer, slices, pointsPerSegment, textureHandler);
        this.trunk = new TreeTrunk(graphicContainer, slices, textureHandler);
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
        this.mvStack.push(modelViewMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.trunkRadius, this.trunkHeight, this.trunkRadius));
        this.trunk.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, this.mvStack.pop());
        this.mvStack.push(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, this.trunkHeight, 0));
        mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(this.crownRadius, this.crownRadius, this.crownRadius));
        this.crown.draw(modelViewMatrix);
        mat4.copy(modelViewMatrix, this.mvStack.pop());
    };
}());