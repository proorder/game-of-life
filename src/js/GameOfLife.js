import Cell from './Cell'

export default class GameOfLife {
  constructor (canvas, ctx, x = 50, y = 40) {
    if (x < 10 || y < 10) {
      throw new Error('X and Y should be more than 10.')
    }

    this.canvas = canvas
    this.ctx = ctx
    this.x = x
    this.y = y
    this.r = 15
    this.delay = 1000
    this.cells = []
    this.alive = []
    this.approved = []
    this.needToggle = []
    this.isRunning = false
    this.milliseconds = null

    function setButtonActive (active) {
      if (!active) {
        document.querySelector(this.s).setAttribute('disabled', true) 
      } else {
        document.querySelector(this.s).removeAttribute('disabled') 
      }
    }

    this.buttons = {
      run: {
        s: '.run',
        setActive: setButtonActive
      },
      stop: {
        s: '.stop',
        setActive: setButtonActive
      },
      step: {
        s: '.step',
        setActive: setButtonActive
      },
    }

    this.canvas.width = this.x * (this.r + 1) + 1
    this.canvas.height = this.y * (this.r + 1) + 1

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

  run (continious = false) {
    if (!continious) {
      this.isRunning = true
      this.nextStep()
      this.milliseconds = performance.now()
      this.buttons.run.setActive(false)
      this.buttons.stop.setActive(true)
      this.buttons.step.setActive(false)
    }

    if (!this.isRunning) {
      return
    }

    if (performance.now() - this.milliseconds > 950) {
      this.milliseconds = performance.now()
      this.nextStep()
    }

    requestAnimationFrame(this.run.bind(this, true))
  }
  
  stop () {
    this.isRunning = false
    this.buttons.run.setActive(true)
    this.buttons.stop.setActive(false)
    this.buttons.step.setActive(true)
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
    this.stop()
    const { x, y } = event.target.getBoundingClientRect()
    this.findCell(event.clientX - x, event.clientY - y)
  }

  findCell (x, y) {
    const i = this.y * Math.floor(x / (this.r + 1)) + Math.floor(y / (this.r + 1))
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
    const relX = x > this.x - 1
      ? x - this.x
      : x < 0
        ? this.x + x
        : x
    
    const relY = y > this.y - 1
      ? y - this.y
      : y < 0
        ? this.y + y
        : y

    return this.cells[this.y * relX + relY]
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

      return isAlive ? length > 1 && length < 4 : length === 3
  }

  checkCell (x, y) {
      if (this.approved.includes(`${x},${y}`)) {
        return
      }

      const isAlive = this.checkIsCellAlive(x, y)
      
      const cell = this.getCell(x, y)
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