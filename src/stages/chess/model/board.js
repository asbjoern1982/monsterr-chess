function createBoard () {
  let board = [
    // a     b     c     d     e     f     g     h
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'], // 8
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], // 7
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 6
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 5
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 4
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 3
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], // 2
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'] //  1
  ]
  let count = 0
  let letters = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h'
  }

  function getBoard () {
    return board
  }

  function move (color, from, to) {
    if (board[from.y][from.x].charAt(0) === color &&
        board[to.y][to.x].charAt(0) !== color) {
      if ((count % 2 === 0 && color === 'w') ||
          (count % 2 === 1 && color === 'b')) {
        let legal = false
        let piece = board[from.y][from.x].charAt(1)

        if (piece === 'p') { // pawn
          if (from.x === to.x) {
            if (color === 'w' && from.y - to.y > 0 && from.y - to.y <= 2) {
              legal = true
            } else {
              if (color === 'b' && from.y - to.y < 0 && from.y - to.y >= -2) {
                legal = true
              }
            }
          }
        } else if (piece === 'r') { // rook
          if (from.x === to.x || from.y === to.y) {
            legal = true
          }
        } else if (piece === 'n') { // knight
          if (((from.x - to.x === 2 || from.x - to.x === -2) &&
              (from.y - to.y === 1 || from.y - to.y === -1)) ||
              ((from.x - to.x === 1 || from.x - to.x === -1) &&
              (from.y - to.y === 2 || from.y - to.y === -2))) {
            legal = true
          }
        } else if (piece === 'b') { // bishop
          if (((from.x - from.y) === (to.x - to.y)) ||
              ((from.x + from.y) === (to.x + to.y))) {
            legal = true
          }
        } else if (piece === 'q') { // queen
          if ((from.x === to.x || from.y === to.y) ||
              (((from.x - from.y) === (to.x - to.y)) ||
              ((from.x + from.y) === (to.x + to.y)))) {
            legal = true
          }
        } else if (piece === 'k') { // king
          if ((from.x - to.x) <= 1 && (from.x - to.x >= -1) &&
              (from.y - to.y) <= 1 && (from.y - to.y >= -1)) {
            legal = true
          }
        }

        // make the move
        if (legal) {
          // TODO save it to the log
          board[to.y][to.x] = board[from.y][from.x]
          board[from.y][from.x] = '  '
          count++
          // translate the move into long algebraic chess notation
          let move = (piece !== 'p') ? piece.toUpperCase() : ''
          move +=
            letters[from.x] + (8 - from.y) + '-' +
            letters[to.x] + (8 - to.y)
          return move
        }
      }
    }
    // TODO log illigal moves as well
    return undefined
  }

  function winner () {
    let whiteKing = false
    let blackKing = false
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board[y][x] === 'wk') {
          whiteKing = true
        } else if (board[y][x] === 'bk') {
          blackKing = true
        }
      }
    }
    if (!whiteKing) {
      return 'b'
    }
    if (!blackKing) {
      return 'w'
    }
    return undefined
  }

  return {
    getBoard,
    move,
    winner
  }
}

export const board = createBoard()
