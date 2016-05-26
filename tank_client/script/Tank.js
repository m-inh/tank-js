/**
 * Created by TooNies1810 on 5/24/16.
 */

class Tank{


    constructor(x, y, speed, type, uid){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.type = type;
        this.uid = uid;
        this.image = new Image();
        this.currOrient = 1;
        this.enemy_revenge = "";

        this.isAlive = true;

        this.image_up = new Image();
        this.image_down = new Image();
        this.image_left = new Image();
        this.image_right = new Image();

        if (this.type == 1){
            // player
            this.image_up.src = "RESOURCE/Image/bossyellow_1.png";
            this.image_down.src = "RESOURCE/Image/bossyellow_2.png";
            this.image_left.src = "RESOURCE/Image/bossyellow_3.png";
            this.image_right.src = "RESOURCE/Image/bossyellow_4.png";
        } else {
            //enemy
            this.image_up.src = "RESOURCE/Image/player_green_1.png";
            this.image_down.src = "RESOURCE/Image/player_green_2.png";
            this.image_left.src = "RESOURCE/Image/player_green_3.png";
            this.image_right.src = "RESOURCE/Image/player_green_4.png";
        }
    }

    move(orient){
        this.currOrient = orient;
        switch (orient){
            case 1: //up
                this.y += -this.speed;
                break;
            case 2: // down
                this.y += this.speed;
                break;
            case 3: // left
                this.x += -this.speed;
                break;
            case 4: // right
                this.x += this.speed;
                break;
        }
    }

    draw(context){
        if (this.isAlive){
            switch (this.currOrient){
                case 1: //up
                    this.image = this.image_up;
                    break;
                case 2: // down
                    this.image = this.image_down;
                    break;
                case 3: // left
                    this.image = this.image_left;
                    break;
                case 4: // right
                    this.image = this.image_right;
                    break;
            }

            context.drawImage(this.image, this.x, this.y);
            context.font="15px Georgia";
            context.fillStyle = "#ffffff";
            context.fillText(this.uid,this.x-10,this.y-10);
        }
    }
    
    shoot(){
        return new Bullet(this.x+tankSize/2-bulletSize/2, this.y+tankSize/2-bulletSize/2, this.currOrient, bulletSpeed, this.type, bulletSize, this.uid);
    }

    // isDestroy(bulletMgr){
    //     for (var i=0; i<bulletMgr.size(); i++){
    //         var bullet = bulletMgr.getBullet(i);
    //         if (bullet.type == enemyType && this.isInside(bullet.x, bullet.y, bullet.size)){
    //             this.enemy_revenge = bullet.uid;
    //             this.isAlive = false;
    //             return true;
    //         }
    //     }
    //     return false;
    // }

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
        if (objX > this.x && objX < (this.x+tankSize) && objY > this.y && objY < (this.y+tankSize)){
            return true;
        }

        return false;
    }
}