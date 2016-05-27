/**
 * Created by TooNies1810 on 5/24/16.
 */

var context;
var tank; // player's tank
var map;
var speed = 3;
// var tankSpeed = 1;
var orient = 0;
var tankSize = 33;
var playerTankMgr = new TankManager();

var playerType = 1;
var enemyType = 2;

// bullet
var bulletMgr = new BulletManager();
var bulletSpeed = 4;
var bulletSize = 8;
var bulletID = 0;

// animation
var animMgr = new AnimationManager();
var animTime = 2;

var count = 0;
var countAnim = 0;
var isShootable = true;
var isStart = false;
var isMovetable = false;

window.onload = function () {
    var canvas = document.createElement('canvas');
    context = canvas.getContext("2d");
    context.fillStyle = '#000000';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    setInterval(gameLoop, 17);
};

function gameStart(uid, x, y) {
    map = new TankMap(900, 700, 20);
    tank = new Tank(x, y, speed, playerType, uid);
}

function gameLoop() {
    // timer
    if (!isShootable) {
        count++;
    }
    if (count >= 30) {
        isShootable = true;
        count = 0;
    }

    if (isStart) {
        update();
        draw(context);
    }
}

function update() {
    // check if tank is destroy
    // if (tank.isDestroy(bulletMgr)) {
    //     isMovetable = false;
    //    
    //     console.log("die die ");
    //     // send to sv
    //     emitDie(tank.uid, tank.enemy_revenge);
    // }


    if (isMovetable){
        switch (orient) {
            case 1:
                if (map.isMoveTable(tank.x, tank.y - speed, tankSize) == true) {
                    tank.move(orient);
                }
                break;
            case 2:
                if (map.isMoveTable(tank.x, tank.y + speed, tankSize) == true) {
                    tank.move(orient);
                }
                break;
            case 3:
                if (map.isMoveTable(tank.x - speed, tank.y, tankSize) == true) {
                    tank.move(orient);
                }
                break;
            case 4:
                if (map.isMoveTable(tank.x + speed, tank.y, tankSize) == true) {
                    tank.move(orient);
                }
                break;
        }

        if (orient != 0) {
            emitMove(tank.x, tank.y, tank.currOrient, tank.uid);
        }
    }

    bulletMgr.moveAll(map, tank);
}

function draw(context) {
    // xoa nen
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 1440, 900);

    // draw obj
    map.draw(context);
    bulletMgr.drawAll(context);
    tank.draw(context);
    playerTankMgr.drawAll(context);

    // run anim
    countAnim++;
    if (countAnim > animTime) {

        // chay anim
        animMgr.runAllAnim(context);
        countAnim = 0;
    }
}

window.onkeydown = function (e) {
    switch (e.keyCode) {
        case 65: // a
            // console.log("a");
            orient = 3;
            break;
        case 68: // d
            // console.log("d");
            orient = 4;
            break;
        case 83: //s
            // console.log("s");
            orient = 2;
            break;
        case 87: // w
            // console.log("w");
            orient = 1;
            break;
        case 32: // space
            if (isShootable) {
                var newBullet = tank.shoot();

                console.log("create new bullet: " + newBullet.id);
                bulletMgr.addNewBullet(newBullet);
                isShootable = false;


                emitShoot(newBullet.x, newBullet.y, newBullet.orient, tank.uid, newBullet.id);
            }
            break;
    }
};

window.onkeyup = function (e) {
    orient = 0;
};


//////////////
function addNewEnemyTank(enemyTank) {
    playerTankMgr.addNewTank(enemyTank);
}

function removeEnemyTank(uid) {
    playerTankMgr.removeTank(uid);
}

function updateEnemyTank(x, y, orient, uid) {
    playerTankMgr.updateTank(x, y, orient, uid);
}

function explore(x, y, type) {
    // add ner animation
    // 1: tank
    // 2: bullet

    var anim = new Animation(x, y, type);
    animMgr.addNewAnim(anim);
}

///////////////////////////// socket io
var socket = io();

socket.on('user', function (response) {
    // init tanks
    var tankArr = response["tank"];
    for (var i = 0; i < tankArr.length - 1; i++) {
        var id = tankArr[i]["uid"];
        var x = tankArr[i]["x"];
        var y = tankArr[i]["y"];
        var orient = tankArr[i]["orient"];

        var newEnemy = new Tank(x, y, speed, enemyType, id);
        newEnemy.currOrient = orient;
        addNewEnemyTank(newEnemy);
    }

    var uid = tankArr[tankArr.length - 1]["uid"];
    var ux = tankArr[tankArr.length - 1]["x"];
    var uy = tankArr[tankArr.length - 1]["y"];

    // init bullet
    var bullets = response["bullet"];
    for (var i=0; i<bullets.length; i++){
        var bullet = bullets[i];
        var uidBullet = bullet["uid"];
        var xBullet = bullet["x"];
        var yBullet = bullet["y"];
        var orientBullet = bullet["orient"];
        var newBullet = new Bullet(xBullet, yBullet, orientBullet, bulletSpeed, 2, uidBullet);
        bulletMgr.addNewBullet(newBullet);
    }

    gameStart(uid, ux, uy);
    isStart = true;
    isMovetable = true;
});

socket.on('new_enemy', function (response) {
    var id = response["uid"];
    var x = response["x"];
    var y = response["y"];
    var orient = response["orient"];

    var newEnemy = new Tank(x, y, speed, enemyType, id);
    newEnemy.currOrient = orient;
    addNewEnemyTank(newEnemy);
});

socket.on('user_disconnect', function (uid) {
    // console.log(uid);
    removeEnemyTank(uid);
});

socket.on('player_move', function (response) {
    var id = response["uid"];
    var x = response["x"];
    var y = response["y"];
    var orient = response["orient"];

    updateEnemyTank(x, y, orient, id);
});

socket.on('new_bullet', function (response) {
    var uid = response["uid"];
    var id = response["id_bullet"];
    var x = response["x"];
    var y = response["y"];
    var orient = response["orient"];

    console.log("new bullet receive: " + id);

    var newBullet = new Bullet(x, y, orient, bulletSpeed, 2, bulletSize, uid);
    // newBullet.id = id;
    newBullet.setID(id);
    bulletMgr.addNewBullet(newBullet);
});

socket.on('user_die_update', function (response) {
    var uidEnemy = response["uid_enemy"];
    var idBullet = response["id_bullet"];

    console.log("idBullet: " + idBullet);
    // bonus point to enemy_user
    bulletMgr.removeBullet(uidEnemy, idBullet);
});

socket.on('new_life', function (response) {
    var id = response["uid"];
    var x = response["x"];
    var y = response["y"];
    var orient = response["orient"];
    tank = new Tank(x,y,speed,playerType,id);
    isMovetable = true;
});

//////////////////////// emit

function emitMove(x, y, orient, uid) {
    var move = {
        "uid": uid,
        "x": x,
        "y": y,
        "orient": orient
    };
    socket.emit('move', move);
}

function emitShoot(xBullet, yBullet, orientBullet, uid, id) {
    var shoot = {
        "uid": uid,
        "id_bullet": id,
        "x": xBullet,
        "y": yBullet,
        "orient": orientBullet
    };
    socket.emit('shoot', shoot);
}

function emitDie(uid, uidEnemy, idBullet) {
    // console.log("idbullet send: " + idBullet);
    var die = {
        "uid": uid,
        "uid_enemy": uidEnemy,
        "id_bullet": idBullet
    };
    socket.emit('user_die', die);
}