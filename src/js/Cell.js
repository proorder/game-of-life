export default class Cell {
  constructor (root, x, y, r) {
    this.root = root
    this.x = x
    this.y = y
    this.width = r
    this.height = r
    this.isAlive = false
  }

  toggleAlive () {
    this.isAlive = !this.isAlive
    if (this.isAlive) {
      this.root.addAlive(this)
      return
    }

    this.root.removeAlive(this)
  }

  render (ctx) {
    ctx.beginPath()
    ctx.fillStyle = this.isAlive ? '#000' : '#fff'
    ctx.fillRect(
      1 + this.x * (this.width + 1),
      1 + this.y * (this.height + 1),
      this.width,
      this.height,
    )
    ctx.closePath()
  }
}