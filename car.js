class Car extends Component {
  constructor({ctx, position = { x: 0, y: 0 }, color = 'red', width = 100, height = 100, velocity = { x: 0, y: 0 }}) {
    super({ctx, position, color, width, height, velocity})
    this.img = new Image();
    this.img.src = "assets/Cars/car_black_small_1.png";

    this.power = 0
    this.reverse = 0
    this.angle = 0
    this.angularVelocity = 0
    this.isThrottling = false
    this.isReversing = false

    this.maxPower = 0.075;
    this.maxReverse = 0.0375;
    this.powerFactor = 0.001;
    this.reverseFactor = 0.0005;

    this.drag = 0.95;
    this.angularDrag = 0.95;
    this.turnSpeed = 0.002;
  }

  draw() {
    console.log(this.angle)
    // const x = window.innerWidth / 2 - (SPRITE_SIZE / 2)
    // const y = window.innerHeight / 2 - (SPRITE_SIZE / 2)
    // const angleInRadians = (this.angle) / Math.PI

    // // save the current co-ordinate system 
    // // before we screw with it
    // ctx.save(); 

    // // move to the middle of where we want to draw our image
    // ctx.translate(x, y);

    // // rotate around that point, converting our 
    // // angle from degrees to radians 
    // ctx.rotate(angleInRadians);

    // // draw it up and to the left by half the width
    // // and height of the image 
    // ctx.drawImage(this.img,
    //   window.innerWidth / 2 - (SPRITE_SIZE / 2),
    //   window.innerHeight / 2 - (SPRITE_SIZE / 2)
    // );
    // // ctx.drawImage(image, -(image.width/2), -(image.height/2));

    // // and restore the co-ords to how they were when we began
    // ctx.restore(); 


    // const angleInRadians = (this.angle) % Math.PI / Math.PI
    // ctx.rotate(angleInRadians);
    // console.log(angleInRadians)
    // ctx.drawImage(this.img,
    //   window.innerWidth / 2 - (SPRITE_SIZE / 2),
    //   window.innerHeight / 2 - (SPRITE_SIZE / 2)
    // );

    // ctx.rotate(-angleInRadians);

    ctx.drawImage(this.img,
      window.innerWidth / 2 - (SPRITE_SIZE / 2),
      window.innerHeight / 2 - (SPRITE_SIZE / 2)
    );
  }

  update() {
    let changed;

    const canTurn = this.power > 0.0025 || this.reverse;

    const controls = keyDown

    const throttle = Math.round(controls[83] * 10) / 10;
    const reverse = Math.round(controls[87] * 10) / 10;

    if (
      this.isThrottling !== throttle ||
      this.isReversing !== reverse
    ) {
      changed = true;
      this.isThrottling = throttle;
      this.isReversing = reverse;
    }
    const turnLeft = canTurn && Math.round(controls[65] * 10) / 10;
    const turnRight = canTurn && Math.round(controls[68] * 10) / 10;

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
    } else {
      this.power -= this.powerFactor;
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

    this.position.x += this.velocity.x;
    this.position.y -= this.velocity.y;
    this.velocity.x *= this.drag;
    this.velocity.y *= this.drag;
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.angularDrag;

    let dx = this.velocity.x * gameLoopDelta
    let dy = this.velocity.y * gameLoopDelta
    this.position.x += dx
    this.position.y += dy

    cam.x += dx
    cam.y += dy
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
}
