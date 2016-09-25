/*jslint browser: true*/
/*global Cylinder */
var BasicShapeContainer;
(function () {
    "use strict";
    BasicShapeContainer = function (graphicContainer) {
        this.cylinder = new Cylinder(graphicContainer);
    };
}());