// Select Elements to Hide

const { ipcRenderer } = require('electron')

// Storage
const Store = require('electron-store')
const store = new Store()

// ipcRenderer.on('unhide-element', (event, response) => {
//   if (!window.jQuery) { window.$ = window.jQuery = require('jquery') }
//
//   if ($(response).length > -1) {
//     $(response).show()
//   }
// })
//
// ipcRenderer.on('run-hide-elements', (event, response) => {
//   if (!window.jQuery) { window.$ = window.jQuery = require('jquery') }
//
//   if ($(response).length > -1) {
//     const currentCollections = store.get('collections')
//     const currentylyHidden = currentCollections[response.parentIndex].websites[response.index].hiddenCSS
//     for (var i = 0; i < currentylyHidden.length; i++) {
//       $(currentylyHidden[i]).hide()
//     }
//   }
// })

window.onload = function () {
  if (!window.jQuery) {
    window.$ = window.jQuery = require('jquery')
  }

  jQuery.fn.extend({
    getPath: function () {
      const pathes = []
      this.each(function (index, element) {
        let path = ''
        let $node = jQuery(element)
        while ($node.length) {
          let realNode = $node.get(0)
          let name = realNode.localName
          if (!name) { break }
          name = name.toLowerCase()
          const parent = $node.parent()
          const sameTagSiblings = parent.children(name)
          if (sameTagSiblings.length > 1) {
            const allSiblings = parent.children()
            const index = allSiblings.index(realNode) + 1
            if (index > 0) { name += ':nth-child(' + index + ')' }
          }
          path = name + (path ? ' > ' + path : '')
          $node = parent
        }
        pathes.push(path)
      })
      return pathes.join(',')
    }
  })

  document.onmouseover = function (e) {
    const el = e.target
    if (el.nodeName !== 'HTML' && el.nodeName !== 'BODY') {
      el.style.webkitTransition = '0.6s'
      el.classList.add('hackmetricsHover')
    }
  }

  document.onmousedown = function (e) {
    e.preventDefault()
    e.stopPropagation()
    const el = e.target
    if (el.nodeName !== 'HTML' && el.nodeName !== 'BODY') {
      el.classList.remove('hackmetricsHover')
      let classNames = ''
      Object.values(el.classList).forEach(function(item, index) {
        classNames += `.${item}`
      })
      $(el).find('style').remove()
      const count = $(document).find(classNames).length
      ipcRenderer.sendToHost('xPath', {
        css: classNames,
        count: count,
        snippetHTML: el.outerHTML,
        section_xpath: $(el).getPath(),
        bodyHTML: `<html>${$('html').html()}</html>`,
        nodeName: el.nodeName
      })
    }
    return false
  }

  document.onmouseout = function (e) {
    const el = e.target
    el.style.webkitTransition = '0.6s'
    el.classList.remove('hackmetricsHover')
  }

  document.onclick = function (e) {
    e.preventDefault()
    e.stopPropagation()
    console.log('hey')
    return false
  }
}
