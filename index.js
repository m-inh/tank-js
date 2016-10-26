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
        let uid = this.id;
        let x = getRandomArbitrary(40, MAP_WIDTH - 100);
        let y = getRandomArbitrary(40, MAP_HEIGHT - 100);

        let tank = {
            'uid': uid,
            'name': name,
            'x': x,
            'y': y,
            "orient": 1
        };

        //add user to array
        playerTank.push(tank);

        let dataNewGame = {
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
        let uid = this.id;
        let name = response["name"];
        let newX = response["x"];
        let newY = response["y"];
        let newOrient = response["orient"];

        let move = {
            "uid": uid,
            "name": name,
            "y": newY,
            "x": newX,
            "orient": newOrient
        };

        for (let i = 0; i < playerTank.length; i++) {
            if (playerTank[i]["uid"] == uid) {
                playerTank[i] = move;
            }
        }

        socket.broadcast.emit('player_move', move);
    });

    socket.on('shoot', function (response) {
        let uid = response["uid"];
        let id = response["id_bullet"];
        let x = response["x"];
        let y = response["y"];
        let orient = response["orient"];
        let shoot = {
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

        let plusScoreUserIndex = bestScoreArr.findIndex((o)=> {
            return o.uid === response.uid_enemy
        });

        if (plusScoreUserIndex === -1) {
            let score = {
                "uid": response["uid_enemy"],
                "name": response["name_enemy"],
                "score": 1
            };
            bestScoreArr.push(score);
        } else {
            bestScoreArr[plusScoreUserIndex].score++;
        }

        // if user left game and has no top -> remove score

        // if arr has >= 2 item, sort
        if (bestScoreArr.length > 1) {
            // sort
            bestScoreArr.sort((score1, score2)=> {
                return score1.score < score2.score
            });
        }

        socket.emit('best_score', bestScoreArr);
        socket.broadcast.emit('best_score', bestScoreArr);

        // return new life
        let uid = socket.id;
        let x = getRandomArbitrary(40, MAP_WIDTH - 100);
        let y = getRandomArbitrary(40, MAP_HEIGHT - 100);
        let tank = {
            'uid': uid,
            'name': response["name"],
            'x': x,
            'y': y,
            "orient": 1
        };

        for (let i = 0; i < playerTank.length; i++) {
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
        let uidDis = this.id;
        let tempTankArr = new Array();
        for (let i = 0; i < playerTank.length; i++) {
            if (playerTank[i]["uid"] != uidDis) {
                tempTankArr.push(playerTank[i]);
            }
        }
        playerTank = tempTankArr;
        socket.broadcast.emit('user_disconnect', uidDis);

        // if user left game and has no top -> remove score
        // find index of user in array
        if (bestScoreArr.length > 5) {
            let tempScoreArr = new Array();
            for (let i = 5; i < bestScoreArr.length; i++) {
                if (bestScoreArr[i]["uid"] == uidDis) {
                    // remove user score
                    for (let j = 0; j < i; j++) {
                        tempScoreArr.push(bestScoreArr[j]);
                    }
                    for (let k = i + 1; k < bestScoreArr.length; k++) {
                        tempScoreArr.push(bestScoreArr[k]);
                    }
                }
            }
            bestScoreArr = tempScoreArr;
        }

        console.log('user disconnected: ' + uidDis);
    });
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on *:' + port);
});


//////////////////// utils

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}