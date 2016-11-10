/*global alert, dat, controlValues*/
var GraphicalUserInterfaceControl;
(function () {
    "use strict";
    GraphicalUserInterfaceControl = function () {
        this.gui = new dat.GUI();
        this.f1 = this.gui.addFolder("Comandos");
        this.f1.add(controlValues, "reiniciar").name("Reiniciar");
        this.f1.open();

        this.f2 = this.gui.addFolder("Parametros generales");
        this.f2.add(controlValues, "ph1", 5, 15).name("ph1").step(1);
        this.f2.add(controlValues, "ph2", 5, 15).name("ph2").step(1);
        this.f2.add(controlValues, "ph3", 5, 15).name("ph3").step(1);
        this.f2.add(controlValues, "s1", 1, 3).name("s1").step(1);
        this.f2.add(controlValues, "towerAmount", 2, 4).name("Cantidad de torres").step(1);
        this.f2.add(controlValues, "bridgePosition", 10, 100).name("Posicion del puente").step(1);
    };
    GraphicalUserInterfaceControl.prototype.start = function () {
        this.f1.open();
        this.f2.open();
    };
}());
