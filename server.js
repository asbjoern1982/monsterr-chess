import createServer, { Network, Events } from 'monsterr'
import chessStage from './src/stages/chess/server/server'

const stages = [chessStage]
let playerCount = 0

let events = {
  [Events.CLIENT_CONNECTED] (server, clientId) {
    playerCount++
    if (playerCount >= 2) {
      server.start()
    }
  }
}
let commands = {}

const monsterr = createServer({
  network: Network.pairs(2),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined, // can specify client password
    adminPassword: 'sEcr3t' // and admin password
  }
})

monsterr.run()
