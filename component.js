class Component {
  constructor({ctx, position = { x: 0, y: 0 }, color = 'red', width = 100, height = 100, velocity = { x: 0, y: 0 }}) {
    this.ctx = ctx
    this.position = position
    this.width = width
    this.height = height
    this.color = color
    this.velocity = velocity
  }

  draw() {
    this.ctx.strokeStyle = this.color
    this.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
