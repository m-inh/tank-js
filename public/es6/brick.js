'use strict';

class Brick {
    // var image;
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.image = img_brick;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }

    isInside(objX, objY, objSize) {

        var xLeft = objX;
        var xRight = objX + objSize;
        var yTop = objY;
        var yBottom = objY + objSize;

        if (this.isPointInside(xLeft, yTop, this.x, this.y, this.size)) {
            return true;
        }
        if (this.isPointInside(xRight, yTop, this.x, this.y, this.size)) {
            return true;
        }
        if (this.isPointInside(xLeft, yBottom, this.x, this.y, this.size)) {
            return true;
        }
        if (this.isPointInside(xRight, yBottom, this.x, this.y, this.size)) {
            return true;
        }

        ////// is inside tank
        var brickXLeft = this.x;
        var brickXRight = this.x + this.size;
        var brickYTop = this.y;
        var brickYBottom = this.y + this.size;
        if (this.isPointInside(brickXLeft, brickYTop, objX, objY, objSize)) {
            return true;
        }
        if (this.isPointInside(brickXRight, brickYTop, objX, objY, objSize)) {
            return true;
        }
        if (this.isPointInside(brickXLeft, brickYBottom, objX, objY, objSize)) {
            return true;
        }
        if (this.isPointInside(brickXRight, brickYBottom, objX, objY, objSize)) {
            return true;
        }

        return false;
    }

    isPointInside(objX, objY, obj2X, obj2Y, obj2Size) {
        if (objX > obj2X && objX < (obj2X + obj2Size) && objY > obj2Y && objY < (obj2Y + obj2Size)) {
            return true;
        }

        return false;
    }
}