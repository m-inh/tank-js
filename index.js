/**
 * Created by TooNies1810 on 5/25/16.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var _ = require('lodash');

var playerTank = new Array();
var bulletArr = new Array();

var bestScoreArr = new Array();

const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;

io.on('connection', function (socket) {

    socket.on('login', function (name) {
        // emit to user info of their tank
        var uid = this.id;
        var x = getRandomArbitrary(40, MAP_WIDTH - 100);
        var y = getRandomArbitrary(40, MAP_HEIGHT - 100);

        var tank = {
            'uid': uid,
            'name': name,
            'x': x,
            'y': y,
            "orient": 1
        };

        //add user to array
        playerTank.push(tank);

        var dataNewGame = {
            'tank': playerTank,
            'bullet': bulletArr
        };

        socket.emit('user', dataNewGame);// x y
        socket.emit('best_score', bestScoreArr);

        // emit to other user the new tank
        socket.broadcast.emit('new_enemy', tank);

        console.log('user connected: ' + uid);
    });

    socket.on('move', function (response) {
        var uid = this.id;
        var name = response["name"];
        var newX = response["x"];
        var newY = response["y"];
        var newOrient = response["orient"];

        var move = {
            "uid": uid,
            "name": name,
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
        // console.log(response["uid_enemy"]);
        for (var i = 0; i < bestScoreArr.length; i++) {
            var tempObj = bestScoreArr[i];
            if (tempObj["uid"] == response["uid_enemy"]) {
                tempObj["score"]++;
                // console.log(tempObj["score"]);
                break;
            } else if (i == bestScoreArr.length - 1) {
                var score = {
                    "uid": response["uid_enemy"],
                    "name": response["name_enemy"],
                    "score": 1
                };
                // console.log("new score: " + i + " " + score);
                bestScoreArr.push(score);
            }
        }
        if (bestScoreArr.length == 0) {
            var score = {
                "uid": response["uid_enemy"],
                "name": response["name_enemy"],
                "score": 1
            };
            // console.log("new score: " + i + " " + score);
            bestScoreArr.push(score);
        }

        // if user left game and has no top -> remove score
        // for (var i=0; i<)

        // if arr has >= 2 item, sort
        if (bestScoreArr.length > 1) {
            // sort
            for (var i = 0; i < bestScoreArr.length; i++) {
                for (var j = 0; j < bestScoreArr.length; j++) {

                    if (bestScoreArr[i]["score"] > bestScoreArr[j]["score"]) {
                        var tempScore = bestScoreArr[i];
                        bestScoreArr[i] = bestScoreArr[j];
                        bestScoreArr[j] = tempScore;
                    }
                }
            }
        }

        socket.emit('best_score', bestScoreArr);
        socket.broadcast.emit('best_score', bestScoreArr);

        // return new life
        var uid = socket.id;
        var x = getRandomArbitrary(40, MAP_WIDTH - 100);
        var y = getRandomArbitrary(40, MAP_HEIGHT - 100);
        var tank = {
            'uid': uid,
            'name': response["name"],
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

        // if user left game and has no top -> remove score
        // find index of user in array
        if (bestScoreArr.length > 5) {
            var tempScoreArr = new Array();
            for (var i = 5; i < bestScoreArr.length; i++) {
                if (bestScoreArr[i]["uid"] == uidDis) {
                    // remove user score
                    for (var j = 0; j < i; j++) {
                        tempScoreArr.push(bestScoreArr[j]);
                    }
                    for (var k = i + 1; k < bestScoreArr.length; k++) {
                        tempScoreArr.push(bestScoreArr[k]);
                    }
                }
            }
            bestScoreArr = tempScoreArr;
        }

        console.log('user disconnected: ' + uidDis);
    });
});

app.use(express.static(__dirname + '/tank_client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/tank_client/index.html');
});

var port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on *:' + port);
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
