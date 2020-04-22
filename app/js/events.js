'use strict'

const events = {

  open_browser_link: (event, element) => {
    event.preventDefault()
    event.stopPropagation()
    shell.openExternal($(element).attr('href'))
  },

  load_next_page: (event, element) => {
    event.preventDefault()
    $('.paginationjs-next').trigger('click')
    window.scrollTo(0, 0)
  },

  post: (event, element) => {
    event.preventDefault()
    if ($(element).attr('href')) {
      shell.openExternal($(element).attr('href'))
    }
    else {
      shell.openExternal($(element).find('a').first().attr('href'))
    }
  },

  settings: (event, element) => {
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#settings-tab').fadeIn()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
  },

  open_add_community: (event, element) => {
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#add-new-tab').fadeIn()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
    $('#redditURL').val('').select()
  },

  add_community: (event, element) => {
    event.preventDefault()
    let url = $('#redditURL').val()
    if (url && url !== '') {
      url = url.split('r/')
      url = url[1].split('/')
      if (url[0] && url[0] !== '') {
        let total = 0
        client.query("SELECT COUNT(*) FROM communities", function (err, result) {
          total = result.rows[0].count + 1
          console.log('add this url', url[0], total)
          pool.query(`INSERT INTO communities VALUES (${total}, '${url[0]}')`, function(err, result) {
            console.log(err, result)
            if (!err) {
              db_requests.communities()
            }
          })
        })
      }
    } else {
      console.log('errors')
    }
  },

  open_community: (event, element) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    $('#loading-bar').show()
    const name = $(element).attr('data-name')
    const id = $(element).attr('data-id')
    source_url = `https://www.reddit.com/r/${name}/new`
    client.query(`SELECT * FROM posts WHERE community_id = ${id} ORDER BY created_at DESC`, function (err, result) {
      let video_count = 0
      let image_count = 0
      result.rows.forEach(function(item, index) {
        if (item.included_link && item.included_link !== '' && item.included_link !== 'undefined') {
          if (item.included_link.includes('youtube')|| item.included_link.includes('youtu.be') || item.included_link.includes('vimeo') || item.included_link.includes('banned.video') || item.included_link.includes('bitchute.com')) {
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
    })
    $('header').show()
    $('#main_nav a').attr('class', 'block py-1 px-2 mb-1')
    $('#reddit-link').attr('href', source_url)
    $('#community-name').text(name)
    $('.tab-link').removeClass('disabled')
    $('#community_list a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'active block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('.tab-link[data-tab="overview"]').trigger('click')
  },

  open_tab: (event, element) => {
    event.preventDefault()
    const tab = $(element).attr('data-tab')
    if (!$(element).hasClass('disabled')) {
      $('.tab-link').each(function() {
        let disabled = ''
        if ($(this).hasClass('disabled')) {
          disabled = 'disabled'
        }
        $(this).attr('class', `${disabled} tab-link text-gray-500 py-4 px-6 block font-medium focus:outline-none`)
      })
      $(element).attr('class', 'active-tab tab-link py-4 px-6 block focus:outline-none text-blue-100  font-medium bg-blue-600')
      $('.tab').hide()
      if (tab === 'overview') {
        $('#search-info').hide()
        $('#search').val('')
        db_requests.posts()
      }
      else if (tab === 'images') {
        $('#images-data-container').html('<h4 class="text-gray-400 font-bold py-3 text-lg"><i class="fas fa-spinner fa-spin mr-1"></i> Loading...</h4>')
        db_requests.images()
      }
      else if (tab === 'videos') {
        $('#videos-data-container').html('<h4 class="text-gray-400 font-bold py-3 text-lg"><i class="fas fa-spinner fa-spin mr-1"></i> Loading...</h4>')
        db_requests.videos()
      }
      else if (tab === 'analytics') {
        $('#word-table').html('<h4 class="text-gray-400 font-bold py-3 text-lg"><i class="fas fa-spinner fa-spin mr-1"></i> Loading keyword data...</h4>')
        keyword.community()
      }
      if (tab !== 'overview') {
        $('#loading-bar').hide()
        $('#nav').fadeIn()
        $(`.tab[data-tab="${tab}"]`).fadeIn()
      }
    }
  },

}

module.exports = events
