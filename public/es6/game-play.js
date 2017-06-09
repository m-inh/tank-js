'use strict';

const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;

let context;
let tank; // player's tank
let namePlayer;
let map;
let speed = 3;
let orient = 0;
let tankSize = 33;
let playerTankMgr = new TankManager();
let player_revenge = "";

let playerType = 1;
let enemyType = 2;

// bullet
let bulletMgr = new BulletManager();
let bulletSpeed = 4;
let bulletSize = 8;
let bulletID = 0;

// animation
let animMgr = new AnimationManager();
let animTime = 3;

let count = 0;
let countAnim = 0;
let isShootable = true;
let isStart = false;
let isMovetable = false;

function gameStart(uid, x, y, name) {

    let audio_start = audio_start_game;
    audio_start.play();

    map = new TankMap(MAP_WIDTH, MAP_HEIGHT, 20);
    tank = new Tank(x, y, speed, playerType, uid);
    tank.name = name;
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
    // update tank revenge
    playerTankMgr.updateTankRevenge(player_revenge);

    if (isMovetable) {
        switch (orient) {
            case 1:
                if (map.isMoveTable(tank.x, tank.y - speed, tankSize) === true) {
                    tank.move(orient);
                }
                break;
            case 2:
                if (map.isMoveTable(tank.x, tank.y + speed, tankSize) === true) {
                    tank.move(orient);
                }
                break;
            case 3:
                if (map.isMoveTable(tank.x - speed, tank.y, tankSize) === true) {
                    tank.move(orient);
                }
                break;
            case 4:
                if (map.isMoveTable(tank.x + speed, tank.y, tankSize) === true) {
                    tank.move(orient);
                }
                break;
        }

        if (orient !== 0) {
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
        case 37: // left
            // console.log("a");
            orient = 3;
            break;
        case 39: // right
            // console.log("d");
            orient = 4;
            break;
        case 40: // down
            // console.log("s");
            orient = 2;
            break;
        case 38: // up
            // console.log("w");
            orient = 1;
            break;
        case 32: // space
            if (isShootable) {
                let newBullet = tank.shoot();

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

    let anim = new Animation(x, y, type);
    animMgr.addNewAnim(anim);

    // playing sound
    let audio;
    if (type === 1) {
        audio = audio_tank_explore;
    } else if (type === 2) {
        audio = audio_bullet_explore;
    }
    audio.play();
}

///////////////////////////// socket io
let socket = io();

socket.on('user', function (response) {
    // init tanks
    let tankArr = response["tank"];
    for (let i = 0; i < tankArr.length - 1; i++) {
        let id = tankArr[i]["uid"];
        let name = tankArr[i]["name"];
        let x = tankArr[i]["x"];
        let y = tankArr[i]["y"];
        let orient = tankArr[i]["orient"];

        let newEnemy = new Tank(x, y, speed, enemyType, id);
        newEnemy.currOrient = orient;
        newEnemy.name = name;
        addNewEnemyTank(newEnemy);
    }

    let uid = tankArr[tankArr.length - 1]["uid"];
    let nameTank = tankArr[tankArr.length - 1]["name"];
    let ux = tankArr[tankArr.length - 1]["x"];
    let uy = tankArr[tankArr.length - 1]["y"];

    namePlayer = nameTank;
    // console.log(nameTank);
    // init bullet
    let bullets = response["bullet"];
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        let uidBullet = bullet["uid"];
        let xBullet = bullet["x"];
        let yBullet = bullet["y"];
        let orientBullet = bullet["orient"];
        let newBullet = new Bullet(xBullet, yBullet, orientBullet, bulletSpeed, 2, uidBullet);
        bulletMgr.addNewBullet(newBullet);
    }

    gameStart(uid, ux, uy, nameTank);
    isStart = true;
    isMovetable = true;
});

socket.on('new_enemy', function (response) {
    let id = response["uid"];
    let name = response["name"];
    let x = response["x"];
    let y = response["y"];
    let orient = response["orient"];

    let newEnemy = new Tank(x, y, speed, enemyType, id);
    newEnemy.currOrient = orient;
    newEnemy.name = name;
    addNewEnemyTank(newEnemy);

    let newPlayerSound = new_player;
    newPlayerSound.play();
});

socket.on('user_disconnect', function (uid) {
    // console.log(uid);
    removeEnemyTank(uid);
});

socket.on('player_move', function (response) {
    let id = response["uid"];
    let x = response["x"];
    let y = response["y"];
    let orient = response["orient"];

    updateEnemyTank(x, y, orient, id);
});

socket.on('new_bullet', function (response) {
    let uid = response["uid"];
    let id = response["id_bullet"];
    let x = response["x"];
    let y = response["y"];
    let orient = response["orient"];

    // console.log("new bullet receive: " + id);

    let newBullet = new Bullet(x, y, orient, bulletSpeed, 2, bulletSize, uid);
    // newBullet.id = id;
    newBullet.setID(id);
    bulletMgr.addNewBullet(newBullet);
});

socket.on('user_die_update', function (response) {
    let uidEnemy = response["uid_enemy"];
    let idBullet = response["id_bullet"];

    // console.log("idBullet: " + idBullet);
    // bonus point to enemy_user
    bulletMgr.removeBullet(uidEnemy, idBullet);
});

socket.on('new_life', function (response) {
    let id = response["uid"];
    let x = response["x"];
    let y = response["y"];
    let orient = response["orient"];
    tank = new Tank(x, y, speed, playerType, id);
    tank.name = namePlayer;
    tank.enemy_revenge = player_revenge;
    isMovetable = true;
});

socket.on('best_score', function (response) {
    for (let i = 0; i < response.length; i++) {
        let uid = response[i]["uid"];
        let name = response[i]["name"];
        let score = response[i]["score"];
        // console.log(uid+" " + " " + score);
    }
    // console.log("///////////////////////////////");
});

//////////////////////// emit

function emitMove(x, y, orient, uid) {
    let move = {
        "uid": uid,
        "name": namePlayer,
        "x": x,
        "y": y,
        "orient": orient
    };
    socket.emit('move', move);
}

function emitShoot(xBullet, yBullet, orientBullet, uid, id) {
    let shoot = {
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
    let nameEnemy = playerTankMgr.getNameTankByUid(uidEnemy);
    let die = {
        "uid": uid,
        "name": namePlayer,
        "uid_enemy": uidEnemy,
        "name_enemy": nameEnemy,
        "id_bullet": idBullet
    };
    socket.emit('user_die', die);
}

/**
 * Document is ready
 */
jQuery(document).ready(function ($) {
    let modal_login = $('#login');
    modal_login.modal('show');
    modal_login.on('shown.bs.modal', function () {
        $('#name').focus()
    });

    modal_login.on('hidden.bs.modal', function () {
        let name_player = $('#name').val();

        if (name_player === '') {
            modal_login.modal('show');
            return;
        }

        // Khởi tạo người chơi tại đây
        // console.log(name_player);
        socket.emit('login', name_player);
    });

    socket.on('best_score', function (best_score) {
        update_best_score(best_score);
    });

    let canvas = $('#game')[0];
    context = canvas.getContext("2d");
    context.fillStyle = '#000000';
    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;

    setInterval(gameLoop, 17);

    function update_best_score(data_arr) {
        let html_best_score = '';

        for (let i = 0; i < data_arr.length; i++) {
            let player = data_arr[i];
            let current = '';

            if (player.uid === tank.uid) {
                current = 'active';
            }

            html_best_score += '<div class="player ' + current + '" data-id="' + player.uid + '">' +
                '<span class="name">' + player.name + '</span>: ' +
                '<span class="score">' + player.score + '</span>' +
                '</div>';
        }

        $('.top10').html(html_best_score);
    }
});