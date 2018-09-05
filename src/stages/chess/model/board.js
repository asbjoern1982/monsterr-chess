function createBoard () {
  let boardstate = [
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
  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] // for writing the move in correct notation

  // if you move the a rook then the king can no longer castle with it
  let allowedCastling = {
    w: [true, true],
    b: [true, true]
  }
  let allowedEnPassentMoves = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false]
  ]

  function getBoard () {
    return boardstate
  }

  function move (color, from, to) {
    if (boardstate[from.y][from.x].charAt(0) === color &&
        boardstate[to.y][to.x].charAt(0) !== color) {
      if ((count % 2 === 0 && color === 'w') ||
          (count % 2 === 1 && color === 'b')) {
        let legal = false
        let piece = boardstate[from.y][from.x].charAt(1)
        let tempEnPassentMove

        if (piece === 'p') { // pawn ------------------------------------------------------------
          // en passent
          if ((allowedEnPassentMoves[(color === 'b' ? 0 : 1)][to.x] && (from.x - to.x === 1 || from.x - to.x === -1)) &&
              ((color === 'w' && from.y === 3) ||
              (color === 'b' && from.y === 4))) {
            boardstate[from.y][to.x] = '  '
            legal = true
          }

          // normal movement without attack
          if (from.x === to.x && boardstate[to.y][from.x] === '  ') {
            if (color === 'w') {
              // special case, first move for white pawn wants to move 2 forward
              if (from.y === 6 && to.y === 4) {
                if (boardstate[5][from.x] === '  ' && boardstate[4][from.x] === '  ') {
                  legal = true
                  tempEnPassentMove = {color: color, x: to.x}
                }
              }
              // normal movement
              if (from.y - to.y === 1) {
                legal = true
              }
            } else {
              // special case, first move for black pawn wants to move 2 forward
              if (from.y === 1 && to.y === 3) {
                if (boardstate[2][from.x] === '  ' && boardstate[3][from.x] === '  ') {
                  legal = true
                  tempEnPassentMove = {color: color, x: to.x}
                }
              }
              // normal movement
              if (from.y - to.y === -1) {
                legal = true
              }
            }
          }
          // check for valid attack white
          if (color === 'w' && from.y - to.y === 1 && (from.x - to.x === 1 || from.x - to.x === -1) && boardstate[to.y][to.x].charAt(0) === 'b') {
            legal = true
          }
          // check for valid attack black
          if (color === 'b' && from.y - to.y === -1 && (from.x - to.x === 1 || from.x - to.x === -1) && boardstate[to.y][to.x].charAt(0) === 'w') {
            legal = true
          }

          // clear enpessants and add any new ones
          if (legal) {
            allowedEnPassentMoves = [
              [false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false]
            ]
            if (tempEnPassentMove) {
              if (tempEnPassentMove.color === 'w') allowedEnPassentMoves[0][tempEnPassentMove.x] = true
              else allowedEnPassentMoves[1][tempEnPassentMove.x] = true
            }
          }
        } else if (piece === 'r') { // rook ------------------------------------------------------------
          if (from.x === to.x) {
            let clearWay = true
            for (let i = Math.min(from.y, to.y) + 1; i < Math.max(from.y, to.y); i++) {
              if (boardstate[i][from.x] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          } else if (from.y === to.y) {
            let clearWay = true
            for (let i = Math.min(from.x, to.x) + 1; i < Math.max(from.x, to.x); i++) {
              if (boardstate[from.y][i] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          }
          if (legal) { // if you move a rook you can no longer castle with that rook
            if (from.x === 0) allowedCastling[color][0] = false
            if (from.x === 7) allowedCastling[color][1] = false
          }
        } else if (piece === 'n') { // knight ------------------------------------------------------------
          if (((from.x - to.x === 2 || from.x - to.x === -2) &&
              (from.y - to.y === 1 || from.y - to.y === -1)) ||
              ((from.x - to.x === 1 || from.x - to.x === -1) &&
              (from.y - to.y === 2 || from.y - to.y === -2))) {
            legal = true
          }
        } else if (piece === 'b') { // bishop ------------------------------------------------------------
          // is it a legal bishop move?
          if (((from.x - from.y) === (to.x - to.y)) ||
              ((from.x + from.y) === (to.x + to.y))) {
            // check wheter something is in the way, have to go in each direction
            // positive x, positive y
            if (from.x - to.x < 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (boardstate[from.y + i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // positive x, negative y
            if (from.x - to.x < 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (boardstate[from.y - i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, positive y
            if (from.x - to.x > 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (boardstate[from.y + i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, negative y
            if (from.x - to.x > 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (boardstate[from.y - i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
          }
        } else if (piece === 'q') { // queen ------------------------------------------------------------
          // check if it is a valid rook-move
          if (from.x === to.x) {
            let clearWay = true
            for (let i = Math.min(from.y, to.y) + 1; i < Math.max(from.y, to.y); i++) {
              if (boardstate[i][from.x] !== '  ') {
                clearWay = false
              }
            }
            legal = clearWay
          } else if (from.y === to.y) {
            let clearWay = true
            for (let i = Math.min(from.x, to.x) + 1; i < Math.max(from.x, to.x); i++) {
              if (boardstate[from.y][i] !== '  ') {
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
                if (boardstate[from.y + i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // positive x, negative y
            if (from.x - to.x < 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < to.x - from.x; i++) {
                if (boardstate[from.y - i][from.x + i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, positive y
            if (from.x - to.x > 0 && from.y - to.y < 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (boardstate[from.y + i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
            // negative x, negative y
            if (from.x - to.x > 0 && from.y - to.y > 0) {
              let clearWay = true
              for (let i = 1; i < from.x - to.x; i++) {
                if (boardstate[from.y - i][from.x - i] !== '  ') {
                  clearWay = false
                }
              }
              if (clearWay) { legal = true }
            }
          }
        } else if (piece === 'k') { // king ------------------------------------------------------------
          // normal move
          if ((from.x - to.x) <= 1 && (from.x - to.x >= -1) &&
              (from.y - to.y) <= 1 && (from.y - to.y >= -1)) {
            legal = true
          }

          if (color === 'w' && allowedCastling[color][0] && to.x === 2 && to.y === 7) {
            boardstate[7][0] = '  '
            boardstate[7][3] = 'wr'
            legal = true
          } else if (color === 'w' && allowedCastling[color][1] && to.x === 6 && to.y === 7) {
            boardstate[7][7] = '  '
            boardstate[7][5] = 'wr'
            legal = true
          } else if (color === 'b' && allowedCastling[color][0] && to.x === 2 && to.y === 0) {
            boardstate[0][0] = '  '
            boardstate[0][3] = 'br'
            legal = true
          } else if (color === 'b' && allowedCastling[color][1] && to.x === 6 && to.y === 0) {
            boardstate[0][7] = '  '
            boardstate[0][5] = 'br'
            legal = true
          }

          if (legal) allowedCastling[color] = [false, false] // if you move the king, you can no longer castle
        }

        if (legal) {
          // make the move
          boardstate[to.y][to.x] = boardstate[from.y][from.x]
          boardstate[from.y][from.x] = '  '
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
        if (boardstate[y][x] === 'wk') {
          whiteKing = true
        } else if (boardstate[y][x] === 'bk') {
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

  // for testing
  function setBoard (newboardstate, newcount) {
    boardstate = newboardstate
    count = newcount
  }

  return {
    getBoard,
    move,
    winner,
    setBoard
  }
}

export const board = createBoard()
