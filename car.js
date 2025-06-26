class Car extends Component {
  constructor({ctx, position = { x: 0, y: 0 }, color = 'red', width = 100, height = 100, velocity = { x: 0, y: 0 }}) {
    super({ctx, position, color, width, height, velocity})
    this.img = new Image();
    this.img.src = "assets/Cars/car_black_small_1.png";
  }

  draw() {
    ctx.drawImage(this.img, 120, 200);
  }
}
