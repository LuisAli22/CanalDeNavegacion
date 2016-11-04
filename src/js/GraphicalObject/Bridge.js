/*global controlValues, Tower, ModelViewMatrixStack, mat4, FARFROMANYPOINT, TextureHandler*/
var Bridge;
(function () {
    "use strict";
    Bridge = function (graphicContainer, bottomRiverYValue, riverWidth, street) {
        this.graphicContainer = graphicContainer;
        this.bottomRiverValue = bottomRiverYValue;
        this.riverWidth = riverWidth;
        this.streetZPositionValue = (controlValues.bridgePosition / 100) * 360;
        this.towerAmount = controlValues.towerAmount;
        this.towerXPosition = 180 - (this.riverWidth / 2);
        this.streetWidth = street.getWidth();
        this.streetTrajectory = street.getTrajectory();
        this.towerTh1 = 0;
        this.textureHandler = TextureHandler.getInstance(graphicContainer);
        this.texture = this.textureHandler.initializeTexture("img/bridge.jpg");
        this.towers = this.initTowers();
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
                towers.push(new Tower(this.graphicContainer, towerPosition, this.towerTh1));
            }
        }
        return towers;
    };
    Bridge.prototype.draw = function (modelViewMatrix) {
        this.textureHandler.setTextureUniform(this.texture);
        var mvStack = ModelViewMatrixStack.getInstance();
        mvStack.push(modelViewMatrix);
        this.towers.forEach(function (tower) {
            tower.draw(modelViewMatrix);
        }, this);
        mat4.copy(modelViewMatrix, mvStack.pop());
    };
}());
