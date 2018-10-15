# monsterr-chess
Basic example game for the monsterr framework

This game uses very basic communication as it sends the complete gamestate on every move. Futher more this project illustrates a couple of other useful techniques.

## Setup

For starting the game automatical when 2 players has connected the root server.js file has the following event:
```javascript
[Events.CLIENT_CONNECTED] (server, clientId) {
  playerCount++
  if (playerCount === 2) {
    server.start()
  }
}
```
The stage-server.js file keeps the connected clients in an array `clients`

When a game has started the server needs to know when a client is ready to receive the boardstate and who is what color. Therefor when a client is fully loaded it sends a "clientReady" message to the server, the client.js in the gamestage has:
```javascript
setup: (client) => {
  client.send('clientReady')
}
```
The server keeps a count of amount of clients that have reported ready and when everyone is ready, it creates the board and randomize the order of the clients (clients[0] is white and goes first).

```javascript
'clientReady': (server, clientId) => {
  readyCount++
  if (readyCount === clients.length) {
    // randomize color and tell each client what color their are
    if (Math.random() < 0.5) {
      let tempClientId = clients[0]
      clients[0] = clients[1]
      clients[1] = tempClientId
    }
    server.send('color', 'white').toClient(clients[0])
    server.send('color', 'black').toClient(clients[1])

    // inform the clients that the game is ready and send the board
    let tempBoard = board.getBoard()
    server.send('board', tempBoard).toAll()
    server.send('board', tempBoard).toAdmin()
  }
}
```
## Communication
When a player has moved a piece on the board, the client sends the move to the player. The server then makes the move if it is valid and sends the new boardstate to all clients.

```javascript
let move = board.move(
  (clients[0] === clientId) ? 'w' : 'b',
  payload.from,
  payload.to
)
server.send('board', board.getBoard()).toAll()
if (move) {
  logger.log(move)
  let winner = board.winner()
  if (winner) {
    let winnertext = 'winner is ' + ((winner === 'w') ? 'white' : 'black')
    server.send('gameover', winnertext).toAll()
  }
}
```
