/*global MoveLeft, MoveRight, MoveForward, MoveBackward, ToogleCamera*/
var KeyboardController;
(function () {
    "use strict";
    KeyboardController = function (scene) {
        this.commands = {
            65: new MoveLeft(scene),
            67: new ToogleCamera(scene),
            68: new MoveRight(scene),
            83: new MoveBackward(scene),
            87: new MoveForward(scene)
        };
        document.onkeydown = this.onKeyDown.bind(this);
    };
    KeyboardController.prototype.disableDefaultActionArrowAndSpace = function (event) {
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
    };
    KeyboardController.prototype.onKeyDown = function (event) {
        this.disableDefaultActionArrowAndSpace(event);
        var key = event.keyCode.toString();
        if (this.commands.hasOwnProperty(key)) {
            this.commands[key].execute(event);
        }
    };
}());