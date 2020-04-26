'use strict'

const sentiment = new Sentiment()

const extract = {

  save: async (event, data) => {
    const $ = cheerio.load(data.html)
    if (data.url.includes('reddit.com')) {
      extract.reddit($)
    }
    else if (data.url.includes('twitter.com')) {
      extract.twitter($)
    }
  },

  reddit: ($) => {
    $('.Post').each(async (index, element) => {
      let included_image = $(element).find('[data-click-id="image"]').attr('style')
      if (included_image) {
        included_image = included_image.replace('background-image:url(', '').replace(');', '').replace(/border-color:.*?/g,"")
        let checkCSS = included_image.split('#')
        if (checkCSS[1]) {
          included_image = checkCSS[0]
        }
      }
      const title = $(element).find('a[data-click-id="body"]').first().text()
      const url = `https://reddit.com${$(element).find('a[data-click-id="body"]').attr('href')}`
      const attached_image = $(element).find('img.media-element, img.ImageBox-image').attr('src')
      const included_link = $(element).find('a.styled-outbound-link').attr('href')
      const score = extract.sentiment_score(title)
      let reddit_video = $(element).find('video').attr('poster')
      if ((!attached_image && !included_image) && included_link && included_link !== '' && included_link.includes('http')) {
        reddit_video = await extract.meta_image(included_link, title)
      }
      await database_query.create_post(title, url, attached_image, included_image, included_link, community_id, score, reddit_video)
    })
  },

  twitter: ($) => {
    $('.content').each(async (index, element) => {
      const title = $(element).find('.tweet-text').text()
      const url = `https://twitter.com${$(element).find('.tweet-timestamp.js-permalink.js-nav.js-tooltip').attr('href')}`
      let attached_image = $(element).find('.AdaptiveMedia-photoContainer.js-adaptive-photo').attr('data-image-url')
      const included_link = $(element).find('.twitter-timeline-link').attr('href')
      const score = extract.sentiment_score(title)
      if (!attached_image && included_link && included_link !== '' && included_link.includes('http')) {
        attached_image = await extract.meta_image(included_link)
      }
      await database_query.create_post(title, url, attached_image, '', included_link, community_id, score, '')
    })
  },

  sentiment_score: (title) => {
    let score = 0
    if (title) {
      score = sentiment.analyze(title).score
    }
    return score
  },

  meta_image: async (url) => {
    if (url) {
      if (url.includes('youtu.be/')) {
        let youtube_id = url.split('.be/')
        youtube_id = youtube_id[1]
        url = `https://www.youtube.com/watch?v=${youtube_id}`
      }
      const response = await fetch(url)
      const result = await response.text()
      const doc = domino.createWindow(result).document
      const metadata = getMetadata(doc, url)
      return metadata.image
    }
  }

}

module.exports = extract
