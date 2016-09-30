/*global RiverMapGraphicContainer, AnimationFrame, vec4, vec2, Bspline*/
var RiverMap;
(function () {
    "use strict";
    RiverMap = function () {
        this.canvas = document.getElementById("riverMap");
        this.gl = this.canvas.getContext("2d");
        this.xControlPoints = vec4.create();
        this.yControlPoints = vec4.create();
        vec4.set(this.xControlPoints, 100, 200, 600, 700);
        vec4.set(this.yControlPoints, 450, 100, 100, 450);
        //this.riverMapGraphicContainer = new RiverMapGraphicContainer();
        this.currentU = 0;
        //this.riverMapGraphicContainer.bindEventFunctions(this);
        this.bSpline = new Bspline(this.xControlPoints, this.yControlPoints);
        this.mouseIsPressed = false;
    };
    RiverMap.prototype = Object.create(AnimationFrame.prototype);
    RiverMap.constructor = RiverMap;
    RiverMap.prototype.updateCoordinates = function (e) {
        //var pos=$("#riverMap").position();
        //$("#pad").html("mouse x: " + (e.pageX -pos.left)+ "<br>mouse y: " + (e.pageY-pos.top));
    };
    RiverMap.prototype.onMouseDown = function (event) {
        this.mouseIsPressed = true;
        this.updateCoordinates(event);
    };
    RiverMap.prototype.onMouseUp = function (event) {
        this.mouseIsPressed = false;
    };
    RiverMap.prototype.onMouseMove = function (event) {
        if (this.mouseIsPressed) {
            this.updateCoordinates(event);
        }
    };
    RiverMap.prototype.cubicCurve = function (u) {
        return this.bSpline.base(u);
    };
    RiverMap.prototype.firstDerivateCubicCurve = function () {
        return this.bSpline.derivatedBase(this.currentU);
    };
    RiverMap.prototype.draw = function () {
        this.drawCubicCurve(true);

        var punto = this.cubicCurve(this.currentU);
        this.currentU += 0.002;
        this.gl.lineWidth = 5;
        this.gl.beginPath();
        this.gl.arc(punto.x, punto.y, 10, 0, 2 * Math.PI);
        this.gl.strokeStyle = "#00FF00";
        this.gl.stroke();

        var der = this.firstDerivateCubicCurve();

        var modulo = Math.sqrt(der.x * der.x + der.y * der.y);
        der.x = der.x * 50 / modulo;
        der.y = der.y * 50 / modulo;
        this.dibujarVector(punto.x, punto.y, der.x, der.y, "#FF00FF");


        var normal = {
            "x": -der.y,
            "y": der.x
        };
        this.dibujarVector(punto.x, punto.y, normal.x, normal.y, "#00FFFF");
        if (this.currentU > 1) {
            this.currentU = 0;
        }
    };
    RiverMap.prototype.drawCubicCurve = function (dibujarGrafo) {
        /*        var p0 = this.puntosDeControl[0];
         var p1 = this.puntosDeControl[1];
         var p2 = this.puntosDeControl[2];
         var p3 = this.puntosDeControl[3];*/

        this.gl.lineWidth = 2;
        // Dibujamos la curva en color azul, entre u=0 y u=1 con deltaU

        var deltaU = 0.01; // es el paso de avance sobre la curva cuanto mas chico mayor es el detalle
        // u=0.05 son 20 segmentos (0.05=1/20)
        this.gl.clearRect(0, 0, 1000, 1000);
        this.gl.beginPath();
        var u;
        var punto;
        for (u = 0; u <= 1.001; u = u + deltaU) {
            // Tengo que calcular la posicion del punto c(u)
            punto = this.cubicCurve(u);

            if (u === 0) {
                this.gl.moveTo(punto.x, punto.y);
            }
            this.gl.lineTo(punto.x, punto.y);// hago una linea desde el ultimo lineTo hasta x,y
            //console.log("C("+u+")= "+punto.x+","+punto.y);
        }
        this.gl.strokeStyle = "#0000FF";
        this.gl.stroke();
        // Dibujo el grafo de control en color rojo, solo para verificar donde esta cada punto de control
        if (dibujarGrafo) {
            this.gl.beginPath();
            this.gl.moveTo(this.xControlPoints[0], this.yControlPoints[0]);
            this.gl.lineTo(this.xControlPoints[1], this.yControlPoints[1]);
            this.gl.lineTo(this.xControlPoints[2], this.yControlPoints[2]);
            this.gl.lineTo(this.xControlPoints[3], this.yControlPoints[3]);
            this.gl.strokeStyle = "#FF0000";
            this.gl.stroke();
        }
    };
    RiverMap.prototype.dibujarVector = function (x1, y1, x2, y2, color) {
        this.gl.beginPath();
        this.gl.moveTo(x1, y1);
        this.gl.lineTo(x1 + x2, y1 + y2);
        this.gl.strokeStyle = color;
        this.gl.stroke();
    };
}());
