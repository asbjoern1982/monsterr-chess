export function createView () {
  let ts
  let padding
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

  function drawBoard (canvas, myColor, board, boardsize) {
    padding = boardsize / 12
    ts = (boardsize - 2 * padding) / 8
    canvas.clear()
    canvas.backgroundColor = 'lightgrey'

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

    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    for (let l = 0; l < 8; l++) {
      let coodinateTop = new fabric.Text(letters[l], {
        left: padding + l * ts + ts * 0.35,
        top: ts * 0.05,
        fontSize: padding * 0.75,
        fill: 'grey',
        selectable: false
      })
      let coodinateBottom = new fabric.Text(letters[l], {
        left: padding + l * ts + ts * 0.35,
        top: padding + ts * 8 + ts * 0.05,
        fontSize: padding * 0.75,
        fill: 'grey',
        selectable: false
      })
      let number = (myColor === 'white') ? 8 - l : l + 1
      let coodinateRight = new fabric.Text('' + number, {
        left: ts * 0.25,
        top: padding + l * ts + ts * 0.15,
        fontSize: padding * 0.75,
        fill: 'grey',
        selectable: false
      })
      let coodinateLeft = new fabric.Text('' + number, {
        left: padding + ts * 8 + ts * 0.25,
        top: padding + l * ts + ts * 0.15,
        fontSize: padding * 0.75,
        fill: 'grey',
        selectable: false
      })
      canvas.add(coodinateTop, coodinateBottom, coodinateRight, coodinateLeft)
    }

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
          left: x * ts + padding,
          top: y * ts + padding,
          selectable: false
        })
        canvas.add(tile)
      }
    }

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (myBoard[y][x] !== '  ') {
          let piece = new fabric.Text(toPicture(myBoard[y][x]), {
            left: x * ts + padding,
            top: y * ts + padding,
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

  // translate from point on the canvas to a tile on the chessboard
  function t2p (myColor, x, y) {
    if (x > padding && x < padding + ts * 8 &&
        y > padding && y < padding + ts * 8) {
      let myY = Math.floor((y - padding) / ts)
      let myX = Math.floor((x - padding) / ts)
      if (myColor === 'black') {
        myY = 7 - myY
      }
      return {x: myX, y: myY}
    }
  }

  return {
    drawBoard,
    toText,
    t2p
  }
}

export const view = createView()
