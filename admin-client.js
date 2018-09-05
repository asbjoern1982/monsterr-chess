import createClient from 'monsterr'
import html from './src/admin/client.html'
import './src/admin/client.css'
import {view} from './src/stages/chess/client/view'
import {LatencyModule} from './src/modules/LatencyModule'
import {NetworkModule} from './src/modules/NetworkModule'

let options = {
  canvasBackgroundColor: 'red',
  htmlContainerHeight: 0.5,
  // HTML is included in options for admin
  html
}

let events = {
  'board': (admin, board) => {
    let canvas = admin.getCanvas()
    let boardsize = Math.min(canvas.width, canvas.height)
    view.drawBoard(canvas, 'white', board, boardsize)
  },
  'resCSV': (admin, csv) => {
    let fileName = 'monsterr-chess_' + Date.now() + '.csv'

    let url = window.URL.createObjectURL(new Blob([csv], {type: 'text/csv'}))
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
LatencyModule.addAdminClientEvents(events)
NetworkModule.addAdminClientEvents(events)
let commands = {}

const admin = createClient({
  events,
  commands,
  options
  // no need to add stages to admin
})

// Button event handlers (if you need more you should probably put them in a separate file and import it here)
$('#admin-button-reset').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('redrawAdmin')
})
$('#admin-button-csv').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('reqCSV')
})

LatencyModule.setupClient(admin)
NetworkModule.setupClient(admin)
