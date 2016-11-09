var MoveForward;
(function () {
    "use strict";
    MoveForward = function (scene) {
        this.scene = scene;
    };
    MoveForward.prototype.execute = function () {
        this.scene.moveForward();
    };
}());

