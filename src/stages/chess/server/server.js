/**
 * This represents the client side of stage 1.
 *
 * The
 *  - commands,
 *  - and events
 * you define here will only be valid for the duration of the stage.
 */

import {board} from '../model/board'
let clients = []

// Export stage as the default export
export default {
  // Optionally define commands
  commands: {
    'board': (server, clientId) => {
      server.send('board', board.getBoard()).toClient(clientId)
    },
    'consede': (server, clientId) => {
      if (clients[0] === clientId) {
        server.send('gameover', 'white consided').toAll()
      } else {
        server.send('gameover', 'black consided').toAll()
      }
      console.log(clientId + ' conseded')
    }
  },

  // Optionally define events
  events: {
    'move': (server, clientId, payload) => {
      let succes = board.move(
        (clients[0] === clientId) ? 'w' : 'b',
        payload.from,
        payload.to
      )
      server.send('board', board.getBoard()).toAll()

      if (succes) {
        let winner = board.winner()
        if (winner) {
          let winnertext = 'winner is ' + ((winner === 'w') ? 'white' : 'black')
          console.log('gameover: ' + winnertext)
          server.send('gameover', winnertext).toAll()
        }
      }
    }
  },

  // Optionally define a setup method that is run before stage begins
  setup: (server) => {
    console.log('PREPARING SERVER FOR STAGE', server.getCurrentStage())

    clients = server.getPlayers()
    if (clients.length !== 2) {
      console.log('not enough players!')
      // TODO revert the state
    }

    // FIXME wait
    setTimeout(() => {
      server.send('board', board.getBoard()).toAll()
      server.send('board', board.getBoard()).toAdmin()
    }, 1000)
  },

  // Optionally define a teardown method that is run when stage finishes
  teardown: (server) => {
    console.log('CLEANUP SERVER AFTER STAGE',
      server.getCurrentStage())
  },

  // Configure options
  options: {
    // You can set duration if you want the stage to
    // be timed on the server.
    // duration: 10000
  }
}
