/**
 * Created by TooNies1810 on 5/24/16.
 */


class BrickManager{

    constructor(){
        this.brickArr = new Array();
    }

    addBrick(brick){
        this.brickArr.push(brick);
    }

    drawAll(context){
        for (var i = 0; i < this.brickArr.length; i++){
            this.brickArr[i].draw(context);
        }
    }

    isMoveTable(x, y, size){
        for (var i = 0; i < this.brickArr.length; i++){
            if (this.brickArr[i].isInside(x,y,size) == true){

                // console.log("tank x: " + x);
                // console.log("tank y: " + y);
                // console.log("tank size: " + size);
                // console.log("brick x: " + this.brickArr[i].x);
                // console.log("brick y: " + this.brickArr[i].y);
                return false;
            }
        }

        return true;
    }
}