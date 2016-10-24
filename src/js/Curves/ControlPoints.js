var ControlPoints = (function () {
    "use strict";
    var instance;

    function init() {
        var controlPoints = [];
        return {
            length: function () {
                return controlPoints.length;
            },
            getPointCoordinate: function (index) {
                return controlPoints[index];
            },
            setPointCoordinate: function (index, coordinate) {
                controlPoints[index] = coordinate;
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
}());
