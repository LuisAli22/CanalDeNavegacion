/*global alert, dat, controlValues*/
var GraphicalUserInterfaceControl;
(function () {
    "use strict";
    GraphicalUserInterfaceControl = function () {
        this.gui = new dat.GUI();
        this.f1 = this.gui.addFolder("Comandos");
        this.f1.add(controlValues, "reiniciar").name("Reiniciar");
        this.f1.add(controlValues, "detener").name("detener");
        this.f1.open();

        this.f2 = this.gui.addFolder("Parametros generales");
        this.f2.add(controlValues, "alturaMaxima", 1.0, 60.0).name("altura maxima").step(1);
        this.f2.add(controlValues, "riverWidth", 40, 200).name("Ancho del rio");

        this.f2.add(controlValues, "modo", ["random", "secuencial"]).name("modo");
        this.f3 = this.gui.addFolder("Parametros Especiales ");
        this.f3.add(controlValues, "umbral", 0.0, 1.0).name("umbral");
    };
    GraphicalUserInterfaceControl.prototype.start = function () {
        this.f1.open();
        this.f2.open();
        this.f3.open();
    };
}());
