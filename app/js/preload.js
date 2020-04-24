const { ipcRenderer } = require('electron')

ipcRenderer.on('sendbackhtml', (event, arg) => {
  const html = document.documentElement.innerHTML
  const url = window.location.href
  const data = {
    "html": html,
    "url": url
  }
  ipcRenderer.send('hereishtml', data)
})
