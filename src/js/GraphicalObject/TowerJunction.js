/*global TowerBody, TOWERSCALEFACTOR*/
var TowerJunction;
(function () {
    "use strict";
    TowerJunction = function (graphicContainer, height) {
        TowerBody.call(this, graphicContainer, height);
    };
    TowerJunction.prototype = Object.create(TowerBody.prototype);
    TowerJunction.prototype.constructor = TowerBody;
    TowerJunction.prototype.getScaleFactor = function (profilePointNumber) {
        return 1 - ((1 - TOWERSCALEFACTOR) * (profilePointNumber / (this.profilePointNumbers.length - 1)));
    };
}());
