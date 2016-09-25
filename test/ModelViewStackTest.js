/*jslint browser: true*/
/*global ModelViewMatrixStack, mat4, TestCase, assertEquals, assertTrue*/
(function () {
    "use strict";
    var ModelViewStackTest = new TestCase("ModelViewStackTest");
    ModelViewStackTest.prototype.setUp = function () {
        this.mvStack = new ModelViewMatrixStack();
        this.idMatrix = mat4.create();
        this.mvStack.push(this.idMatrix);
        this.emptyStack = new ModelViewMatrixStack();
    };
    ModelViewStackTest.prototype.testInsertIdentityMatrix = function () {
        var mvMatrix = mat4.str(this.mvStack.pop());
        var expectedMatrix = mat4.str(this.idMatrix);
        assertEquals(mvMatrix, expectedMatrix);
    };
    ModelViewStackTest.prototype.testEmptyStack = function () {
        assertTrue(this.emptyStack.length() === 0);
    };
}());