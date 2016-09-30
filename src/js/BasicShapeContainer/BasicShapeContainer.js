/*jslint browser: true*/
/*global Cylinder */
var BasicShapeContainer;
(function () {
    "use strict";
    BasicShapeContainer = function (sceneGraphicContainer) {
        this.cylinder = new Cylinder(sceneGraphicContainer);
    };
}());