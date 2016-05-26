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

    moveAll(map, tank){
        var tempBulletArr = new Array();
        for (var i=0; i<this.bulletArr.length; i++){
            var bullet = this.bulletArr[i];
            var isDestroyBullet = false;

            // console.log("moveAll bullet: " + bullet);
            // console.log("moveAll: " + bullet.uid);
            
            if (bullet.type == enemyType && tank.isInside(bullet.x, bullet.y, bulletSize)){
                isDestroyBullet = true;

                isMovetable = false;
                tank.isAlive = false;
                tank.enemy_revenge = bullet.uid;

                emitDie(tank.uid, bullet.uid);
            } else if (map.isMoveTable(bullet.x, bullet.y, bulletSize) == false){
                isDestroyBullet = true;
            }

            if (isDestroyBullet == false){
                this.bulletArr[i].move();
                tempBulletArr.push(bullet);
            }

        }
        this.bulletArr = tempBulletArr;
    }

    removeBullet(uid){
        var tempBulletArr = new Array();
        for (var i=0; i<this.bulletArr.length; i++){
            var bullet = this.bulletArr[i];
            if (bullet.uid != uid){
                tempBulletArr.push(bullet);
            }
        }
        this.bulletArr = tempBulletArr;
    }

    drawAll(context){
        for (var i=0; i<this.bulletArr.length; i++){
            this.bulletArr[i].draw(context);
        }
    }
    
    getBullet(index){
        return this.bulletArr[index];    
    }
    
    size(){
        return this.bulletArr.length;
    }
}