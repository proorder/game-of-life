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
    this.needToggle = []

    this.initCells()
    this.render()
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
    this.approved = []

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

    this.needToggle.forEach(c => c.toggleAlive())
    this.needToggle = []
    this.render()
  }

  getCell (x, y) {
    return this.cells[this.y * x + y]
  }

  checkIsCellAlive (x, y) {
      const isAlive = this.getCell(x, y).isAlive

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

      if (x === 50 && y === 41) {
        console.log(length)
      }

      return isAlive ? length > 1 && length < 4 : length === 3
  }

  checkCell (x, y) {
      if (this.approved.includes(`${x},${y}`)) {
        return
      }

      const isAlive = this.checkIsCellAlive(x, y)
      
      const cell = this.cells[this.y * x + y]
      if (isAlive !== cell.isAlive && !this.needToggle.find(c => c.x === cell.x && c.y === cell.y)) {
        this.needToggle.push(cell)
      }
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