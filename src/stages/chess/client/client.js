/* globals fabric */

/**
 * This represents the client side of stage 1.
 *
 * The
 *  - commands,
 *  - events,
 *  - and html
 * you define here will only be valid for the duration of the stage.
 */

// You can import html and css from anywhere.
import html from './client.html'
// css is immediately applied on import.
import './client.css'

import {view} from './view'
let ts = view.getTileSize() // tile size

// Export the complete stage as the default export
export default {
  // Remember to include your html in stage
  // The html is shown only during the stage.
  html,

  // Optionally define commands
  commands: {
    finish (client) {
      client.stageFinished() // <== this is how a client reports finished
      return false // <== false tells client not to pass command on to server
    }
  },

  // Optionally define events
  events: {
    'board': (client, payload) => {
      view.drawBoard(client, payload)
    },
    'gameover': (client, payload) => {
      let canvas = client.getCanvas()
      let message = new fabric.Text(payload, {
        left: 70,
        top: 200,
        fontSize: 40
      })
      canvas.add(message)
      canvas.getObjects().forEach((object) => { object.selectable = false })
      $('#button-conseed').prop('disabled', true)
    }
  },

  // Optionally define a setup method that is run before stage begins
  setup: (client) => {
    // ask the server for the board state
    // client.sendCommand('board')
    // when the player starts dragging an item, save the position for later
    let canvas = client.getCanvas()

    let selectedPieceX
    let selectedPieceY
    canvas.on('mouse:down', (event) => {
      let piece = event.target
      selectedPieceX = piece.left
      selectedPieceY = piece.top
    })

    // when the player have moved a piece, send the move to the server
    canvas.on('object:modified', (event) => {
      let name = view.toText(event.target.text) // translate from unicode char to text
      let oldX = Math.floor(selectedPieceX / ts)
      let oldY = Math.floor(selectedPieceY / ts)
      let newX = Math.floor(event.e.clientX / ts)
      let newY = Math.floor(event.e.clientY / ts)
      let move = {
        name: name,
        from: {x: oldX, y: oldY},
        to: {x: newX, y: newY}
      }
      client.send('move', move)
    })

    // setup the consede button
    $('#button-conseed').mouseup(e => {
      e.preventDefault()
      client.sendCommand('consede')
    })
  },

  // Configure options
  options: {
    // You can set how much space you want the html
    // to take up. 0 = none. 1 = all.
    htmlContainerHeight: 0.3
  }
}
