'use strict'

const charts = {

  dates: async (chart_id, chart_postsperday) => {
    let chart_labels = []
    let chart_data = []
    let sql_statement = ''
    if (chart_id === 'dashboard-chart') {
      sql_statement = `SELECT created_at, count(1) FROM posts GROUP BY 1 ORDER BY created_at ASC`
    }
    else {
      sql_statement = `SELECT created_at, count(1) FROM posts WHERE community_id = ${$('#community_list a.active').attr('data-id')} GROUP BY 1 ORDER BY created_at ASC`
    }
    const date_group = await prisma_query.raw(sql_statement)
    if (date_group.length > 0) {
      date_group.forEach(function(item, index) {
        if (item.created_at) {
          chart_labels.push(`${moment(item.created_at).format('MMM. Do')}`)
          chart_data.push(parseInt(item.count))
        }
      })
      $(`#${chart_postsperday}`).text(format_number()(calculate.average(chart_data).toFixed(0)))
      $(`#${chart_id}`).html(`<canvas id="chartjs-${chart_id}" style="width: 100%;height: 100px"></canvas>`)
      const ctx = document.getElementById(`chartjs-${chart_id}`).getContext("2d")
      var gradientFill = ctx.createLinearGradient(0,0,0,70)
      gradientFill.addColorStop(0, "rgba(19, 23, 32, 1.000)")
      gradientFill.addColorStop(1, "rgba(26, 32, 44, 1.000)")
      Chart.defaults.scale.gridLines.display = false
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
        labels: chart_labels,
        datasets: [{
          label: '# of Posts',
          data: chart_data,
          backgroundColor: gradientFill,
          borderColor: ['#718096'],
          pointColor: [ '#718096'],
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: '#718096'
        }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 5
            }
          },
          animation: {
            easing: "linear",
            duration: 300
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                display: false
              }
            }],
            xAxes: [{
              ticks: {
                display: true,
                fontColor: '#718096'
              }
            }]
          }
        }
      })
    }
  },

  dashboard_keywords: (chart_data, chart_labels) => {
    $(`#dashboard-keyword-chart`).html(`<canvas id="chartjs-dashboard-keyword-chart" style="width: 100%;height: 200px"></canvas>`)
    const ctx = document.getElementById(`chartjs-dashboard-keyword-chart`).getContext("2d")
    Chart.defaults.scale.gridLines.display = false
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
      labels: chart_labels,
      datasets: [{
        label: '# of Posts',
        data: chart_data,
        backgroundColor: ['#cbd5e0', '#a0aec0', '#718096', '#4a5568', '#2d3748', '#2d3748'],
        borderColor: ['#cbd5e0', '#a0aec0', '#718096', '#4a5568', '#2d3748', '#2d3748'],
        borderWidth: 1
      }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5
          }
        },
        animation: {
          easing: "linear",
          duration: 300
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              fontColor: '#718096'
            }
          }]
        }
      }
    })
  }

}

module.exports = charts
