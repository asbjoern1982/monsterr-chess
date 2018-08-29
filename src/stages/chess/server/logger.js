function createLogger () {
  let moves = []
  function log (move) {
    moves.push(move)
  }

  function exportToString () {
    let output = ''
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) { // if it is whites turn, add a number to the front of the line
        if (i > 0) {
          output += '\n'
        }
        output += Math.floor(1 + i / 2) + '. ' + moves[i]
      } else {
        output += ' ' + moves[i]
      }
    }
    return output
  }

  function exportToCSV () {
    // join the array with a "," between each element
    return moves.join(',')
  }

  return {
    log,
    exportToString,
    exportToCSV
  }
}

export const logger = createLogger()
