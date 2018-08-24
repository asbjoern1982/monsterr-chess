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

function drawBoard (canvas, board) {
  console.log('drawing!')
  canvas.clear()
  canvas.backgroundColor = 'grey'

  let ts = 50 // tile size
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let tile = new fabric.Rect({
        width: ts,
        height: ts,
        fill: (x % 2 + y % 2 === 1) ? 'black' : 'white',
        left: x * ts,
        top: y * ts,
        selectable: false
      })
      canvas.add(tile)
      if (board[y][x] !== '  ') {
        let piece = new fabric.Text(board[y][x], {
          stroke: 'black',
          fill: 'white',
          left: x * ts,
          top: y * ts
        })
        canvas.add(piece)
      }
    }
  }
}

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
  events: {},

  // Optionally define a setup method that is run before stage begins
  setup: (client) => {

    // TODO ask the server for the board
    let board = [
      // a     b     c     d     e     f     g     h
      ['br', 'bk', 'bb', 'bq', 'bk', 'bb', 'bk', 'br'], // 8
      ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], // 7
      ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 6
      ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 5
      ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 4
      ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 3
      ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], // 1
      ['wr', 'wk', 'wb', 'wq', 'wk', 'wb', 'wk', 'wr'] //  2
    ]

    drawBoard(client.getCanvas(), board)
  },

  // Configure options
  options: {
    // You can set how much space you want the html
    // to take up. 0 = none. 1 = all.
    htmlContainerHeight: 0.3
  }
}
