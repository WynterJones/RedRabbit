'use strict'

const fs = require('fs')

const layout = {

  load: async (filename) => {
    const html = await fs.readFileSync(`./app/layout/${filename}.html`, 'utf8')
    $('#app').append(html)
  }
}

module.exports = layout
