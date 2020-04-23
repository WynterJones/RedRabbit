'use strict'

const extract = {

  save: async (event, html) => {
    const $ = cheerio.load(html)
    $('.Post').each(async (i, element) => {
      let included_image = $(element).find('[data-click-id="image"]').attr('style')
      if (included_image) {
        included_image = included_image.replace('background-image:url(', '').replace(');', '').replace(/border-color:.*?/g,"")
        let checkCSS = included_image.split('#')
        if (checkCSS[1]) {
          included_image = checkCSS[0]
        }
      }
      const title = $(element).find('a[data-click-id="body"]').first().text()
      const url = $(element).find('a[data-click-id="body"]').attr('href')
      const attached_image = $(element).find('img.media-element, img.ImageBox-image').attr('src')
      const included_link = $(element).find('a.styled-outbound-link').attr('href')
      const snippet = $(element).find('[data-click-id="text"]').text()
      const sentiment = new Sentiment()
      const score = sentiment.analyze(`${title} ${snippet}`).score
      let reddit_video = ''
      if ($(element).find('video')) {
        reddit_video = $(element).find('video source').attr('src')
        fetch(`https://www.reddit.com/${url}.json`, { method: "Get" })
          .then(res => res.json())
          .then(async (json) => {
            reddit_video = ''
            if (json[0]) {
              const media_url = json[0].data.children[0].data.crosspost_parent_list[0].secure_media.reddit_video.scrubber_media_url
              if (media_url) {
                reddit_video = media_url
              }
            }
            await prisma_query.create_post(title, url, attached_image, included_image, included_link, snippet, community_id, score, reddit_video)
          })
      } else {
        if (title !== '' && url !== '') {
          await prisma_query.create_post(title, url, attached_image, included_image, included_link, snippet, community_id, score, reddit_video)
        }
      }

    })
  }

}

module.exports = extract
