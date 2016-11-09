var ToogleCamera;
(function () {
    "use strict";
    ToogleCamera = function (scene) {
        this.scene = scene;
    };
    ToogleCamera.prototype.execute = function () {
        this.scene.toogleCamera();
    };
}());
