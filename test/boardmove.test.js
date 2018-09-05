import {board} from '../src/stages/chess/model/board'

beforeEach(() => {
  let newboardstate = [
    // 0     1     2     3     4     5     6     7
    // a     b     c     d     e     f     g     h
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'], // 8  0
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], // 7  1
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 6  2
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 5  3
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 4  4
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '], // 3  5
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], // 2  6
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'] //  1  7
  ]
  board.setBoard(newboardstate, 0)
})

describe('pawn moves', () => {
  test('normal move and attack', () => {
    expect(board.move('w', {x: 4, y: 6}, {x: 4, y: 6})).toBeUndefined() // on it self
    expect(board.move('w', {x: 4, y: 6}, {x: 4, y: 7})).toBeUndefined() // backwards
    expect(board.move('w', {x: 4, y: 6}, {x: 3, y: 5})).toBeUndefined() // attack with no enemy
    expect(board.move('w', {x: 4, y: 6}, {x: 4, y: 5})).toBe('e2-e3') // normal
    board.move('b', {x: 4, y: 1}, {x: 4, y: 2}) // black moves one forward
    board.move('w', {x: 4, y: 5}, {x: 4, y: 4}) // one forward
    board.move('b', {x: 4, y: 2}, {x: 4, y: 3}) // black moves one forward
    expect(board.move('w', {x: 4, y: 4}, {x: 4, y: 5})).toBeUndefined() // backwards
    expect(board.move('w', {x: 4, y: 4}, {x: 4, y: 3})).toBeUndefined() // into black on the same col
    // normal attack
    board.move('w', {x: 3, y: 6}, {x: 3, y: 5}) // one forward
    board.move('b', {x: 0, y: 1}, {x: 0, y: 2}) // black moves one forward
    board.move('w', {x: 3, y: 5}, {x: 3, y: 4}) // one forward
    expect(board.move('b', {x: 4, y: 3}, {x: 3, y: 4})).toBe('e5-d4') // attack!
  })

  test('2 step', () => {
    expect(board.move('w', {x: 4, y: 6}, {x: 4, y: 3})).toBeUndefined() // 3 step!
    expect(board.move('w', {x: 4, y: 6}, {x: 4, y: 4})).toBe('e2-e4') // 2 step
    board.move('b', {x: 3, y: 1}, {x: 3, y: 2}) // black moves pawn on column d 1 forward
    expect(board.move('w', {x: 4, y: 4}, {x: 4, y: 2})).toBeUndefined() // 2nd 2 step!
    expect(board.move('b', {x: 3, y: 2}, {x: 3, y: 4})).toBeUndefined() // 2 step from row 6!
    // TODO: only twostep if the tile inbetween is empty
  })

  test('en passent', () => {
    board.move('w', {x: 4, y: 6}, {x: 4, y: 4}) // moves 2 step forward
    board.move('b', {x: 0, y: 1}, {x: 0, y: 2}) // black moves whatever
    board.move('w', {x: 4, y: 4}, {x: 4, y: 3}) // moves 1 forward
    expect(board.move('b', {x: 3, y: 1}, {x: 3, y: 3})).toBe('d7-d5') // 2 step
    expect(board.move('w', {x: 4, y: 3}, {x: 5, y: 2})).toBeUndefined() // wrong way!!
    expect(board.move('w', {x: 4, y: 3}, {x: 3, y: 2})).toBe('e5-d6') // en passent!
    expect(board.getBoard()[3][3]).toBe('  ') // check that the black pawn is gone
  })
})
