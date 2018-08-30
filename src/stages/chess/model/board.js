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
  let letters = { // for writing the move in correct notation
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
          // normal movement without attack
          if (from.x === to.x && board[to.y][from.x] === '  ') {
            if (color === 'w') {
              // special case, first move for white pawn wants to move 2 forward
              if (from.y === 6 && to.y === 4) {
                if (board[5][from.x] === '  ' && board[4][from.x]) {
                  legal = true
                }
              }
              // normal movement
              if (from.y - to.y === 1) {
                legal = true
              }
            } else {
              // special case, first move for black pawn wants to move 2 forward
              if (from.y === 1 && to.y === 3) {
                if (board[2][from.x] === '  ' && board[3][from.x]) {
                  legal = true
                }
              }
              // normal movement
              if (from.y - to.y === -1) {
                legal = true
              }
            }
          }
          // check for valid attack white
          if (color === 'w' && from.y - to.y === 1 && (from.x - to.x === 1 || from.x - to.x === -1) && board[to.y][to.x].charAt(0) === 'b') {
            legal = true
          }
          // check for valid attack black
          if (color === 'b' && from.y - to.y === -1 && (from.x - to.x === 1 || from.x - to.x === -1) && board[to.y][to.x].charAt(0) === 'w') {
            legal = true
          }
        } else if (piece === 'r') { // rook
          if (from.x === to.x) {
            let clearWay = true
            for (let i = Math.min(from.y, to.y) + 1; i < Math.max(from.y, to.y); i++) {
              if (board[i][from.x] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          } else if (from.y === to.y) {
            let clearWay = true
            for (let i = Math.min(from.x, to.x) + 1; i < Math.max(from.x, to.x); i++) {
              if (board[from.y][i] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          }
        } else if (piece === 'n') { // knight
          if (((from.x - to.x === 2 || from.x - to.x === -2) &&
              (from.y - to.y === 1 || from.y - to.y === -1)) ||
              ((from.x - to.x === 1 || from.x - to.x === -1) &&
              (from.y - to.y === 2 || from.y - to.y === -2))) {
            legal = true
          }
        } else if (piece === 'b') { // bishop
          // is it a legal bishop move?
          if (((from.x - from.y) === (to.x - to.y)) ||
              ((from.x + from.y) === (to.x + to.y))) {
            // check wheter something is in the way, have to go in each direction
            // positive x, positive y
            if (from.x - to.x < 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (board[from.y + i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // positive x, negative y
            if (from.x - to.x < 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (board[from.y - i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, positive y
            if (from.x - to.x > 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (board[from.y + i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, negative y
            if (from.x - to.x > 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (board[from.y - i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
          }
        } else if (piece === 'q') { // queen
          // check if it is a valid rook-move
          if (from.x === to.x) {
            let clearWay = true
            for (let i = Math.min(from.y, to.y) + 1; i < Math.max(from.y, to.y); i++) {
              if (board[i][from.x] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          } else if (from.y === to.y) {
            let clearWay = true
            for (let i = Math.min(from.x, to.x) + 1; i < Math.max(from.x, to.x); i++) {
              if (board[from.y][i] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          }
          // is it a legal bishop move?
          if (((from.x - from.y) === (to.x - to.y)) ||
              ((from.x + from.y) === (to.x + to.y))) {
            // check wheter something is in the way, have to go in each direction
            // positive x, positive y
            if (from.x - to.x < 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (board[from.y + i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // positive x, negative y
            if (from.x - to.x < 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (board[from.y - i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, positive y
            if (from.x - to.x > 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (board[from.y + i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, negative y
            if (from.x - to.x > 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (board[from.y - i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
          }
        } else if (piece === 'k') { // king
          if ((from.x - to.x) <= 1 && (from.x - to.x >= -1) &&
              (from.y - to.y) <= 1 && (from.y - to.y >= -1)) {
            legal = true
          }
        }

        if (legal) {
          // make the move
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
    // NOTE: it might be interesting to log the illigal moves and log them
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
