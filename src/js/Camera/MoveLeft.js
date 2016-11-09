var MoveLeft;
(function () {
    "use strict";
    MoveLeft = function (scene) {
        this.scene = scene;
    };
    MoveLeft.prototype.execute = function () {
        this.scene.moveLeft();
    };
}());
