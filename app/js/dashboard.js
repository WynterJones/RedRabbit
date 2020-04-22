'use strict'

const dashboard = {

  init: (event, element) => {
    event.preventDefault()
    $('.tab, header, #nav').hide()
    $('#loading-bar').show()
    $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
    $(element).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
    $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')

    async function init() {
      const allPosts = await prisma.posts.findMany()
      const allPostsCount = await prisma.posts.count()
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
        let words = TextCleaner(`${item.title} ${item.snippet}`).stripHtml().condense().toLowerCase().removeApostrophes().removeStopWords().valueOf().split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/)
        for (var i in  words) {
          if (words[i].length > 1) {
            word_list[words[i]] ? word_list[words[i]]+=1 : word_list[words[i]]=1
          }
        }
      })

      if (global_sentiment.length > -1) {
        const avg = calculate.average(global_sentiment)
        let sentiment_emoji = 'fa-frown'
        if (avg > 0) {
          sentiment_emoji = "fa-grin-alt";
        } else if (avg === 0 || avg === -0) {
          sentiment_emoji = "fa-meh";
        }
        $('#dashboard-sentimentScore').html(`<i class="far ${sentiment_emoji}"></i>`)
        $('#dashboard-sentimentLabel').html(`Avg. Sentiment <span class="hidden">${avg.toFixed(0)}</span>`)
      }
      const posts_data = allPosts.splice(0, 5)
      $('#dashboard-posts').html(templates.small_posts(posts_data))
      $('.dashboard-open-community').each(function() {
        const this_id = $(this).attr('data-id')
        $(this).text($(`#community_list a[data-id="${this_id}"]`).text())
      })
      $('#dashboard-images').html(templates.images(image_data))
      $('#dashboard-videos').html(templates.videos_dashboard(video_data))

      keyword.dashboard(word_list, allPosts, allPostsCount)
      $('#loading-bar').hide()
      $('#dashboard-tab').fadeIn()
      charts.dates('dashboard-chart', 'chart-dashboard-postsperday')
    }
    init().catch(e => { throw e })
  }

}

module.exports = dashboard
