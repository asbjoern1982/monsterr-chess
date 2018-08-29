export function createView () {
  let ts = 50
  let dictonary = {
    'bp': '\u265F',
    'br': '\u265C',
    'bn': '\u265E',
    'bb': '\u265D',
    'bq': '\u265B',
    'bk': '\u265A',
    'wp': '\u2659',
    'wr': '\u2656',
    'wn': '\u2658',
    'wb': '\u2657',
    'wq': '\u2655',
    'wk': '\u2654'
  }

  function drawBoard (client, myColor, board) {
    let canvas = client.getCanvas()
    canvas.clear()
    canvas.backgroundColor = 'lightgrey'

    console.log(board)
    let myBoard = [[], [], [], [], [], [], [], []]
    if (myColor === 'black') {
      console.log('reverse the board')
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          myBoard[7 - y][x] = board[y][x]
        }
      }
    } else {
      myBoard = board
    }
    console.log(myBoard)

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let fill
        if (myColor === 'black') {
          fill = (x % 2 + y % 2 === 1) ? 'grey' : 'white'
        } else {
          fill = (x % 2 + y % 2 === 1) ? 'white' : 'grey'
        }
        let tile = new fabric.Rect({
          width: ts,
          height: ts,
          fill: fill,
          left: x * ts,
          top: y * ts,
          selectable: false
        })
        canvas.add(tile)
        if (myBoard[y][x] !== '  ') {
          let piece = new fabric.Text(toPicture(myBoard[y][x]), {
            left: x * ts,
            top: y * ts,
            fontSize: ts,
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

  // translate from point on the canvas to a tile on the chessboard
  function t2p (myColor, x, y) {
    let myY = Math.floor(y / ts)
    let myX = Math.floor(x / ts)
    if (myColor === 'black') {
      myY = 7 - myY
    }
    return {x: myX, y: myY}
  }

  return {
    drawBoard,
    getTileSize,
    toText,
    t2p
  }
}

export const view = createView()
