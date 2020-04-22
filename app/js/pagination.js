'use strict'

const paginationjs = require('paginationjs')

const pagination_setup = {

  init: (type, all_posts, pageSize) => {
    $(`#${type}-pagination-container`).pagination({
      dataSource: all_posts,
      pageSize: pageSize,
      callback: function(data, pagination) {
        let html = ''
        if (type === 'posts') {
          html = templates.posts(data)
        }
        else if (type === 'images') {
          html = templates.images(data)
        }
        else if (type === 'videos') {
          html = templates.videos(data)
        }
        $(`#${type}-data-container`).html(html)
        $('.paginationjs-prev').html('<a class="cursor-pointer"><i class="fas fa-chevron-left"></i></a>')
        $('.paginationjs-next').html('<a class="cursor-pointer"><i class="fas fa-chevron-right"></i></a>')
      }
    })
  }

}

module.exports = pagination_setup
