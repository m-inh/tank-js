'use strict';

// init image explore
var img_bullet_explore = new Image();
img_bullet_explore.src = "RESOURCE/Image/explosion.png";

var img_tank_explore_1 = new Image();
var img_tank_explore_2 = new Image();
var img_tank_explore_3 = new Image();
var img_tank_explore_4 = new Image();

img_tank_explore_1.src = "RESOURCE/Image/bullet_exp1.png";
img_tank_explore_2.src = "RESOURCE/Image/bullet_exp2.png";
img_tank_explore_3.src = "RESOURCE/Image/bullet_exp3.png";
img_tank_explore_4.src = "RESOURCE/Image/bullet_exp4.png";


// init image bullet
var img_bullet = new Image();
img_bullet.src = "RESOURCE/Image/bullet.png";


// init tank
var image_up_player_up_1 = new Image();
var image_up_player_up_2 = new Image();
var image_up_player_up_3 = new Image();
var image_up_player_up_4 = new Image();

image_up_player_up_1.src = "RESOURCE/Image/bossyellow_1.png";
image_up_player_up_2.src = "RESOURCE/Image/bossyellow_2.png";
image_up_player_up_3.src = "RESOURCE/Image/bossyellow_3.png";
image_up_player_up_4.src = "RESOURCE/Image/bossyellow_4.png";

var image_up_enemy_up_1 = new Image();
var image_up_enemy_up_2 = new Image();
var image_up_enemy_up_3 = new Image();
var image_up_enemy_up_4 = new Image();

image_up_enemy_up_1.src = "RESOURCE/Image/player_green_1.png";
image_up_enemy_up_2.src = "RESOURCE/Image/player_green_2.png";
image_up_enemy_up_3.src = "RESOURCE/Image/player_green_3.png";
image_up_enemy_up_4.src = "RESOURCE/Image/player_green_4.png";


// map
var img_brick = new Image();
img_brick.src = "RESOURCE/Image/brick.png";

// sound
var new_player = new Audio('RESOURCE/sound/eatBonus1.wav');
var audio_start_game = new Audio('RESOURCE/sound/enter_game.wav');
var audio_tank_shoot = new Audio('RESOURCE/sound/shoot.wav');
var audio_tank_explore = new Audio('RESOURCE/sound/explosion_tank.wav');
var audio_bullet_explore = new Audio('RESOURCE/sound/explosion.wav');