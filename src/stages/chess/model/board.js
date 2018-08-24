export function createBoard () {
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

  function getBoard () {
    return board
  }
}
