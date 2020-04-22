'use strict'

const calculate = {

  average: (list) => {
    return list.reduce((prev, curr) => prev + curr) / list.length;
  },

  sentiment: (global_sentiment, element_id, label_id) => {
    if (global_sentiment.length > -1) {
      const avg = calculate.average(global_sentiment)
      let emoji = 'frown'
      if (avg > 0) {
        emoji = "grin-alt";
      } else if (avg === 0 || avg === -0) {
        emoji = "meh";
      }
      $(`#${element_id}`).html(`<i class="fas fa-${emoji}"></i>`)
      $(`#${label_id}`).html(`Avg. Sentiment <span class="opacity-50">(${avg.toFixed(0)})</span>`)
    }
  }

}

module.exports = calculate
