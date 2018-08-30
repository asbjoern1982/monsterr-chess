import Chart from '/assets/Chart.js'

let colors = [
  'rgb(100, 255, 255)',
  'rgb(255, 255, 100)',
  'rgb(255, 100, 255)',
  'rgb(100, 100, 255)',
  'rgb(255, 100, 100)',
  'rgb(100, 255, 255)',
  'rgb(255, 0, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 0, 255)',
  'rgb(255, 0, 255)'
]

let createLatencyGraph = (admin) => {
  // build latency graph
  // known problems:
  // - when a client disconnects it is still in the array
  // - the scale is sometimes off, either too small to fit the data or way too large, might have been a higher point not that long canvasBackgroundColor
  // - animation is not flued, it should move from right to left
  // - possible a save-button to save a picture of the graph to troubleshoot later, either case, a timestamp would be nice
  let ctx = $('#latencygraph')
  let chart = new Chart(ctx, {
    type: 'line', // The type of chart we want to create
    data: {
      labels: ['0s', '5s', '10s', '15s', '20s', '25s', '30s', '35s', '40s', '45s', '50s', '55s'],
      datasets: []
    },
    options: {
      responsive: true,
      animation: {
        duration: 0, // faster animations
        easing: 'linear'
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0 // makes the y-axes start at 0
          }
        }]
      }
    } // Configuration options go here
  })
  return chart
}

let startLatencyListener = (admin) => {
  admin.sendCommand('latencyUpdate')
  setInterval(() => admin.sendCommand('latencyUpdate'), 5000)
}

let latencyClientCommand = {
  'latencyUpdate': (admin, latencies) => {
    let dataset = []
    for (let p in latencies) {
      let color = colors.pop()
      // if the color list is empty, use a default color
      if (!color) {
        color = 'rgb(0, 0, 0)'
      }
      dataset.push({
        label: p,
        borderColor: color,
        data: latencies[p].data.reverse()
      })
    }
    // the problem is that the graph is not moving, but each datapoints position is shifted
    /* if (chart.data.datasets.count > 6) {
      chart.data.datasets.pop()
    }
    chart.data.datasets.push(dataset[0]) */
    chart.data.datasets = dataset
    chart.update()
  }
}

let latencyServerCommand = {
  'latencyUpdate': (server) => {
    server.send('latencyUpdate', server.getLatencies()).toAdmin()
  }
}
export const latencyGraph = createLatencyGraph()
