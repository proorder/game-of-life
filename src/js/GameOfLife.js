import Cell from './Cell'

export default class GameOfLife {
  constructor (canvas, ctx, x = 100, y = 50) {
    if (x < 10 || y < 10) {
      throw new Error('X and Y should be more than 10.')
    }

    this.canvas = canvas
    this.ctx = ctx
    this.x = x
    this.y = y
    this.r = 5
    this.cells = []
    this.alive = []
    this.approved = []

    this.initCells()
  }

  initCells () {
    this.cells = []

    for (let x = 0; x < this.x; x++) {
      for (let y = 0; y < this.y; y++) {
        this.cells.push(new Cell(this, x, y, this.r))
      }
    }
  }

  addAlive (cell) {
    if (this.alive.find(c => cell.x === c.x && cell.y === c.y)) {
      return
    }
    this.alive.push(cell)
  }

  removeAlive (cell) {
    this.alive = this.alive.filter(c => !(cell.x === c.x && cell.y === c.y))
  }

  onClick (event) {
    const { x, y } = event.target.getBoundingClientRect()
    this.findCell(event.clientX - x, event.clientY - y)
  }

  findCell (x, y) {
    const i = this.y * Math.round(x / (this.r + 1)) + Math.round(y / (this.r + 1))
    this.cells[i].toggleAlive()
    this.render()
  }

  nextStep () {
    for (const cell of this.alive) {
      this.checkCell(cell.x, cell.y)
      this.checkCell(cell.x - 1, cell.y -1)
      this.checkCell(cell.x, cell.y -1)
      this.checkCell(cell.x + 1, cell.y -1)
      this.checkCell(cell.x - 1, cell.y)
      this.checkCell(cell.x + 1, cell.y)
      this.checkCell(cell.x - 1, cell.y + 1)
      this.checkCell(cell.x, cell.y + 1)
      this.checkCell(cell.x + 1, cell.y + 1)
    }

    this.render()
  }

  getCell (x, y) {
    return this.cells[this.y * x + y]
  }

  checkIsCellAlive (x, y) {
      const length = [
        this.getCell(x - 1, y -1).isAlive,
        this.getCell(x, y -1).isAlive,
        this.getCell(x + 1, y -1).isAlive,
        this.getCell(x - 1, y).isAlive,
        this.getCell(x + 1, y).isAlive,
        this.getCell(x - 1, y + 1).isAlive,
        this.getCell(x, y + 1).isAlive,
        this.getCell(x + 1, y + 1).isAlive,
      ].filter(c => !!c).length

      return length > 1 && length < 4
  }

  checkCell (x, y) {
      if (this.approved.includes(`${x},${y}`)) {
        return
      }

      const isAlive = this.checkIsCellAlive(x, y)
      
      const cell = this.cells[this.y * x + y]
      cell.isAlive = isAlive
  }
  
  render () {
    requestAnimationFrame(() => {
      const { width, height } = this.canvas.getBoundingClientRect()
      this.ctx.beginPath()
      this.ctx.fillStyle = '#f2f1f1'
      this.ctx.fillRect(
        0,
        0,
        width,
        height,
      )
      this.ctx.closePath()
      
      for (const cell of this.cells) {
        cell.render(this.ctx)
      }
    })
  }
}