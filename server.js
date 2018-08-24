import createServer, { Network } from 'monsterr'
import stage1 from './src/stages/stage1/server'
import chessStage from './src/stages/chess/server/server'

const stages = [stage1, chessStage]

let events = {}
let commands = {}

const monsterr = createServer({
  network: Network.pairs(8),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined,  // can specify client password
    adminPassword: 'sEcr3t'     // and admin password
  }
})

monsterr.run()
