export function createView () {
  function drawBoard (client, board) {
    console.log('drawing!')
    client.getCanvas().backgroundColor = 'black'
  }

  return drawBoard
}
