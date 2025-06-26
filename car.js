class Car extends Component {
  constructor({ctx, position = { x: 0, y: 0 }, color = 'red', width = 100, height = 100, velocity = { x: 0, y: 0 }}) {
    super({ctx, position, color, width, height, velocity})
    this.img = new Image();
    this.img.src = "assets/Cars/car_black_small_1.png";
  }

  draw() {
    ctx.drawImage(this.img,
      window.innerWidth / 2 - (SPRITE_SIZE / 2),
      window.innerHeight / 2 - (SPRITE_SIZE / 2)
    );
  }

  updateState() {
    let dx = this.velocity.x * gameLoopDelta
    let dy = this.velocity.y * gameLoopDelta
    this.position.x += dx
    this.position.y += dy

    cam.x += dx
    cam.y += dy
  }
}
