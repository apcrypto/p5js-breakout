var canvas = document.querySelector("canvas");
var scoreEl = document.querySelector(".score");
var paddle;
var ball;
var bricks = [];
var cols = 4;
var rows = 6;
var playingGame = false;
var youWin = false;
var youLose = false;
var winText;
var loseText;

function setup() {
  createCanvas(400, 600);

  paddle = new Paddle();
  ball = new Ball();

  var spacing = width / cols;
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var x = i * spacing;
      if (j % 2 == 0) {
        x += spacing / 2;
      }
      var y = spacing + j * 20;
      var brick = new Brick(x, y);
      bricks.push(brick);
    }
  }
  createText();
}

function draw() {
  background(0);
  // draw bricks
  for (var i = 0; i < bricks.length; i++) {
    bricks[i].display();

    if (ball.hits(bricks[i])) {
      bricks.splice(i, 1);
      ball.direction.y *= -1;
      scoreEl.innerHTML = "Score: " + (24 - bricks.length);
    }
  }

  // paddle
  paddle.display();
  if (playingGame) paddle.checkEdges();
  if (playingGame) paddle.update();

  // ball
  if (ball.meets(paddle)) {
    if (ball.direction.y > 0) ball.direction.y *= -1;
  }
  ball.display();
  if (playingGame) ball.checkEdges();
  if (playingGame) ball.update();

  // game logic
  if (ball.pos.y > height) {
    ball.pos = createVector(width / 2, height * 0.91);
    playingGame = false;
    youLose = true;
  }

  if (bricks.length === 0) {
    youWin = true;
    playingGame = false;
  }

  if (youWin) {
    // console.log("win");
    winText.style("display", "block");
    winText.style("color", "#fff");
  } else {
    winText.style("display", "none");
  }

  if (youLose) {
    // console.log("lose");
    loseText.style("display", "block");
    loseText.style("color", "#fff");
  } else {
    loseText.style("display", "none");
  }
}

function keyReleased() {
  paddle.isMovingRight = false;
  paddle.isMovingLeft = false;
}

function keyPressed() {
  scoreEl = document.querySelector(".score");
  if (keyCode == LEFT_ARROW) {
    paddle.isMovingLeft = true;
  } else if (keyCode == RIGHT_ARROW) {
    paddle.isMovingRight = true;
  } else if (keyCode == UP_ARROW) {
    playingGame = true;
    youWin = false;
    youLose = false;
    bricks = [];
    scoreEl.innerHTML = "Score: 0";
    loseText.style("display", "none");
    winText.style("display", "none");
    setup();
  }
}

function createText() {
  winText = createP("YOU WIN!");
  winText.position(width / 2.8, height / 2);

  loseText = createP("YOU LOSE!");
  loseText.position(width / 2.8, height / 2);
}

// object classes
function Paddle() {
  this.w = 160;
  this.h = 20;
  this.pos = createVector(width / 2 - this.w / 2, height - 34);
  this.isMovingLeft = false;
  this.isMovingRight = false;

  this.display = function () {
    rect(this.pos.x, this.pos.y, this.w, this.h);
  };

  this.update = function () {
    if (this.isMovingLeft) {
      this.move(-20);
    } else if (this.isMovingRight) {
      this.move(20);
    }
  };

  this.move = function (step) {
    this.pos.x += step;
  };

  this.checkEdges = function () {
    if (this.pos.x <= 0) this.pos.x = 0;
    else if (this.pos.x + this.w >= width) this.pos.x = width - this.w;
  };
}

function Ball() {
  this.pos = createVector(width / 2, height * 0.91);

  this.r = 20;
  this.vel = createVector(1, 1).mult(10);
  this.direction = createVector(1, 1);

  this.update = function () {
    this.pos.x += this.vel.x * this.direction.x;
    this.pos.y += this.vel.y * this.direction.y;
  };

  this.display = function () {
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };

  this.checkEdges = function () {
    if (this.pos.x > width - this.r && this.direction.x > 0) {
      this.direction.x *= -1;
    }
    if (this.pos.x < this.r && this.direction.x < 0) {
      this.direction.x *= -1;
    }
    if (this.pos.y < this.r && ball.direction.y < 0) this.direction.y *= -1;
  };

  this.meets = function (paddle) {
    if (
      this.pos.y < paddle.pos.y &&
      this.pos.y > paddle.pos.y - this.r &&
      ball.pos.x > paddle.pos.x - ball.r &&
      ball.pos.x < paddle.pos.x + paddle.w + ball.r
    ) {
      return true;
    } else {
      return false;
    }
  };

  this.hits = function (brick) {
    var d = dist(this.pos.x, this.pos.y, brick.pos.x, brick.pos.y);
    if (d < brick.r + this.r) {
      return true;
    } else {
      return false;
    }
  };
}

function Brick(x, y) {
  this.pos = createVector(x, y);
  this.r = 0;

  this.display = function () {
    push();
    stroke(255, 255, 255);
    fill(255, 0, 0);
    translate(x, y);
    rect(15, 0, 20, 20);
    pop();
  };
}
