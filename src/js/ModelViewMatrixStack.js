/*jslint browser: true*/
/*global mat4*/
var ModelViewMatrixStack = (function () {
    "use strict";
    var instance;

    function init() {
        var stack = [];
        return {
            push: function (mvMatrix) {
                var mvMatrixCopy = mat4.clone(mvMatrix);
                stack.push(mvMatrixCopy);
            },
            pop: function () {
                if (stack.length === 0) {
                    throw "Invalid popMatrix!";
                }
                return stack.pop();
            },
            length: function () {
                return stack.length;
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
}());