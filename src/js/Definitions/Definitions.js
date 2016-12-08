/*jshint esversion: 6 */
/*global vec4*/
const CANVASCONTEXTERROR = "Error al obteniendo el contexto del canvas. No se puede inicializar WebGL.";
const CANVASERRORMESSAGE = "Error obteniendo el canvas (por id)";
const MENSAJEERRORSHADER = "Error obeniendo el shader (por id)";
const FRAGMENTSHADERID = "shader-fs";
const VERTEXSHADERID = "shader-vs";
const PROGRAMPARAM = "No se puede inicializar los shaders. Error en el parametro del programa";
const MOUSESENSITIVENESS = 100 * Math.PI;
const BOTONIZQUIERDODELMOUSE = 1;
const XCOORDINATE = 0;
const YCOORDINATE = 1;
const ZCOORDINATE = 2;
const THETAMIN = 0.01;
const THETAMAX = Math.PI - 0.01;
const PHIMIN = -Number.MAX_VALUE;
const PHIMAX = Number.MAX_VALUE;
const FRUSTUMFAR = 4000.1;
const FRUSTUMNEAR = 0.1;
const MINIMUMRADIUS = 0.12;
const MAXIMUMRADIUS = 3500;
const MOVELEFT = -1;
const MOVERIGHT = -MOVELEFT;
const PEDESTRIANPOSITION = 500;
const TITAPEDESTRIANPOSITION = 1.55488;
const FIPEDESTRIANPOSITION = 0;
const RADIUSPEDESTRIANPOSITION = 10;
const FARFROMANYPOINT = -1;
const CLICKDISTANCESENSITIVENESS = 5;
const TOWERSCALEFACTOR = 0.6;
const TOWERWIDTH = 1;
const SCENESCALEFACTOR = 3;
const SKYDIMENSION = 1100;