/*global controlValues, Tower, ModelViewMatrixStack, mat4, FARFROMANYPOINT, TOWERWIDTH, TextureHandler, Bspline, BridgeTensor, vec3, vec2, riverMap*/
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
        this.height = (controlValues.ph1 + controlValues.ph2 + controlValues.ph3);
        this.towerXPosition = street.getStreetXCenter() - (this.riverWidth / 2);
        this.streetWidth = street.getWidth();
        this.streetTrajectory = street.getTrajectory();
        this.streetBorderHeight = street.getBorderHeight();
        this.towerTh1 = 0;
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture("img/oxido.jpg");
        this.tensorTexture = this.textureHandler.initializeTexture("img/alambres.jpg");
        this.leftSideTensorTrajectory = [];
        this.rightSideTensorTrajectory = [];
        this.secondaryTensors = [];
        this.middleSecondaryTensors = [];
        this.towers = this.initTowers();
        this.middleTensors = this.createMiddleTensors();
        this.tensor1 = new BridgeTensor(graphicContainer, this.leftSideTensorTrajectory, 0.125);
        this.tensor2 = new BridgeTensor(graphicContainer, this.rightSideTensorTrajectory, 0.125);
    };
    Bridge.prototype.createCurve = function (trajectory, controlPoints) {
        var bSpline = new Bspline(controlPoints, 5, [0, 0, 1], true);
        var curvePoints = bSpline.getCurvePoints();
        curvePoints.forEach(function (element) {
            trajectory.push(element);
        }, this);
    };
    Bridge.prototype.createTensorTrajectory = function (tensorXbegin, tensorTrajectory, signOrientation) {
        var xBegin = tensorXbegin;
        var yBegin = this.findSecondaryTensorIntersection(this.streetTrajectory, tensorXbegin) + this.streetBorderHeight + 0.5;
        var z = this.towerZPosition;
        var xEnd = this.towerXPosition - (TOWERWIDTH / 2);
        var yEnd = this.height + this.bottomRiverValue;
        var xWidthFromBeginToTower = Math.abs(xEnd - xBegin);
        var yHeightFromLevel0ToTopTower = yEnd - yBegin;
        var controlPoints = [[xBegin, yBegin, z], [xBegin + (signOrientation * (xWidthFromBeginToTower / 2)), yBegin, z], [xEnd, yBegin + yHeightFromLevel0ToTopTower / 2, z], [xEnd, yEnd, z]];
        controlPoints.push([xEnd, yEnd, z]);
        this.createCurve(tensorTrajectory, controlPoints);
    };
    Bridge.prototype.interpolation = function (x1, y1, x2, y2, secondaryXPosition) {
        return ((y2 * (secondaryXPosition - x1)) - (y1 * (-x2 + secondaryXPosition))) / (x2 - x1);
    };
    Bridge.prototype.xPositionReached = function (isIncreasing, trajectoryXPosition, xPosition, index) {
        return ((((!isIncreasing) && (trajectoryXPosition < xPosition)) || ((isIncreasing) && (trajectoryXPosition > xPosition))) && (index > 0));
    };
    Bridge.prototype.findSecondaryTensorIntersection = function (objectTrajectory, secondaryXPosition) {
        var trajectoryIndex;
        var x1;
        var y1;
        var x2;
        var y2;
        var isIncreasing = (objectTrajectory[1].position[0] >= objectTrajectory[0].position[0]);
        for (trajectoryIndex = 0; trajectoryIndex < objectTrajectory.length; trajectoryIndex += 1) {
            if (objectTrajectory[trajectoryIndex].position[0] === secondaryXPosition) {
                return objectTrajectory[trajectoryIndex].position[1];
            }
            if (this.xPositionReached(isIncreasing, objectTrajectory[trajectoryIndex].position[0], secondaryXPosition, trajectoryIndex)) {
                x1 = objectTrajectory[trajectoryIndex - 1].position[0];
                y1 = objectTrajectory[trajectoryIndex - 1].position[1];
                x2 = objectTrajectory[trajectoryIndex].position[0];
                y2 = objectTrajectory[trajectoryIndex].position[1];
                return this.interpolation(x1, y1, x2, y2, secondaryXPosition);
            }
        }
        return FARFROMANYPOINT;
    };
    Bridge.prototype.createSecondaryTensorTrajectory = function (mainTensorTrajectory, secondaryXPosition) {
        var tensorTrajectory = [];
        var y = this.findSecondaryTensorIntersection(this.streetTrajectory, secondaryXPosition);
        var yEnd = this.findSecondaryTensorIntersection(mainTensorTrajectory, secondaryXPosition);
        if ((yEnd !== FARFROMANYPOINT) && (y !== FARFROMANYPOINT)) {
            y += this.streetBorderHeight;
            var controlPointsAmount = 5;
            var yStep = (yEnd - y) / controlPointsAmount;
            var controlPointIndex;
            var controlPoints = [];
            for (controlPointIndex = 0; controlPointIndex <= controlPointsAmount; controlPointIndex += 1) {
                controlPoints.push([secondaryXPosition, y + (controlPointIndex * yStep), this.towerZPosition]);
            }
            this.createCurve(tensorTrajectory, controlPoints);
        }
        return tensorTrajectory.slice(0);
    };
    Bridge.prototype.createSecondaryTensors = function (mainTensorTrajectory, secondaryTensors, isLastExtremeTensor) {
        var beginPosition = mainTensorTrajectory[0].position;
        var endPosition = mainTensorTrajectory[mainTensorTrajectory.length - 1].position;
        var xMiddleTensorBegin = beginPosition[0];
        var xMiddleTensorEnd = endPosition[0];
        var middleTensorWidth = Math.abs(xMiddleTensorEnd - xMiddleTensorBegin);
        var secondaryTensorAmount = (3 * middleTensorWidth / controlValues.s1);
        var secondaryTensorIndex;
        var secondaryTensorTrajectory = [];
        var secondaryTensorXPosition;
        for (secondaryTensorIndex = 0; secondaryTensorIndex < secondaryTensorAmount; secondaryTensorIndex += 1) {
            if (isLastExtremeTensor) {
                secondaryTensorXPosition = xMiddleTensorBegin - (secondaryTensorIndex * controlValues.s1 / 3);
            } else {
                secondaryTensorXPosition = xMiddleTensorBegin + (secondaryTensorIndex * controlValues.s1 / 3);
            }
            secondaryTensorTrajectory = this.createSecondaryTensorTrajectory(mainTensorTrajectory, secondaryTensorXPosition);
            secondaryTensors.push(new BridgeTensor(this.graphicContainer, secondaryTensorTrajectory, 0.015625));
        }
    };
    Bridge.prototype.findTowerStreetIntersection = function () {
        var indexStreet;
        var currentPosition;
        for (indexStreet = 0; indexStreet < this.streetTrajectory.length; indexStreet += 1) {
            currentPosition = this.streetTrajectory[indexStreet].position;
            if (Math.abs(currentPosition[0] - this.towerXPosition) < 1) {
                return currentPosition[1] + Math.abs(this.bottomRiverValue);
            }
        }
        return FARFROMANYPOINT;
    };
    Bridge.prototype.createTowersAndTensorsTrajectories = function (towers, towerIndex, totalTowers) {
        if (this.towerTh1 !== FARFROMANYPOINT) {
            this.towerZPosition = this.streetZPositionValue + Math.pow(-1, towerIndex) * (this.streetWidth / 2);
            var towerPosition = [this.towerXPosition, this.bottomRiverValue, this.towerZPosition];
            towers.push(new Tower(this.graphicContainer, towerPosition, this.towerTh1, this.height));
            if (this.isFirstOrLastTower(towerIndex, totalTowers)) {
                this.createExtremeTensorTrajectory(towerIndex);
            }
        }
    };
    Bridge.prototype.isFirstOrLastTower = function (towerIndex, totalTowers) {
        return ((towerIndex === 0) || (towerIndex === totalTowers - 2));
    };
    Bridge.prototype.createTrajectoryAndSecondaryTensors = function (xBeginSide, trajectory, signOrientation, isLastExtremeTensor) {
        this.createTensorTrajectory(xBeginSide, trajectory, signOrientation);
        this.createSecondaryTensors(trajectory, this.secondaryTensors, isLastExtremeTensor);
    };
    Bridge.prototype.createExtremeTensorTrajectory = function (towerIndex) {
        var signOrientation = 1;
        if (towerIndex === 0) {
            this.createTrajectoryAndSecondaryTensors(this.xRightSide, this.leftSideTensorTrajectory, signOrientation, false);
        } else {
            signOrientation *= -1;
            this.createTrajectoryAndSecondaryTensors(this.xLeftSide, this.rightSideTensorTrajectory, signOrientation, true);
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
        var yBegin = this.height + this.bottomRiverValue;
        var z = this.towerZPosition;
        var yEnd = yBegin;
        var yBottom = this.towerTh1 + this.bottomRiverValue + 1;
        var xWidth = Math.abs(xEnd - xBegin);
        var yHeight = yBegin - 1;
        var controlPoints = [[xBegin, yBegin, z], [xBegin, yBottom + (3 * yHeight / 4), z], [xBegin + (xWidth / 4), yBottom, z], [xBegin + (xWidth / 2), yBottom, z], [xBegin + (3 * xWidth / 4), yBottom, z], [xEnd, yBottom + (3 * yHeight / 4), z], [xEnd, yEnd, z]];
        this.createCurve(middleTensorTrajectory, controlPoints);
        return middleTensorTrajectory.slice(0);
    };
    Bridge.prototype.createMiddleTensors = function () {
        var middleTensors = [];
        this.towers.forEach(function (tower, index) {
            if ((index % 2 === 0) && (index !== 0)) {
                var neighborTower = this.towers[index - 2];
                var xBegin = neighborTower.getXPosition() - (TOWERWIDTH / 2);
                var xEnd = tower.getXPosition() - (TOWERWIDTH / 2);
                var middleTensorTrajectory = this.createMiddleTensorTrajectory(xBegin, xEnd);
                this.createSecondaryTensors(middleTensorTrajectory, this.middleSecondaryTensors, false);
                middleTensors.push(new BridgeTensor(this.graphicContainer, middleTensorTrajectory, 0.125));
            }
        }, this);
        return middleTensors.slice(0);
    };
    Bridge.prototype.drawTowersAndExtremeTensors = function (modelViewMatrix) {
        this.towers.forEach(function (tower, index) {
            tower.draw(modelViewMatrix);
            this.drawExtremeTensor(index, modelViewMatrix);
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
    Bridge.prototype.drawSecondaryTensors = function (modelViewMatrix, secondaryTensors, zShift) {
        secondaryTensors.forEach(function (secondaryTensor) {
            secondaryTensor.draw(modelViewMatrix);
            var mvStack = ModelViewMatrixStack.getInstance();
            mvStack.push(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(0, 0, zShift));
            secondaryTensor.draw(modelViewMatrix);
            mat4.copy(modelViewMatrix, mvStack.pop());
        }, this);
    };
    Bridge.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        this.drawTowersAndExtremeTensors(modelViewMatrix);
        this.drawMiddleTensors(modelViewMatrix);
        this.drawSecondaryTensors(modelViewMatrix, this.secondaryTensors, -this.streetWidth);
        this.drawSecondaryTensors(modelViewMatrix, this.middleSecondaryTensors, this.streetWidth);
    };
}());