class KeyState {
  rightPressed = false;
  leftPressed = false;

  constructor() {
    document.addEventListener("keydown", e => this.keyDownHandler(e), false);
    document.addEventListener("keyup", e => this.keyUpHandler(e), false);
  }

  keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      this.rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      this.leftPressed = false;
    }
  }
}


class Paddle {
  x;
  width;
  height;

  constructor(x) {
    this.height = 10;
    this.width = 75;
    this.x = x - this.width;
  }

  draw(ctx, height) {
    ctx.beginPath();
    ctx.rect(this.x, height - this.height, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  update(width, keyState) {
    if (keyState.rightPressed) {
      this.x += 7;
      if (this.x + this.width > width) {
        this.x = width - this.width;
      }
    } else if (keyState.leftPressed) {
      this.x -= 7;
      if (this.x < 0) {
        this.x = 0;
      }
    }
  }
}


class Ball {
  x;
  y;
  dx;
  dy;
  ballRadius;
  alive;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
    this.ballRadius = 10;
    this.alive = true;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  update(width, height, paddle) {
    // Check collision with sides
    if (this.x + this.dx > (width - this.ballRadius) || this.x + this.dx < this.ballRadius) {
      this.dx = -this.dx;
    }
    // Check collision with top
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
      // Check collision with paddle
    } else if (this.hitPaddle(paddle, height)) {
      this.dy = -this.dy;
      // Check collision with bottom
    } else if (this.y + this.dy > (height - this.ballRadius)) {
      this.alive = false;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  hitPaddle(paddle, height) {
    return (this.y + this.dy + (this.ballRadius / 2) >= height - 10) && (this.x > paddle.x && this.x < paddle.x + paddle.width);
  }
}

$(document).ready(function () {
  let canvas = $('canvas')[0];
  let ctx = canvas.getContext('2d');

  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  let ball = new Ball(width / 2, height - 30);
  let paddle = new Paddle(width / 2);
  let keyState = new KeyState();

  let interval = setInterval(() => {
    ctx.clearRect(0, 0, width, height);

    ball.draw(ctx);
    paddle.draw(ctx, height);

    ball.update(width, height, paddle);
    paddle.update(width, keyState);

    if (!ball.alive) {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }

  }, 10);
});

