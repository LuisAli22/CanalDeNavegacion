/*jslint browser: true*/
/*global mat4*/
var ModelViewMatrixStack;
(function () {
    "use strict";
    ModelViewMatrixStack = function () {
        this.stack = [];
    };
    ModelViewMatrixStack.prototype.push = function (mvMatrix) {
        var mvMatrixCopy = mat4.clone(mvMatrix);
        this.stack.push(mvMatrixCopy);
    };
    ModelViewMatrixStack.prototype.pop = function () {
        if (this.stack.length === 0) {
            throw "Invalid popMatrix!";
        }
        return this.stack.pop();
    };
    ModelViewMatrixStack.prototype.length = function () {
        return this.stack.length;
    };
}());