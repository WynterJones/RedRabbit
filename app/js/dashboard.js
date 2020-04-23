'use strict'

const dashboard = {

  init: async (event, element) => {
    var t0 = performance.now()
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#loading-bar').show()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')

    const allPosts = await prisma_query.posts_for_dashboard()
    const allPostsCount = await prisma_query.posts_count()
    const total = allPostsCount
    let video_data = []
    let image_data = []
    let count = 0
    let count_videos = 0
    $('#overalltotalRows').text(format_number()(total))
    let global_sentiment = []
    let word_list = {}

    // each post
    allPosts.forEach(function(item, index) {
      global_sentiment.push(parseInt(item.sentiment_score))
      if (count < 20 && item.attached_image && item.attached_image !== '' && item.attached_image !== 'undefined') {
        count++
        image_data.push(item)
      }
      if (item.included_link && item.included_link !== '' && item.included_link !== 'undefined') {
        if (count_videos < 5 && (item.included_link.includes('youtube') || item.included_link.includes('youtu.be') || item.included_link.includes('vimeo') || item.included_link.includes('banned.video') || item.included_link.includes('bitchute.com'))) {
          count_videos++
          video_data.push(item)
        }
      }
      let words = TextCleaner(item.title).stripHtml().condense().toLowerCase().removeApostrophes().removeStopWords().valueOf().split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/)
      for (var i in  words) {
        if (words[i].length > 1) {
          word_list[words[i]] ? word_list[words[i]]+=1 : word_list[words[i]]=1
        }
      }
    })
    calculate.sentiment(global_sentiment, 'dashboard-sentimentScore', 'dashboard-sentimentLabel')
    const posts_data = allPosts.splice(0, 5)
    $('#dashboard-posts').html(templates.small_posts(posts_data))
    $('.dashboard-open-community').each(function() {
      const this_id = $(this).attr('data-id')
      $(this).text($(`#community_list a[data-id="${this_id}"]`).text())
    })
    $('#dashboard-images').html(templates.images(image_data))
    $('#dashboard-videos').html(templates.videos_dashboard(video_data))
    $('#loading-bar').hide()
    $('#dashboard-tab').fadeIn()
    keyword.dashboard(word_list, allPosts, allPostsCount)
    charts.dates('dashboard-chart', 'chart-dashboard-postsperday')
    var t1 = performance.now();
    console.log("Call to 'dashboard.init()' took " + (t1 - t0) + " milliseconds.");
  }

}

module.exports = dashboard
