import createServer, { Network, Events } from 'monsterr'
import chessStage from './src/stages/chess/server/server'
import {LatencyModule} from './src/modules/LatencyModule'
import {NetworkModule} from './src/modules/NetworkModule'

const stages = [chessStage]
let playerCount = 0

let events = {
  [Events.CLIENT_CONNECTED] (server, clientId) {
    playerCount++
    if (playerCount === 2) {
      server.start()
    }
  }
}
let commands = {}

LatencyModule.addServerCommands(commands)
let network = Network.pairs(2)
NetworkModule.addServerCommands(commands, network)

const monsterr = createServer({
  network: network,
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined, // can specify client password
    adminPassword: 'sEcr3t' // and admin password
  }
})

monsterr.run()
