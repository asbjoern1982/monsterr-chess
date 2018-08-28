export function createView () {
  let ts = 50
  let dictonary = {
    'bp': '\u265F',
    'br': '\u265C',
    'bh': '\u265E',
    'bb': '\u265D',
    'bq': '\u265B',
    'bk': '\u265A',
    'wp': '\u2659',
    'wr': '\u2656',
    'wh': '\u2658',
    'wb': '\u2657',
    'wq': '\u2655',
    'wk': '\u2654'
  }

  function drawBoard (client, board) {
    let canvas = client.getCanvas()
    canvas.clear()
    canvas.backgroundColor = 'lightgrey'

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let tile = new fabric.Rect({
          width: ts,
          height: ts,
          fill: (x % 2 + y % 2 === 1) ? 'grey' : 'white',
          left: x * ts,
          top: y * ts,
          selectable: false
        })
        canvas.add(tile)
        if (board[y][x] !== '  ') {
          let piece = new fabric.Text(toPicture(board[y][x]), {
            left: x * ts,
            top: y * ts,
            hasControls: false
          })
          canvas.add(piece)
        }
      }
    }
  }

  function toPicture (piece) {
    return dictonary[piece]
  }

  function toText (piece) {
    for (let key in dictonary) {
      if (piece === dictonary[key]) {
        return key
      }
    }
  }

  function getTileSize () {
    return ts
  }

  return {
    drawBoard,
    getTileSize,
    toText
  }
}

export const view = createView()
