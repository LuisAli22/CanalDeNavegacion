/*global Bspline */
var TwoDimensionShapeContainer;
(function () {
    "use strict";
    TwoDimensionShapeContainer = function (graphicContainer) {
        this.bSplineCurve = new Bspline(graphicContainer);
    };
}());