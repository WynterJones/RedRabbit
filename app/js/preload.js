console.log('preload.js loaded')

const { ipcRenderer } = require('electron')

ipcRenderer.on('sendbackhtml', (event, arg) => {
  let html = document.documentElement.innerHTML
  // const $ = cheerio.load(html)
  ipcRenderer.send('hereishtml', html)
  // $(html).find('._1HunhFR-0b-AYs0WG9mU_P.i2sTp1duDdXdwoKi1l8ED').trigger('click')
  // if ($(html).find('._1HunhFR-0b-AYs0WG9mU_P.i2sTp1duDdXdwoKi1l8ED')) {
  //   $(html).find('._1HunhFR-0b-AYs0WG9mU_P.i2sTp1duDdXdwoKi1l8ED').trigger('click')
  // } else {
  //   ipcRenderer.send('hereishtml', html)
  // }
})
