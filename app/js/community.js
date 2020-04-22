'use strict'

const community = {

  add_new: (event, element) => {
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#add-new-tab').show()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
    $('#redditURL').val('').select()
  },

  save: async (event, element) => {
    event.preventDefault()
    let url = $('#redditURL').val()
    if (url && url !== '') {
      url = url.split('r/')
      url = url[1].split('/')
      if (url[0] && url[0] !== '') {
        await prisma_query.create_community(url[0])
        db_requests.communities()
      }
    } else {
      Alert('No Url...')
    }
  },

  open: async (event, element) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    $('#nav, .tab').hide()
    $('#loading-bar').show()
    const name = $(element).attr('data-name')
    const id = $(element).attr('data-id')
    source_url = `https://www.reddit.com/r/${name}/new`
    const all_posts = await prisma_query.posts_by_community_id(id)
    let video_count = 0
    let image_count = 0
    all_posts.forEach(function(item, index) {
      if (item.included_link && item.included_link !== '' && item.included_link !== 'undefined') {
        if (item.included_link.includes('youtube')||
            item.included_link.includes('youtu.be') ||
            item.included_link.includes('vimeo') ||
            item.included_link.includes('banned.video') ||
            item.included_link.includes('bitchute.com')) {
          video_count++
        }
      }
      if (item.attached_image && item.attached_image !== '' && item.attached_image !== 'undefined') {
        image_count++
      }
    })
    if (video_count !== 0) {
      $('#videos-total').text(format_number()(video_count))
    } else {
      $('#videos-total').text('0')
      $('#videos-total').parent().addClass('disabled')
    }
    if (image_count !== 0) {
      $('#images-total').text(format_number()(image_count))
    } else {
      $('#images-total').text('0')
      $('#images-total').parent().addClass('disabled')
    }
    $('#main_nav a').attr('class', 'block py-1 px-2 mb-1')
    $('#reddit-link').attr('href', source_url)
    $('#community-name').text(name)
    $('.tab-link').removeClass('disabled')
    $('#community_list a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'active block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#header').show()
    $('.tab-link[data-tab="overview"]').trigger('click')
  },

}

module.exports = community
