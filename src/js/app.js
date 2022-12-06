import '../scss/app.scss';
import GameOfLife from './GameOfLife'

const canvas = document.querySelector('.game-layout')

const ctx = canvas.getContext('2d')

const game = new GameOfLife(canvas, ctx)

game.render()

canvas.addEventListener('click', game.onClick.bind(game))
document.querySelector('.run').addEventListener('click', game.run.bind(game, false))
document.querySelector('.stop').addEventListener('click', game.stop.bind(game))
document.querySelector('.step').addEventListener('click', game.nextStep.bind(game))
