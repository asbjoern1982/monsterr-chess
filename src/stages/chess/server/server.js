/**
 * This represents the client side of stage 1.
 *
 * The
 *  - commands,
 *  - and events
 * you define here will only be valid for the duration of the stage.
 */

import {board} from '../model/board'
import {logger} from './logger'
import {Events} from 'monsterr'
let clients = []
let readyCount = 0

// Export stage as the default export
export default {
  // Optionally define commands
  commands: {
    'board': (server, clientId) => {
      console.log('client asked for the board')
      server.send('board', board.getBoard()).toClient(clientId)
    },
    'consede': (server, clientId) => {
      if (clients[0] === clientId) {
        server.send('gameover', 'white consided').toAll()
      } else {
        server.send('gameover', 'black consided').toAll()
      }
      console.log(clientId + ' conseded')
      console.log(logger.exportToString())
    },
    'reqCSV': (server, clientId) => {
      server.send('resCSV', logger.exportToCSV()).toAdmin()
    },
    'redrawAdmin': (server, clientId) => {
      console.log('admin asked for the board')
      server.send('board', board.getBoard()).toAdmin()
    }
  },

  // Optionally define events
  events: {
    [Events.CLIENT_RECONNECTED]: (server, clientId) => {
      // when a client reconnects, wait for it to rebuild the page and
      // then send it the correct stage, color and boardstate
      setTimeout(() => {
        let stageNo = server.getCurrentStage().number
        let color = clientId === clients[0] ? 'white' : 'black'
        server.send(Events.START_STAGE, stageNo).toClient(clientId)
        server.send('color', color).toClient(clientId)
        server.send('board', board.getBoard()).toClient(clientId)
      }, 1000)
    },
    // this is a hack as it relys on the clients latency
    // plus the changing of stage taking longer that then
    // server changing stage, if the server is slower a
    // ready-message might be lost. FIXME
    'clientReady': (server, clientId) => {
      readyCount++
      if (readyCount === clients.length) {
        // randomize color and tell each client what color their are
        if (Math.random() < 0.5) {
          let tempClientId = clients[0]
          clients[0] = clients[1]
          clients[1] = tempClientId
        }
        server.send('color', 'white').toClient(clients[0])
        server.send('color', 'black').toClient(clients[1])

        // inform the clients that the game is ready and send the board
        let tempBoard = board.getBoard()
        server.send('board', tempBoard).toAll()
        server.send('board', tempBoard).toAdmin()
      }
    },
    'move': (server, clientId, payload) => {
      let move = board.move(
        (clients[0] === clientId) ? 'w' : 'b',
        payload.from,
        payload.to
      )
      let tempBoard = board.getBoard()
      server.send('board', tempBoard).toAll()
      server.send('board', tempBoard).toAdmin()

      if (move) {
        // log the move
        logger.log(move) // TODO save to a log
        console.log(move)
        let message = ((clients[0] === clientId) ? 'white' : 'black') + ': ' + move
        server.send('move', message).toAll()

        // check if there is a winner
        let winner = board.winner()
        if (winner) {
          let winnertext = 'winner is ' + ((winner === 'w') ? 'white' : 'black')
          console.log('gameover: ' + winnertext)
          server.send('gameover', winnertext).toAll()
          console.log(logger.exportToString())
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
