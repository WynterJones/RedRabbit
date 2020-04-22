'use strict'

const posts = {

  next_page: (event, element) => {
    event.preventDefault()
    $('.paginationjs-next').trigger('click')
    window.scrollTo(0, 0)
  },

  open: (event, element) => {
    event.preventDefault()
    if ($(element).attr('href')) {
      shell.openExternal($(element).attr('href'))
    }
    else {
      shell.openExternal($(element).find('a').first().attr('href'))
    }
  },

}

module.exports = posts
