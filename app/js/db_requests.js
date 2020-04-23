'use strict'

const db_requests = {

  communities: async () => {
    const all_communities = await prisma_query.communities()
    $('#community_list').html('')
    all_communities.forEach(function(item, index) {
      $('#community_list').append(`<a href="#" data-name="${item.name}" data-id="${item.id}" class="block py-1 px-2 capitalize border border-gray-800">${item.name}</a>`)
    })
    $('#dashboard').trigger('click')
  },

  posts: async () => {
    const all_posts = await prisma_query.posts_by_community_id()
    if (all_posts.length > 0) {
      charts.dates('signal-chart', 'chart-signal-postsperday')
      $('#no-data').hide()
      $('#totalRows').text(format_number()(Object.keys(all_posts).length))
      $('#allPosts').html('')
      let global_sentiment = []
      all_posts.forEach(function(item, index) {
        global_sentiment.push(parseInt(item.sentiment_score))
      })
      const sentiment = calculate.sentiment(global_sentiment)
      calculate.sentiment(global_sentiment, 'sentimentScore', 'sentimentLabel')
      pagination.init('posts', all_posts, 15)
    } else {
      $('#no-data').show()
    }
  },

  images: async () => {
    const all_posts = await prisma_query.posts_by_community_id()
    let image_data = []
    all_posts.forEach(function(item, index) {
      if (item.attached_image && item.attached_image !== '' && item.attached_image !== 'undefined') {
        image_data.push(item)
      }
    })
    pagination.init('images', image_data, 50)
  },

  videos: async () => {
    const all_posts = await prisma_query.posts_by_community_id()
    let video_data = []
    all_posts.forEach(function(item, index) {
      if (item.included_link &&
        item.included_link !== '' &&
        item.included_link !== 'undefined' &&
        (item.included_link.includes('youtube') ||
        item.included_link.includes('youtu.be') ||
        item.included_link.includes('vimeo') ||
        item.included_link.includes('banned.video') ||
        item.included_link.includes('bitchute.com'))) {
          video_data.push(item)
      }
    })
    pagination.init('videos', video_data, 10)
  },

  search: async (search_query) => {
    const all_posts = await prisma_query.posts_by_community_id()
    const full_count = all_posts.length
    const search_all_posts = []
    search_query = search_query.toLowerCase()
    $('#allPosts').html('')
    all_posts.forEach(function(post) {
      if (post.title && post.title.toLowerCase().includes(search_query) ||
          post.snippet && post.snippet.toLowerCase().includes(search_query)) {
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
  }

}

module.exports = db_requests
