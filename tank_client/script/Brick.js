/**
 * Created by TooNies1810 on 5/24/16.
 */
class Brick{
    // var image;
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;

        this.image = new Image();
        this.image.src = "RESOURCE/Image/water.png";
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y);
    }

    isInside(objX, objY, objSize){

        var xLeft = objX;
        var xRight = objX + objSize;
        var yTop = objY;
        var yBottom = objY + objSize;

        if (this.isPointInside(xLeft, yTop)  ){
            return true;
        }
        if (this.isPointInside(xRight, yTop)){
            return true;
        }
        if (this.isPointInside(xLeft, yBottom)){
            return true;
        }
        if (this.isPointInside(xRight, yBottom)){
            return true;
        }

        return false;
    }

    isPointInside(objX, objY){
        if (objX > this.x && objX < (this.x+this.size) && objY > this.y && objY < (this.y+this.size)){
            return true;
        }

        return false;
    }
}