/*global Cylinder*/
var ThreeDimensionShapeContainer;
(function () {
    "use strict";
    ThreeDimensionShapeContainer = function (sceneGraphicContainer) {
        this.cylinder = new Cylinder(sceneGraphicContainer);
    };
}());