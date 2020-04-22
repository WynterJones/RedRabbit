'use strict'

const tab = {

  open: (event, element) => {
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
      $('#loading-bar').hide()
      $('#nav').fadeIn()
      $(`.tab[data-tab="${tab}"]`).fadeIn()
    }
  },

}

module.exports = tab
