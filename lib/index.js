var canvas = document.getElementById('game');
var context = canvas.getContext('2d');


var Ball = require('./ball');
var Draw = require('./draw');
var Paddle = require('./paddle');
var Collisions = require('./collision');
var Bricks = require('./bricks');


var startBtn = document.querySelector(".start-btn");
var startPage = document.querySelector(".start-page-section");
var gameOverPage = document.querySelector(".gameover-page-section");
var restartBtn = document.querySelector(".back-to-start-btn");

startBtn.addEventListener("click", function() {
  canvas.style.display = "block";
  startPage.style.display = "none";
  gameOverPage.style.display = "block";
});
restartBtn.addEventListener("click", function() {
  document.location.reload();
});


var gamePaddle = new Paddle({x: canvas.width/2 - 50, y: canvas.height-15, width: 100, height: 10, color: "turquoise" , context: context, canvas: canvas});
var gameBall = new Ball({y: canvas.height-25, radius: 10, color: "green", context: context, gamePaddle: gamePaddle});
var bricks = new Bricks({padding: 15, rows: 3, columns: 5, brickOffsetLeft: 10, brickOffsetTop: 70, context: context, canvas: canvas});
var gameCollisions = new Collisions({canvas :canvas, context: context, gameBall: gameBall, gamePaddle: gamePaddle, bricks: bricks});

var draw = new Draw(gameBall, context, canvas, gamePaddle, gameCollisions, bricks);


bricks.createBricks();
// console.log(bricks.totalBricks[0][0].status);

draw.runGame();
