/**
 * Created by TooNies1810 on 5/26/16.
 */
class Bullet {
    constructor(x, y, orient, speed, type, size, uid) {
        this.x = x;
        this.y = y;
        this.orient = orient;
        this.speed = speed;
        this.type = type;
        this.size = size;
        this.uid = uid;

        this.image = new Image();
        this.image.src = "RESOURCE/Image/bullet.png";
    }

    move() {
        switch (this.orient) {
            case 1:
                this.y -= this.speed;
                break;
            case 2:
                this.y += this.speed;
                break;
            case 3:
                this.x -= this.speed;
                break;
            case 4:
                this.x += this.speed;
                break;
        }
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}