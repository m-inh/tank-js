/**
 * Created by TooNies1810 on 5/25/16.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerTank = new Array();
var bulletArr = new Array();

io.on('connection', function (socket) {
    // emit to user info of their tank
    var uid = socket.id;
    var x = getRandomArbitrary(40, 900);
    var y = getRandomArbitrary(40, 600);
    var tank = {
        'uid': uid,
        'x': x,
        'y': y,
        "orient": 1
    };

    //add user to array
    playerTank.push(tank);

    var dataNewGame = {
      'tank' : playerTank,
      'bullet' : bulletArr
    };
    socket.emit('user', dataNewGame);// x y

    // emit to other user the new tank
    socket.broadcast.emit('new_enemy', tank);

    console.log('user connected: ' + uid);

    socket.on('move', function (response) {
        var uid = this.id;
        var newX = response["x"];
        var newY = response["y"];
        var newOrient = response["orient"];

        var move = {
            "uid": uid,
            "y": newY,
            "x": newX,
            "orient": newOrient
        };

        for (var i = 0; i < playerTank.length; i++) {
            if (playerTank[i]["uid"] == uid) {
                playerTank[i] = move;
            }
        }

        socket.broadcast.emit('player_move', move);
    });

    socket.on('shoot', function (response) {
        var uid = response["uid"];
        var id = response["id_bullet"];
        var x = response["x"];
        var y = response["y"];
        var orient = response["orient"];
        var shoot = {
            "uid": uid,
            "id_bullet": id,
            "x": x,
            "y": y,
            "orient": orient
        };
        // bulletArr.push(shoot);
        
        // console.log("new shoot +++" + shoot.uid);
        socket.broadcast.emit('new_bullet', shoot);
    });

    socket.on('user_die', function (response) {


        // return new life
        var uid = socket.id;
        var x = getRandomArbitrary(40, 900);
        var y = getRandomArbitrary(40, 600);
        var tank = {
            'uid': uid,
            'x': x,
            'y': y,
            "orient": 1
        };

        for (var i = 0; i < playerTank.length; i++) {
            if (playerTank[i]["uid"] == uid) {
                playerTank[i] = tank;
            }
        }

        // console.log("user die: " + response['uid']);
        // console.log("user die enemy: " + response['uid_enemy']);

        socket.emit('new_life', tank);
        socket.broadcast.emit("user_die_update", response);
        socket.broadcast.emit('player_move', tank);
    });

    socket.on('disconnect', function (id) {
        var uidDis = this.id;
        var tempTankArr = new Array();
        for (var i = 0; i < playerTank.length; i++) {
            if (playerTank[i]["uid"] != uidDis) {
                tempTankArr.push(playerTank[i]);
            }
        }
        playerTank = tempTankArr;
        socket.broadcast.emit('user_disconnect', uidDis);
        console.log('user disconnected: ' + uidDis);
    });
});

app.use(express.static(__dirname + '/tank_client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/tank_client/index.html');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


//////////////////// utils

/**
 *
 * @param min
 * @param max
 * @returns {*}
 *
 * @Todo Fix bug khi vào đúng viên gạch
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}