import createClient from 'monsterr'
import stage1 from './src/stages/stage1/client'
import chessStage from './src/stages/chess/client/client'

const stages = [stage1, chessStage]

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
