console.log('hey')

// Electron
const { ipcRenderer, remote } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const himalaya = require('himalaya')
const cheerio 				= require('cheerio')
const moment 					= require('moment')
const domino 					= require('domino')
const { getMetadata }	= require('page-metadata-parser')
const Sentiment 			= require('sentiment')
const sentiment = new Sentiment()
const templates 			= require('../js/templates')
const extract 			= require('../js/extract')

// Storage
const Store = require('electron-store')
const store = new Store()

// jQuery
window.$ = window.jQuery = require('jquery')

const parentIndex = remote.getCurrentWindow().parentIndex
const index = remote.getCurrentWindow().index
const url = remote.getCurrentWindow().url

// Webview and CSS
const webview = document.querySelector('webview')
const css = `
  .hackmetricsHover {
    background: rgba(0, 0, 0, 0.95) !important;
    color: rgba(0, 0, 0, 0.95) !important;
    box-shadow: 0 0 0 5px rgba(0, 174, 239, 0.8) !important;
  }
  .hackmetricsHover *, .hackmetricsHover *:hover, .hackmetricsHover *:active, .hackmetricsHover *:focus {
    color: rgba(0, 0, 0, 0.95) !important
  }
  * {
    cursor: cell !important;
  }`
const editor_xpath = {
  'body_html': '',
  'section_class': '',
  'title': '',
  'url': '',
  'image': '',
  'link': ''
}

// Webview Ready
webview.addEventListener('dom-ready', function () {
  webview.insertCSS(css)
  setTimeout(() => {
    webview.send('run-hide-elements', {
      parentIndex: parentIndex,
      index: index
    })
  }, 250)
  // webview.openDevTools()
})

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

// Add
webview.addEventListener('ipc-message', function (event) {
  const htmlJSON = himalaya.parse(event.args[0].snippetHTML)
  const foundTexts = []
  const foundLinks = []
  editor_xpath.section_class = event.args[0].css
  editor_xpath.body_html = event.args[0].bodyHTML
  editor_xpath.section_xpath = event.args[0].section_xpath

  $('webview').hide()
  $('#nav-markup').attr('class', 'text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 text-white')
  $('#selectedDiv').val(`${event.args[0].css}`)
  $('#selectedCount').html(`${event.args[0].count}`)
  $('#selectedHTML').html(`<div id="outputHTML" class="p-3 text-sm">${event.args[0].snippetHTML}</div>`)

  console.log(htmlJSON[0])

  traverse(htmlJSON[0], (key, value, scope) => {
    if (value.content && value.content.trim() !== '') {
      foundTexts.push({
        "scope": `[${scope.concat(key).map(k => isNaN(k) ? `'${k}'` : k).join('][')}]`,
        "value": value.content.trim()
      })
    }
    else if (value.tagName === 'a' &&  value.attributes) {
      let a_link = ''
      value.attributes.forEach(function(item, index) {
        if (item.key === 'href') {
          console.log('found one', item.value)
          a_link = item.value
        }
      })
      if (a_link !== '') {
        foundLinks.push({
          "value": a_link
        })
      }
    }
  })

  console.log('foundLinks', foundLinks)

  $('#selectedMetaData tbody').html('')

  foundTexts.forEach(function(item) {
    let newData = []
    $('#outputHTML').find('*').each(function(i,element) {
      const el = $(element).text().trim()
      if (el === item.value) {
        let xpath = $(element).getPath()
        xpath = xpath.replace(`${$('#outputHTML').getPath()} > `, '')
        newData.push({
          "xpath": xpath,
          "content": item.value
        })
      }
    })
    if (newData.slice(-1)[0]) {
      $('#selectedMetaData tbody').append(`<tr>
        <td data-type='xpath' style='display: none'>${newData.slice(-1)[0].xpath}</td>
        <td class="border border-gray-700 px-4 py-2">
          <input type="radio" name="titleSet" class="mx-auto" />
        </td>
        <td class="border border-gray-700 px-4 py-2">${newData.slice(-1)[0].content}</td>
      </tr>`)
    }
  })

  foundLinks.forEach(function(item) {
    let newData = []
    $('#outputHTML').find('*').each(function(i,element) {
      const el = $(element).attr('href')
      if (el === item.value) {
        let xpath = $(element).getPath()
        xpath = xpath.replace(`${$('#outputHTML').getPath()} > `, '')
        newData.push({
          "xpath": xpath,
          "content": item.value
        })
      }
    })
    if (newData.slice(-1)[0]) {
      $('#selectedMetaDataLink tbody').append(`<tr>
        <td data-type='xpath' style='display: none'>${newData.slice(-1)[0].xpath}</td>
        <td class="border border-gray-700 px-4 py-2">
          <input type="radio" name="linkSet" class="mx-auto" />
        </td>
        <td class="border border-gray-700 px-4 py-2">${newData.slice(-1)[0].content}</td>
      </tr>`)
    }
  })

  $('#dataCollection').show()
})

$('#tab-link-easy').click(async function() {
  $('#tab-easy').show()
  $('#tab-advanced').hide()
})

$('#tab-link-advanced').click(async function() {
  $('#tab-easy').hide()
  $('#tab-advanced').show()
})

// Steps Nav
$('#nav-selector').click(async function() {
  $('webview').show()
  $('#dataCollection').hide()
  $('#dataPreview').hide()
})

$('#nav-markup').click(async function() {
  $('webview').hide()
  $('#dataCollection').show()
  $('#dataPreview').hide()
})

$('#nav-test-confirm').click(async function() {
  $('webview').hide()
  $('#dataCollection').hide()
  $('#dataPreview').show()
})

$('#webScrapeTest').click(async function() {
  $('#nav-test-confirm').attr('class', 'text-center block border border-blue-500 rounded py-2 px-4 bg-blue-500 text-white')
  $('#dataCollection').hide()
  $('#dataPreview').show()

  $('#selectedMetaData tbody tr').each(function() {
    const value = $(this).find('input[type="radio"]:checked').val()
    if (value) {
      editor_xpath[value] = $(this).find("td[data-type='xpath']").text()
    }
  })

  const $cheerio = cheerio.load(editor_xpath.body_html)
  $cheerio($('#selectedDiv').val()).each(async (index, element) => {
    const title = $cheerio(element).find(editor_xpath.title).text()
    const included_link = $cheerio(element).find(editor_xpath.link).attr('href')
    const image = await extract.meta_image(included_link)
    if (title !== '') {
      $('#dataPreview').append(templates.posts([{
        "title": title,
        "url": '',
        "included_link": included_link,
        "attached_image": image,
        "created_at": Date.now()
      }]))
    }
  })
})

const traverse = function(o, fn, scope = []) {
  for (let i in o) {
    fn.apply(this, [i, o[i], scope]);
    if (o[i] !== null && typeof o[i] === "object") {
      traverse(o[i], fn, scope.concat(i));
    }
  }
}
