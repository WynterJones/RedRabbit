'use strict'

const search = {

  search: async (search_query) => {
    const all_posts = await database_query.posts_by_community_id()
    const full_count = all_posts.length
    const search_all_posts = []
    search_query = search_query.toLowerCase()
    $('#allPosts').html('')
    all_posts.forEach(function(post) {
      if (post.title && post.title.toLowerCase().includes(search_query) || post.snippet && post.snippet.toLowerCase().includes(search_query)) {
        search_all_posts.push(post)
      }
    })
    if (search_all_posts) {
      const search_all_posts_count = search_all_posts.length
      const percentage = (search_all_posts_count * 100) / full_count
      $('#search-count').text(format_number()(search_all_posts_count))
      $("#search-percent").text( percentage.toFixed(2) + '%')
      pagination.init('posts', search_all_posts, 15)
    }
  },

  input_change: (event, element) => {
    event.preventDefault()
    const search_term = $(element).val()
    if (search_term) {
      $('#search-info').show()
      search.search(search_term)
    } else {
      $('#search-info').hide()
      db_requests.posts()
    }
  },

  by_keyword: (event, element) => {
    event.preventDefault()
    $('.tab-link[data-tab="overview"]').trigger('click')
    $('#search').val($(element).text()).trigger('change')
  }

}

module.exports = search
