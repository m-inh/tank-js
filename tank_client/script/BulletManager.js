/**
 * Created by TooNies1810 on 5/26/16.
 */
class BulletManager{
    constructor(){
        this.bulletArr = new Array();
    }

    addNewBullet(newBullet){
        this.bulletArr.push(newBullet);
    }

    moveAll(){
        for (var i=0; i<this.bulletArr.length; i++){
            this.bulletArr[i].move();
        }
    }

    drawAll(context){
        for (var i=0; i<this.bulletArr.length; i++){
            this.bulletArr[i].draw(context);
        }
    }
}