/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var canvas = document.getElementById('game');
	var context = canvas.getContext('2d');

	var Ball = __webpack_require__(1);
	var Game = __webpack_require__(2);
	var Paddle = __webpack_require__(3);
	var Collisions = __webpack_require__(4);
	var Bricks = __webpack_require__(5);
	var Levels = __webpack_require__(6);

	var startBtn = document.querySelector(".start-btn");
	var startPage = document.querySelector(".start-page-section");
	var gamePage = document.querySelector(".game-page-section");
	var gameOverPage = document.querySelector(".gameover-page-section");
	var maintitle = document.querySelector(".main-title");
	var restartBtn = document.querySelectorAll(".back-to-start-btn");
	var startLevelScreen = document.querySelector(".new-level-section");
	var newLevelStartButton = document.querySelector(".new-level-start-btn");
	var gameComplete = document.querySelector(".complete-page-section");

	startBtn.addEventListener("click", function () {
	  gamePage.style.display = "block";
	  startPage.style.display = "none";
	});

	restartBtn.forEach(function (btn) {
	  btn.addEventListener("click", function () {
	    document.location.reload();
	  });
	});

	newLevelStartButton.addEventListener("click", function () {
	  startLevelScreen.style.display = "none";
	  gamePage.style.display = "block";
	});

	var level = new Levels({});
	var gamePaddle = new Paddle({ x: canvas.width / 2 - 50, y: canvas.height - 15, width: 100, height: 10, color: "turquoise", context: context, canvas: canvas });
	var gameBall = new Ball({ y: canvas.height - 25, radius: 10, color: "white", canvas: canvas, context: context, gamePaddle: gamePaddle });
	var bricks = new Bricks({ padding: 15, brickOffsetLeft: 10, brickOffsetTop: 70, context: context, canvas: canvas, levels: level, gamepage: gamePage, gamecomplete: gameComplete, startLevelScreen: startLevelScreen, maintitle: maintitle });
	var gameCollisions = new Collisions({ canvas: canvas, context: context, gameBall: gameBall, gamePaddle: gamePaddle, bricks: bricks, maintitle: maintitle, gamepage: gamePage, gameover: gameOverPage, startLevelScreen: startLevelScreen });
	var game = new Game(gameBall, context, canvas, gamePaddle, gameCollisions, bricks);

	bricks.changeLevel();
	game.runGame();

/***/ },
/* 1 */
/***/ function(module, exports) {

	function Ball(options) {
	  this.paddle = options.gamePaddle;
	  this.x = options.x || 100;
	  this.y = options.y || 100;
	  this.radius = options.radius || 10;
	  this.color = options.color || "aqua";
	  this.context = options.context;
	  this.canvas = options.canvas;
	  this.speedX = options.speedX || 5;
	  this.speedY = options.speedY || -5;
	  this.space = options.space || false;
	}

	Ball.prototype.drawBall = function () {
	  this.context.beginPath();
	  this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	  this.context.closePath();
	  this.context.fillStyle = this.color;
	  this.context.fill();
	  return this;
	};

	Ball.prototype.resetBallAndPaddle = function () {
	  this.speedX = 5;
	  this.speedY = -5;
	  this.x = this.canvas.width / 2;
	  this.y = this.canvas.height - 25;
	  this.paddle.x = this.canvas.width / 2 - 50;
	  this.space = false;
	};

	Ball.prototype.moveBall = function () {
	  var ball = this;
	  var paddle = this.paddle;
	  if (ball.space === true) {
	    ball.x += ball.speedX;
	    ball.y += ball.speedY;
	  } else if (ball.space === false) {
	    ball.x = paddle.x + paddle.width / 2;
	  }
	  document.addEventListener('keyup', function (e) {
	    if (e.keyCode === 32) {
	      ball.space = true;
	    }
	  });
	};

	module.exports = Ball;

/***/ },
/* 2 */
/***/ function(module, exports) {

	function Game(gameBall, context, canvas, gamePaddle, gameCollisions, bricks) {
	  this.gameBall = gameBall;
	  this.context = context;
	  this.canvas = canvas;
	  this.gamePaddle = gamePaddle;
	  this.gameCollisions = gameCollisions;
	  this.bricks = bricks;
	}

	Game.prototype.runGame = function () {
	  requestAnimationFrame(function gameLoop() {
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.gamePaddle.drawPaddle();
	    this.gamePaddle.movePaddle();
	    this.gameBall.drawBall();
	    this.gameBall.moveBall();
	    this.gameCollisions.wallCollisions();
	    this.bricks.drawBricks();
	    this.gameCollisions.brickHitDetection();
	    this.gameCollisions.drawScore();
	    this.gameCollisions.drawLives();
	    requestAnimationFrame(gameLoop.bind(this));
	  }.bind(this));
	};

	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function Paddle(options) {
	  this.x = options.x || 200;
	  this.y = options.y || 300;
	  this.width = options.width || 100;
	  this.height = options.height || 10;
	  this.color = options.color || "blue";
	  this.context = options.context;
	  this.canvas = options.canvas;
	  this.moveRight = options.moveRight || false;
	  this.moveLeft = options.moveLeft || false;
	}

	Paddle.prototype.drawPaddle = function () {
	  this.context.fillStyle = this.color;
	  this.context.fillRect(this.x, this.y, this.width, this.height);
	};

	Paddle.prototype.movePaddle = function () {
	  var paddle = this;

	  if (paddle.moveRight && paddle.x < paddle.canvas.width - paddle.width) {
	    paddle.x += 5;
	  } else if (paddle.moveLeft && paddle.x > 0) {
	    paddle.x -= 5;
	  }
	  document.addEventListener("keydown", function (e) {
	    if (e.keyCode === 39) {
	      paddle.moveRight = true;
	    } else if (e.keyCode === 37) {
	      paddle.moveLeft = true;
	    }
	  });
	  document.addEventListener("keyup", function (e) {
	    if (e.keyCode === 39) {
	      paddle.moveRight = false;
	    } else if (e.keyCode === 37) {
	      paddle.moveLeft = false;
	    }
	  });
	};

	module.exports = Paddle;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Collisions(options) {
	  this.canvas = options.canvas;
	  this.context = options.context;
	  this.ball = options.gameBall;
	  this.paddle = options.gamePaddle;
	  this.bricks = options.bricks;
	  this.score = options.score || 0;
	  this.lives = options.lives || 3;
	  this.maintitle = options.maintitle;
	  this.gamepage = options.gamepage;
	  this.gameover = options.gameover;
	  this.startLevelScreen = options.startLevelScreen;
	}

	Collisions.prototype.levelComplete = function () {
	  this.gamepage.style.display = "none";
	  this.startLevelScreen.style.display = "block";
	  this.bricks.gameLevel++;
	  this.startLevelScreen.querySelector("#game-level").textContent = this.bricks.gameLevel;
	  this.lives = 3;
	  this.bricks.totalBricks = [];
	  this.bricks.changeLevel();
	  this.ball.resetBallAndPaddle();
	};

	Collisions.prototype.drawScore = function () {
	  this.context.font = "16px Arial";
	  this.context.fillStyle = "#FFF";
	  this.context.fillText("Score: " + this.score, 8, 20);
	};

	Collisions.prototype.drawLives = function () {
	  this.context.font = "16px Arial";
	  this.context.fillStyle = "#FFF";
	  this.context.fillText("Lives: " + this.lives, this.canvas.width - 65, 20);
	};

	Collisions.prototype.brickHitDetection = function () {
	  for (var i = 0; i < this.bricks.brickRows; i++) {
	    for (var j = 0; j < this.bricks.brickColumns; j++) {
	      var eachBrick = this.bricks.totalBricks[i][j];
	      if (eachBrick.status === 1) {
	        this.testForBrickDetection(eachBrick);
	      }
	    }
	  }
	};

	Collisions.prototype.testForBrickDetection = function (eachBrick) {
	  if (this.ball.x + this.ball.radius >= eachBrick.x && this.ball.x - this.ball.radius <= eachBrick.x + this.bricks.width) {
	    if (this.ball.y >= eachBrick.y && this.ball.y - this.ball.radius <= eachBrick.y + this.bricks.height || this.ball.y < eachBrick.y && this.ball.y + this.ball.radius === eachBrick.y) {
	      eachBrick.status = 0;
	      this.changeBallDirectionY();
	      this.increaseScore();
	      this.decreaseBrickCount();
	      if (!this.bricks.bricksOnPage) {
	        this.levelComplete();
	      }
	    }
	  }
	};

	Collisions.prototype.decreaseBrickCount = function () {
	  return this.bricks.bricksOnPage--;
	};

	Collisions.prototype.increaseScore = function () {
	  return this.score++;
	};

	Collisions.prototype.ballLeftRightDetection = function () {
	  if (this.ballHitsLeftRightWalls()) {
	    this.changeBallDirectionX();
	  }
	};

	Collisions.prototype.ballTopBottomDetection = function () {
	  if (this.ballHitTop()) {
	    this.changeBallDirectionY();
	  } else if (this.ballHitBottom()) {
	    if (this.ballHitPaddle()) {
	      this.paddleHitDetection();
	    } else {
	      this.lives--;
	      this.ball.resetBallAndPaddle();
	      this.gameOver();
	    }
	  }
	};

	Collisions.prototype.gameOver = function () {
	  if (!this.lives) {
	    this.gamepage.style.display = "none";
	    this.maintitle.style.display = "none";
	    this.gameover.style.display = "block";
	  }
	};

	Collisions.prototype.paddleHitDetection = function () {
	  if (this.ballHitPaddle()) {
	    this.changeBallDirectionY();
	    this.ball.speedX = 8 * (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / this.paddle.width;
	  }
	};

	Collisions.prototype.changeBallDirectionY = function () {
	  return this.ball.speedY = -this.ball.speedY;
	};

	Collisions.prototype.changeBallDirectionX = function () {
	  return this.ball.speedX = -this.ball.speedX;
	};

	Collisions.prototype.ballHitsLeftRightWalls = function () {
	  return this.ball.x > this.canvas.width - this.ball.radius || this.ball.x < this.ball.radius;
	};

	Collisions.prototype.ballHitBottom = function () {
	  return this.ball.y + this.ball.speedY > this.canvas.height - (this.ball.radius + this.paddle.height + 5);
	};

	Collisions.prototype.ballHitTop = function () {
	  return this.ball.y < this.ball.radius;
	};

	Collisions.prototype.ballHitPaddle = function () {
	  return this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width;
	};

	Collisions.prototype.wallCollisions = function () {
	  this.ballTopBottomDetection();
	  this.ballLeftRightDetection();
	};

	module.exports = Collisions;

/***/ },
/* 5 */
/***/ function(module, exports) {

	function Bricks(options) {
	  this.x = options.x;
	  this.y = options.y;
	  this.width = options.width;
	  this.height = options.height;
	  this.padding = options.padding;
	  this.brickRows = options.rows || 3;
	  this.brickColumns = options.columns || 3;
	  this.brickOffsetTop = options.brickOffsetTop;
	  this.brickOffsetLeft = options.brickOffsetLeft;
	  this.context = options.context;
	  this.canvas = options.canvas;
	  this.levels = options.levels;
	  this.gameLevel = 1;
	  this.bricksOnPage = options.bricksOnPage || 0;
	  this.totalBricks = [];
	  this.gamecomplete = options.gamecomplete;
	  this.gamepage = options.gamepage;
	  this.startLevelScreen = options.startLevelScreen;
	  this.maintitle = options.maintitle;
	}

	Bricks.prototype.changeLevel = function () {
	  if (this.gameLevel === 1) {
	    this.createBricks(this.levels.level1);
	  }if (this.gameLevel === 2) {
	    this.createBricks(this.levels.level2);
	  }if (this.gameLevel === 3) {
	    this.createBricks(this.levels.level3);
	  }if (this.gameLevel === 4) {
	    this.createBricks(this.levels.level4);
	  }if (this.gameLevel === 5) {
	    this.createBricks(this.levels.level5);
	  }if (this.gameLevel === 6) {
	    this.createBricks(this.levels.youWin);
	  }if (this.gameLevel === 7) {
	    this.gamepage.style.display = "none";
	    this.maintitle.style.display = "none";
	    this.startLevelScreen.style.display = "none";
	    this.gamecomplete.style.display = "block";
	  }
	};

	Bricks.prototype.draw = function () {
	  this.context.fillStyle = "#5e0";
	  this.context.fillRect(this.x, this.y, this.width, this.height);
	};

	Bricks.prototype.createBricks = function (bricksArray) {
	  var levelArray = bricksArray;
	  this.brickRows = levelArray.length;
	  this.brickColumns = levelArray[0].length;
	  for (var i = 0; i < this.brickRows; i++) {
	    var row = levelArray[i];
	    this.totalBricks.push([]);
	    for (var j = 0; j < this.brickColumns; j++) {
	      var brick = row[j];
	      if (brick === 1) {
	        this.bricksOnPage++;
	        this.totalBricks[i].push({ x: 0, y: 0, status: 1 });
	      } else {
	        this.totalBricks[i].push({ x: 0, y: 0, status: 0 });
	      }
	    }
	  }
	};

	Bricks.prototype.drawBricks = function () {
	  this.width = this.canvas.width / this.brickColumns - this.padding;
	  this.height = 15;
	  for (var i = 0; i < this.brickRows; i++) {
	    for (var j = 0; j < this.brickColumns; j++) {
	      if (this.totalBricks[i][j].status === 1) {
	        var brickX = j * (this.width + this.padding) + this.brickOffsetLeft;
	        var brickY = i * (this.height + this.padding) + this.brickOffsetTop;
	        this.totalBricks[i][j].x = brickX;
	        this.totalBricks[i][j].y = brickY;
	        var newBrick = new Bricks({ x: brickX,
	          y: brickY,
	          width: this.width,
	          height: this.height,
	          context: this.context
	        });
	        newBrick.draw();
	      }
	    }
	  }
	};

	module.exports = Bricks;

/***/ },
/* 6 */
/***/ function(module, exports) {

	function Levels(options) {
	  this.level1 = options.level1 || level1;
	  this.level2 = options.level2 || level2;
	  this.level3 = options.level3 || level3;
	  this.level4 = options.level4 || level4;
	  this.level5 = options.level5 || level5;
	  this.youWin = options.youWin || youWin;
	}

	var level1 = [[0, 1, 0, 1, 0], [1, 1, 0, 1, 1], [0, 1, 1, 1, 0]];

	var level2 = [[1, 1, 0, 1, 1], [1, 1, 0, 1, 1], [0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];

	var level3 = [[0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0]];

	var level4 = [[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]];

	var level5 = [[0, 0, 0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 0, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 1, 1, 0, 1, 0, 0], [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 0, 1, 0, 1, 0]];

	var youWin = [[0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0], [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	module.exports = Levels;

/***/ }
/******/ ]);