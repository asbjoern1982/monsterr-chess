/* globals $ */
import createClient from 'monsterr'

import html from './src/admin/client.html'
import './src/admin/client.css'

import {view} from './src/stages/chess/client/view'

let options = {
  canvasBackgroundColor: 'red',
  htmlContainerHeight: 0.23,
  // HTML is included in options for admin
  html
}

let events = {
  'board': (admin, board) => {
    view.drawBoard(admin, 'white', board)
    // console.log(payload)
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
let commands = {}

const admin = createClient({
  events,
  commands,
  options
  // no need to add stages to admin
})

// Button event handlers (if you need more you should probably put them in a separate file and import it here)
$('#admin-button-start').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('start')
})
$('#admin-button-next').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('next')
})
$('#admin-button-reset').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('reset')
})
$('#admin-button-csv').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('reqCSV')
})
