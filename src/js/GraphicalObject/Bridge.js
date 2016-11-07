/*global controlValues, Tower, ModelViewMatrixStack, mat4, FARFROMANYPOINT, TextureHandler, Bspline, BridgeTensor, vec3, vec2, riverMap*/
var Bridge;
(function () {
    "use strict";
    Bridge = function (graphicContainer, bottomRiverYValue, riverWidth, street, xLeftSide, xRightSide) {
        this.graphicContainer = graphicContainer;
        this.xLeftSide = xLeftSide;
        this.xRightSide = xRightSide;
        this.bottomRiverValue = bottomRiverYValue;
        this.riverWidth = riverWidth;
        this.streetZPositionValue = (controlValues.bridgePosition / 100) * 360;
        this.towerAmount = controlValues.towerAmount;
        this.height = (controlValues.ph1 + controlValues.ph2 + controlValues.ph3) / 2;
        this.towerXPosition = street.getStreetXCenter() - (this.riverWidth / 2);
        this.streetWidth = street.getWidth();
        this.streetTrajectory = street.getTrajectory();
        this.towerTh1 = 0;
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture("img/bridge.jpg");
        this.leftSideTensorTrajectory = [];
        this.rightSideTensorTrajectory = [];
        this.towerWidth = 0;
        this.towers = this.initTowers();
        //this.createTensorLeftSideTrajectory();
        this.tensor1 = new BridgeTensor(graphicContainer, this.leftSideTensorTrajectory);
        this.tensor2 = new BridgeTensor(graphicContainer, this.rightSideTensorTrajectory);
        this.middleTensorTrajectory = [];
        /*this.createTensorRightSideTrajectory();
         this.createTensorMiddleTrajectory();
         this.createTensorRightSideTrajectory();*/
    };
    Bridge.prototype.createTensorTrajectory = function (tensorXbegin, tensorTrajectory, signOrientation) {
        var xBegin = tensorXbegin;//this.xRightSide;//180 - (this.riverWidth / 2);
        var yBegin = 1;
        var z = this.towerZPosition;//this.streetZPositionValue + (this.streetWidth / 2);
        //var steps = [0.5, 0.625, 0.75];
        var xEnd = this.towerXPosition - this.towerWidth / 2;//xBegin + (this.riverWidth / (this.towerAmount + 1));
        var yEnd = this.height;
        var xWidthFromBeginToTower = Math.abs((xEnd - xBegin));
        var yHeightFromLevel0ToTopTower = yEnd - yBegin;
        var controlPoints = [[xBegin, yBegin, z], [xBegin + (signOrientation * (xWidthFromBeginToTower / 2)), yBegin, z], [xEnd, yBegin + yHeightFromLevel0ToTopTower / 2, z], [xEnd, yEnd, z]];
        /*steps.forEach(function (step) {
         var x = xBegin + step * xWidthFromBeginToTower;
         var y = yBegin + step * yHeightFromLevel0ToTopTower;
         controlPoints.push([x, y, z]);
         }, this);*/

        controlPoints.push([xEnd, yEnd, z]);
        var bSpline = new Bspline(controlPoints, 5, [0, 0, 1]);
        var curvePoints = bSpline.getCurvePoints();
        curvePoints.forEach(function (element) {
            tensorTrajectory.push(element);
        }, this);
    };
    Bridge.prototype.findTowerStreetIntersection = function () {
        var indexStreet;
        var currentPosition;
        for (indexStreet = 0; indexStreet < this.streetTrajectory.length; indexStreet += 1) {
            currentPosition = this.streetTrajectory[indexStreet].position;
            if (Math.abs(currentPosition[0] - this.towerXPosition) < 1) {
                return currentPosition[1];
            }
        }
        return FARFROMANYPOINT;
    };
    Bridge.prototype.setTowerXPositionAndTh1Height = function () {
        this.towerXPosition += (this.riverWidth / (this.towerAmount + 1));
        this.towerTh1 = this.findTowerStreetIntersection();
    };
    Bridge.prototype.initTowers = function () {
        var towers = [];
        var towerIndex;
        var totalTowers = 2 * this.towerAmount;
        var towerPosition = [];
        for (towerIndex = 0; towerIndex < totalTowers; towerIndex += 1) {
            if (towerIndex % 2 === 0) {
                this.setTowerXPositionAndTh1Height(towerIndex);
            }
            this.towerZPosition = this.streetZPositionValue + Math.pow(-1, towerIndex) * (this.streetWidth / 2);
            if (this.towerTh1 !== FARFROMANYPOINT) {
                towerPosition = [this.towerXPosition, this.bottomRiverValue, this.towerZPosition];
                towers.push(new Tower(this.graphicContainer, towerPosition, this.towerTh1, this.height));
                this.towerWidth = towers[towers.length - 1].getWidth();
                if ((towerIndex === 0) || (towerIndex === totalTowers - 2)) {
                    var signOrientation = 1;
                    if (towerIndex === 0) {
                        this.createTensorTrajectory(this.xRightSide, this.leftSideTensorTrajectory, signOrientation);
                    } else {
                        signOrientation *= -1;
                        this.createTensorTrajectory(this.xLeftSide, this.rightSideTensorTrajectory, signOrientation);
                    }
                }
            }
        }
        return towers;
    };
    Bridge.prototype.getTensorZShift = function (index) {
        if (index % 2 === 0) {
            return 0;
        }
        return -this.streetWidth;
    };
    Bridge.prototype.drawExtremeTensor = function (index, modelViewMatrix, towerPosition) {
        if ((index < 2) || (index >= this.towers.length - 2)) {
            var mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            var zShift = this.getTensorZShift(index);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, 0, zShift));
            if (index < 2) {
                this.tensor1.draw(modelViewMatrix);
            } else {
                this.tensor2.draw(modelViewMatrix);
            }
            mat4.copy(modelViewMatrix, mvStack.pop());
        }
    };
    Bridge.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.towers.forEach(function (tower, index) {
            tower.draw(modelViewMatrix);
            var towerPosition = tower.getXPosition();
            this.drawExtremeTensor(index, modelViewMatrix, towerPosition);
        }, this);
    };
}());