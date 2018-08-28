import createClient from 'monsterr'
import chessStage from './src/stages/chess/client/client'

const stages = [chessStage]

let options = {
  canvasBackgroundColor: 'blue',
  htmlContainerHeight: 0 // Hide html
}

let events = {}
let commands = {}

createClient({
  events,
  commands,
  options,
  stages
})
