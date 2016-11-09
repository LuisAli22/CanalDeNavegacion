var MoveBackward;
(function () {
    "use strict";
    MoveBackward = function (scene) {
        this.scene = scene;
    };
    MoveBackward.prototype.execute = function () {
        this.scene.moveBackward();
    };
}());

