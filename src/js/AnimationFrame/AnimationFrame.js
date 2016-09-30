/**
 * Created by LuisAli22 on 29/09/16.
 */
/*global ModelViewMatrixStack, requestAnimFrame*/
var AnimationFrame;
(function () {
    "use strict";
    AnimationFrame = function () {
        this.mvStack = new ModelViewMatrixStack();
    };
    AnimationFrame.prototype.tick = function () {
        requestAnimFrame(this.tick.bind(this));
        this.draw();
    };
}());