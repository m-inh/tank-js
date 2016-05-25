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

        if (this.type == 1){
            this.image.src = "RESOURCE/Image/bossyellow_1.png";
        } else {
            this.image.src = "RESOURCE/Image/player_green_1.png";
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
        switch (this.currOrient){
            case 1: //up
                if (this.type == 1){
                    this.image.src = "RESOURCE/Image/bossyellow_1.png";
                } else {
                    this.image.src = "RESOURCE/Image/player_green_1.png";
                }
                break;
            case 2: // down
                if (this.type == 1){
                    this.image.src = "RESOURCE/Image/bossyellow_2.png";
                } else {
                    this.image.src = "RESOURCE/Image/player_green_2.png";
                }
                break;
            case 3: // left
                if (this.type == 1){
                    this.image.src = "RESOURCE/Image/bossyellow_3.png";
                } else {
                    this.image.src = "RESOURCE/Image/player_green_3.png";
                }
                break;
            case 4: // right
                if (this.type == 1){
                    this.image.src = "RESOURCE/Image/bossyellow_4.png";
                } else {
                    this.image.src = "RESOURCE/Image/player_green_4.png";
                }
                break;
        }
        
        context.drawImage(this.image, this.x, this.y);
    }
}