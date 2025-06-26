class Car extends Component {
  constructor({ctx, position = { x: 500, y: 350 }, color = 'red', width = 100, height = 100, velocity = { x: 0, y: 0 }, imagePath, player}) {
    super({ctx, position, color, width, height, velocity})
    this.img = new Image();
    this.img.src = imagePath;
    this.player = player

    this.power = 0
    this.reverse = 0
    this.angle = 0
    this.angularVelocity = 0
    this.isThrottling = false
    this.isReversing = false

    this.maxPower = 0.075;
    this.maxReverse = 0.0375;
    this.boostFactor = 5;
    this.powerFactor = 0.001;
    this.reverseFactor = 0.0005;

    this.drag = 0.85;
    this.angularDrag = 0.85;
    this.turnSpeed = 0.008;
    this.isBoosting = false;
    this.boostCooldown = null;
  }

  draw() {
    const x = this.position.x
    const y = this.position.y
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  }

  update() {
    let changed;

    const canTurn = this.power > 0.0025 || this.reverse;

    const controls = keyDown
    const up = this.player === 1 ? controls[87] : controls[38]
    const down = this.player === 1 ? controls[83] : controls[40]
    const left = this.player === 1 ? controls[65] : controls[37]
    const right = this.player === 1 ? controls[68] : controls[39]

    const throttle = Math.round(up * 10) / 10;
    const reverse = Math.round(down * 10) / 10;

    if (
      this.isThrottling !== throttle ||
      this.isReversing !== reverse
    ) {
      changed = true;
      this.isThrottling = throttle;
      this.isReversing = reverse;
    }
    const turnLeft = canTurn && Math.round(left * 10) / 10;
    const turnRight = canTurn && Math.round(right * 10) / 10;

    if (this.isTurningLeft !== turnLeft) {
      changed = true;
      this.isTurningLeft = turnLeft;
    }
    if (this.isTurningRight !== turnRight) {
      changed = true;
      this.isTurningRight = turnRight;
    }

    // ===========

    if (this.isThrottling) {
      this.power += this.powerFactor * this.isThrottling;
      
      if (this.player === 1) {
        const vroomAudio = document.querySelector('.vroomAudio1')
        if (vroomAudio && vroomAudio.paused) {
          vroomAudio.play();
        }
  
        const idleAudio = document.querySelector('.idleAudio1')
        if (idleAudio) {
          idleAudio.pause();
        }
      }

      if (this.player === 2) {
        const vroomAudio = document.querySelector('.vroomAudio2')
        if (vroomAudio && vroomAudio.paused) {
          vroomAudio.play();
        }
  
        const idleAudio = document.querySelector('.idleAudio2')
        if (idleAudio) {
          idleAudio.pause();
        }
      }
    } else {
      this.power -= this.powerFactor;

      if (this.player === 1) {
        const vroomAudio = document.querySelector('.vroomAudio1')
        if (vroomAudio) {
          vroomAudio.pause();
        }
  
        const idleAudio = document.querySelector('.idleAudio1')
        if (idleAudio && vroomAudio.paused) {
          idleAudio.play();
        }
      }

      if (this.player === 2) {
        const vroomAudio = document.querySelector('.vroomAudio2')
        if (vroomAudio) {
          vroomAudio.pause();
        }
  
        const idleAudio = document.querySelector('.idleAudio2')
        if (idleAudio && vroomAudio.paused) {
          idleAudio.play();
        }
      }
    }
    if (this.isReversing) {
      this.reverse += this.reverseFactor;
    } else {
      this.reverse -= this.reverseFactor;
    }

    this.power = Math.max(0, Math.min(this.maxPower, this.power));
    this.reverse = Math.max(0, Math.min(this.maxReverse, this.reverse));

    const direction = this.power > this.reverse ? 1 : -1;

    if (this.isTurningLeft) {
      this.angularVelocity -= direction * this.turnSpeed * this.isTurningLeft;
    }
    if (this.isTurningRight) {
      this.angularVelocity += direction * this.turnSpeed * this.isTurningRight;
    }

    this.velocity.x += Math.sin(this.angle) * (this.power - this.reverse);
    this.velocity.y += Math.cos(this.angle) * (this.power - this.reverse);
    let xVelo = this.velocity.x * 10;
    let yVelo = this.velocity.y * 10;
    this.position.x += xVelo;
    this.position.y -= yVelo;
    this.velocity.x *= this.drag;
    this.velocity.y *= this.drag;
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.angularDrag;

    cam.x += xVelo
    cam.y -= yVelo
  }

  pressedKey(key) {
    if (Object.keys(this.keyDown).includes(key)) { 
      this.keyDown[key] = true
    }
  }

  releasedKey(key) {
    if (Object.keys(this.keyDown).includes(key)) { 
      this.keyDown[key] = false
    }
  }

  collidesWith(otherComponent) {
    const accPosition = {x: this.position.x - this.width / 2, y: this.position.y - this.height / 2};
    return (
      accPosition.x + this.width >= otherComponent.position.x && // box1 right collides with box2 left
      otherComponent.position.x + otherComponent.width >= accPosition.x && // box2 right collides with box1 left
      accPosition.y + this.height >= otherComponent.position.y && // box1 bottom collides with box2 top
      otherComponent.position.y + otherComponent.height >= accPosition.y // box1 top collides with box2 bottom
    )
  }

  boost() {
    if (new Date() < this.boostCooldown) {
      return;
    }

    this.power *= 2
    this.maxPower *= this.boostFactor
    let endTime = new Date()
    this.boostCooldown = endTime.setSeconds(endTime.getSeconds() + +3)

    setTimeout(() => {
      this.maxPower /= this.boostFactor
      this.power = Math.min(this.power, this.maxPower)
    }, "1000");
  }
}
