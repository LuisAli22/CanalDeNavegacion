/*global controlValues, Tower, ModelViewMatrixStack, mat4, FARFROMANYPOINT, TextureHandler, Bspline, BridgeTensor, vec3, vec2, riverMap*/
var Bridge;
(function () {
    "use strict";
    Bridge = function (graphicContainer, bottomRiverYValue, riverWidth, street, xLeftSide, xRightSide) {
        this.graphicContainer = graphicContainer;
        this.xLeftSide = xLeftSide - 10;
        this.xRightSide = xRightSide + 10;
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
        this.middleTensors = this.createMiddleTensors();
        this.tensor1 = new BridgeTensor(graphicContainer, this.leftSideTensorTrajectory);
        this.tensor2 = new BridgeTensor(graphicContainer, this.rightSideTensorTrajectory);
    };
    Bridge.prototype.createTensorTrajectory = function (tensorXbegin, tensorTrajectory, signOrientation) {
        var xBegin = tensorXbegin;
        var yBegin = 1;
        var z = this.towerZPosition;
        var xEnd = this.towerXPosition - this.towerWidth / 2;
        var yEnd = this.height;
        var xWidthFromBeginToTower = Math.abs(xEnd - xBegin);
        var yHeightFromLevel0ToTopTower = yEnd - yBegin;
        var controlPoints = [[xBegin, yBegin, z], [xBegin + (signOrientation * (xWidthFromBeginToTower / 2)), yBegin, z], [xEnd, yBegin + yHeightFromLevel0ToTopTower / 2, z], [xEnd, yEnd, z]];
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
    Bridge.prototype.createTowersAndTensorsTrajectories = function (towers, towerIndex, totalTowers) {
        if (this.towerTh1 !== FARFROMANYPOINT) {
            this.towerZPosition = this.streetZPositionValue + Math.pow(-1, towerIndex) * (this.streetWidth / 2);
            var towerPosition = [this.towerXPosition, this.bottomRiverValue, this.towerZPosition];
            towers.push(new Tower(this.graphicContainer, towerPosition, this.towerTh1, this.height));
            this.towerWidth = towers[towers.length - 1].getWidth();
            if (this.isFirstOrLastTower(towerIndex, totalTowers)) {
                this.createExtremeTensorTrajectory(towerIndex);
            }
        }
    };
    Bridge.prototype.isFirstOrLastTower = function (towerIndex, totalTowers) {
        return ((towerIndex === 0) || (towerIndex === totalTowers - 2));
    };
    Bridge.prototype.createExtremeTensorTrajectory = function (towerIndex) {
        var signOrientation = 1;
        if (towerIndex === 0) {
            this.createTensorTrajectory(this.xRightSide, this.leftSideTensorTrajectory, signOrientation);
        } else {
            signOrientation *= -1;
            this.createTensorTrajectory(this.xLeftSide, this.rightSideTensorTrajectory, signOrientation);
        }
    };
    Bridge.prototype.initTowers = function () {
        var towers = [];
        var towerIndex;
        var totalTowers = 2 * this.towerAmount;
        for (towerIndex = 0; towerIndex < totalTowers; towerIndex += 1) {
            if (towerIndex % 2 === 0) {
                this.towerXPosition += (this.riverWidth / (this.towerAmount + 1));
                this.towerTh1 = this.findTowerStreetIntersection();
            }
            this.createTowersAndTensorsTrajectories(towers, towerIndex, totalTowers);
        }
        return towers;
    };
    Bridge.prototype.getTensorZShift = function (index) {
        if (index % 2 === 0) {
            return 0;
        }
        return (-this.streetWidth);
    };
    Bridge.prototype.isExtremeTower = function (index) {
        return ((index < 2) || (index >= this.towers.length - 2));
    };
    Bridge.prototype.drawExtremeTensor = function (index, modelViewMatrix) {
        if (this.isExtremeTower(index)) {
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
    Bridge.prototype.createMiddleTensorTrajectory = function (xBegin, xEnd) {
        var middleTensorTrajectory = [];
        var yBegin = this.height;
        var z = this.towerZPosition;
        var yEnd = this.height;
        var xWidth = Math.abs(xEnd - xBegin);
        var yHeight = yBegin - 1;
        var controlPoints = [[xBegin, yBegin, z], [xBegin, this.towerTh1 + 1 + (3 * yHeight / 4), z], [xBegin + (xWidth / 4), this.towerTh1 + 1, z], [xBegin + (xWidth / 2), this.towerTh1 + 1, z], [xBegin + (3 * xWidth / 4), this.towerTh1 + 1, z], [xEnd, this.towerTh1 + 1 + (3 * yHeight / 4), z], [xEnd, yEnd, z]];
        var bSpline = new Bspline(controlPoints, 5, [0, 0, 1]);
        var curvePoints = bSpline.getCurvePoints();
        curvePoints.forEach(function (element) {
            middleTensorTrajectory.push(element);
        }, this);
        return middleTensorTrajectory.slice(0);
    };
    Bridge.prototype.createMiddleTensors = function () {
        var middleTensors = [];
        this.towers.forEach(function (tower, index) {
            if ((index % 2 === 0) && (index !== 0)) {
                var neighborTower = this.towers[index - 2];
                var xBegin = neighborTower.getXPosition() - (neighborTower.getWidth() / 2);
                var xEnd = tower.getXPosition() - (neighborTower.getWidth() / 2);
                var middleTensorTrajectory = this.createMiddleTensorTrajectory(xBegin, xEnd);
                middleTensors.push(new BridgeTensor(this.graphicContainer, middleTensorTrajectory));
            }
        }, this);
        return middleTensors.slice(0);
    };
    Bridge.prototype.drawTowersAndExtremeTensors = function (modelViewMatrix) {
        this.towers.forEach(function (tower, index) {
            tower.draw(modelViewMatrix);
            var towerPosition = tower.getXPosition();
            this.drawExtremeTensor(index, modelViewMatrix, towerPosition);
        }, this);
    };
    Bridge.prototype.drawMiddleTensors = function (modelViewMatrix) {
        this.middleTensors.forEach(function (middleTensor) {
            middleTensor.draw(modelViewMatrix);
            var mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            var zShift = this.streetWidth;
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, 0, zShift));
            middleTensor.draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, mvStack.pop());
        }, this);
    };
    Bridge.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.drawTowersAndExtremeTensors(modelViewMatrix);
        this.drawMiddleTensors(modelViewMatrix);
    };
}());