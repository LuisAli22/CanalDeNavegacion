/*global GraphicalObject, XCOORDINATE, YCOORDINATE, ZCOORDINATE, vec3, Calculator, SweptSurface, mat4, Tree, TextureHandler, Street, ModelViewMatrixStack, controlValues*/
/*global riverMap*/
var Grass;
(function () {
    "use strict";
    Grass = function (graphicContainer, sandPositions, levelControlPointsAmount, grassLimit, streetWidth) {
        GraphicalObject.call(this, graphicContainer);
        this.sandPositions = sandPositions.slice(0);
        this.levelControlPointsAmount = levelControlPointsAmount;
        this.grassLimit = grassLimit;
        this.grassVertexAmountInABank = 50;
        this.grassPositions = [];
        this.streetWidth = streetWidth;
        this.streetZPositionValue = ((controlValues.bridgePosition / 100) * 360) - (this.streetWidth / 2);
        this.pointsPerSegment = 10;
        this.slices = 24;
        this.xRiverStop = 0;
        this.grassTangentNormalBinormalAndPositions = [];
        this.treesPositions = [];
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.grassTexture = this.textureHandler.initializeTexture("img/pasto3.jpg");
        this.setUpBuffers();
        this.trees = this.initTrees();
    };
    Grass.prototype = Object.create(GraphicalObject.prototype);
    Grass.prototype.constructor = Grass;
    Grass.prototype.setRiverStreetIntersection = function (zCoordinate, xCoordinate, signOrientation) {
        var streetZPosition = (controlValues.bridgePosition / 100) * 360;
        if (zCoordinate - streetZPosition < 1) {
            this.xRiverStop = xCoordinate + (signOrientation) * 7;
        }
    };
    Grass.prototype.getRiverIntersection = function () {
        return this.xRiverStop;
    };
    Grass.prototype.setUpBuffers = function () {
        var index;
        var stepEdge = 0;
        for (index = 0; index < this.sandPositions.length; index += 3) {
            if (this.isEdge(index)) {
                if (stepEdge % 5 === 0) {
                    this.addBankPoints(index);
                }
                stepEdge += 1;
            }
        }
        /* var calculator = Calculator.getInstance();
         calculator.storePositionsTangentNormalAndBinormal(this.grassPositions, this.grassTangentNormalBinormalAndPositions);
         var u = 0.0;
         var v = 0.0;
         var sectionSize = this.grassTangentNormalBinormalAndPositions.length / this.grassVertexAmountInABank;
         var vStep = 1 / (sectionSize - 1);
         var uStep = 1 / (this.grassVertexAmountInABank - 1);
         this.grassTangentNormalBinormalAndPositions.forEach(function (element, index) {
         u = (index % (this.grassVertexAmountInABank)) * uStep;
         v = Math.floor(index / this.grassVertexAmountInABank) * vStep;
         this.bufferList.position.push(element.position[XCOORDINATE], element.position[YCOORDINATE], element.position[ZCOORDINATE]);
         this.bufferList.tangent.push(element.tangent[XCOORDINATE], element.tangent[YCOORDINATE], element.tangent[ZCOORDINATE]);
         this.bufferList.normal.push(element.normal[XCOORDINATE], element.normal[YCOORDINATE], element.normal[ZCOORDINATE]);
         this.bufferList.binormal.push(element.binormal[XCOORDINATE], element.binormal[YCOORDINATE], element.binormal[ZCOORDINATE]);
         this.bufferList.texture_coord.push(v, u);
         }, this);*/
        this.loadIndexBufferData(this.grassVertexAmountInABank, this.bufferList.position.length / (3 * this.grassVertexAmountInABank));
        this.bindBuffers();
    };
    Grass.prototype.initTrees = function () {
        var trees = [];
        var i;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            trees.push(new Tree(this.graphicContainer, this.slices, this.pointsPerSegment, true));
        }
        return trees;
    };
    Grass.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.grassTexture);
        GraphicalObject.prototype.draw.call(this, modelViewMatrix);
        var i;
        var treePosition;
        var mvStack;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            treePosition = this.treesPositions[i];
            mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(treePosition[0], treePosition[1], treePosition[2]));
            this.trees[i].draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, mvStack.pop());
        }
    };
    Grass.prototype.loadBufferList = function (element, u, v) {
        this.bufferList.position.push(element.position[XCOORDINATE], element.position[YCOORDINATE], element.position[ZCOORDINATE]);
        this.bufferList.tangent.push(element.tangent[XCOORDINATE], element.tangent[YCOORDINATE], element.tangent[ZCOORDINATE]);
        this.bufferList.normal.push(element.normal[XCOORDINATE], element.normal[YCOORDINATE], element.normal[ZCOORDINATE]);
        this.bufferList.binormal.push(element.binormal[XCOORDINATE], element.binormal[YCOORDINATE], element.binormal[ZCOORDINATE]);
        this.bufferList.texture_coord.push(u, v);
    };
    /*Grass = function (graphicContainer, riverLevelGeometry) {
        GraphicalObject.call(this, graphicContainer);
     this.gl = graphicContainer.getContext();
     this.shaderProgram = graphicContainer.getShaderProgram();
     this.riverLevelGeometry = riverLevelGeometry;
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.grassTexture = this.textureHandler.initializeTexture("img/pasto3.jpg");
     this.textureNormal = this.textureHandler.initializeTexture("img/pasto3-normalmap.jpg");
     this.materialKa = [0.3, 0.3, 0.3];
     this.materialKd = [0.9, 0.9, 0.9];
     this.materialKs = [0.1, 0.1, 0.1];
     this.materialShininess = 4.0;
     this.createLevelPoints();
     this.sweptSurface = new SweptSurface(graphicContainer, this.levelGeometry, riverMap.trajectory, null);
    };
    Grass.prototype = Object.create(GraphicalObject.prototype);
    Grass.prototype.constructor = Grass;
     Grass.prototype.createLevelPoints = function () {
     this.levelGeometry = [];
     var firstPoint = {"position": this.riverLevelGeometry[0].position, "normal": this.riverLevelGeometry[0].normal, "tangent": this.riverLevelGeometry[0].tangent, "binormal": this.riverLevelGeometry[0].binormal};//vec3.clone(this.riverLevelGeometry[0]);
     this.levelGeometry.push(firstPoint);
     var riverLevelLength = this.riverLevelGeometry.length;
     var previousPoint;
     this.riverLevelGeometry.forEach(function (element, index) {
     if (index > 0) {
     var currentPoint = {"position": element.position, "normal": element.normal, "tangent": element.tangent, "binormal": element.binormal};
     if ((index === 1) || (index === riverLevelLength - 2)) {
     this.levelGeometry.push({"position": currentPoint.position, "normal": currentPoint.normal, "tangent": currentPoint.tangent, "binormal": currentPoint.binormal});
     } else {
     this.levelGeometry.push(previousPoint);
     }
     previousPoint = {"position": currentPoint.position, "normal": currentPoint.normal, "tangent": currentPoint.tangent, "binormal": currentPoint.binormal};
     }
     }, this);
     var lastPoint = this.riverLevelGeometry[riverLevelLength - 1];//vec3.clone(this.riverLevelGeometry[riverLevelLength - 1]);
     this.levelGeometry.push({"position": lastPoint.position, "normal": lastPoint.normal, "tangent": lastPoint.tangent, "binormal": lastPoint.binormal});
     };

     Grass.prototype.setRiverStreetIntersection = function (zCoordinate, xCoordinate, signOrientation) {
        var streetZPosition = (controlValues.bridgePosition / 100) * 360;
        if (zCoordinate - streetZPosition < 1) {
            this.xRiverStop = xCoordinate + (signOrientation) * 7;
        }
    };
    Grass.prototype.getRiverIntersection = function () {
        return this.xRiverStop;
    };
     Grass.prototype.loadBufferList = function (element, u, v) {
     this.bufferList.position.push(element.position[XCOORDINATE], element.position[YCOORDINATE], element.position[ZCOORDINATE]);
     this.bufferList.tangent.push(element.tangent[XCOORDINATE], element.tangent[YCOORDINATE], element.tangent[ZCOORDINATE]);
     this.bufferList.normal.push(element.normal[XCOORDINATE], element.normal[YCOORDINATE], element.normal[ZCOORDINATE]);
     this.bufferList.binormal.push(element.binormal[XCOORDINATE], element.binormal[YCOORDINATE], element.binormal[ZCOORDINATE]);
     this.bufferList.texture_coord.push(u, v);
     };
    Grass.prototype.setUpBuffers = function () {
        var index;
        var stepEdge = 0;
        for (index = 0; index < this.sandPositions.length; index += 3) {
            if (this.isEdge(index)) {
                if (stepEdge % 5 === 0) {
                    this.addBankPoints(index);
                }
                stepEdge += 1;
            }
        }
        this.loadIndexBufferData(this.grassVertexAmountInABank, this.bufferList.position.length / (3 * this.grassVertexAmountInABank));
        this.bindBuffers();
    };
    Grass.prototype.initTrees = function () {
        var trees = [];
        var i;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            trees.push(new Tree(this.graphicContainer, this.slices, this.pointsPerSegment, true));
        }
        return trees;
    };
    Grass.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.grassTexture);
     this.textureHandler.setTextureNormal(this.textureNormal);
     this.graphicContainer.setMaterialUniforms(this.materialKa, this.materialKd, this.materialKs, this.materialShininess);
     this.gl.uniform1i(this.shaderProgram.useNormalMap, 1);
     this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 1);
     this.sweptSurface.draw(modelViewMatrix);
     this.gl.uniform1i(this.shaderProgram.useNormalMap, 0);
     this.gl.uniform1i(this.shaderProgram.useDiffuseMap, 0);
        var i;
        var treePosition;
        var mvStack;
        for (i = 0; i < this.treesPositions.length; i += 1) {
            treePosition = this.treesPositions[i];
            mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(treePosition[0], treePosition[1], treePosition[2]));
            this.trees[i].draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, mvStack.pop());
        }
     };*/
}());