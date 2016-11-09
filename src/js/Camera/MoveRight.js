var MoveRight;
(function () {
    "use strict";
    MoveRight = function (scene) {
        this.scene = scene;
    };
    MoveRight.prototype.execute = function () {
        this.scene.moveRight();
    };
}());

