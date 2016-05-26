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

var count = 0;
var isShootable = true;
var isStart = false;

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
    map = new TankMap(1000, 700, 20);
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

    bulletMgr.moveAll();
}

function draw(context) {
    // xoa nen
    context.fillStyle = '#000000';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // draw obj
    map.draw(context);
    bulletMgr.drawAll(context);
    tank.draw(context);
    playerTankMgr.drawAll(context);
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
                bulletMgr.addNewBullet(newBullet);
                isShootable = false;


                emitShoot(newBullet.x, newBullet.y, newBullet.orient, tank.uid);
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


///////////////////////////// socket io
var socket = io();

socket.on('user', function (response) {
    for (var i = 0; i < response.length - 1; i++) {
        var id = response[i]["uid"];
        var x = response[i]["x"];
        var y = response[i]["y"];
        var orient = response[i]["orient"];

        var newEnemy = new Tank(x, y, speed, enemyType, id);
        newEnemy.currOrient = orient;
        addNewEnemyTank(newEnemy);
    }

    var uid = response[response.length - 1]["uid"];
    var ux = response[response.length - 1]["x"];
    var uy = response[response.length - 1]["y"];

    gameStart(uid, ux, uy);
    isStart = true;
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
    // var uid = response["uid"];
    var x = response["x"];
    var y = response["y"];
    var orient = response["orient"];
    var newBullet = new Bullet(x,y,orient,bulletSpeed,2);
    bulletMgr.addNewBullet(newBullet);
});

function emitMove(x, y, orient, uid) {
    var move = {
        "uid": uid,
        "x": x,
        "y": y,
        "orient": orient
    };
    socket.emit('move', move);
}

function emitShoot(xBullet, yBullet, orientBullet, uid) {
    var shoot = {
        "uid": uid,
        "x": xBullet,
        "y": yBullet,
        "orient": orientBullet
    };
    socket.emit('shoot', shoot);
}