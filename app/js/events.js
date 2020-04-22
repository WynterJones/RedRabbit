'use strict'

const events = {

  open_browser_link: (event, element) => {
    event.preventDefault()
    event.stopPropagation()
    shell.openExternal($(element).attr('href'))
  },

  settings: (event, element) => {
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#settings-tab').show()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
  }
  
}

module.exports = events
