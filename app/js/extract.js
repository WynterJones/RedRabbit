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
      if (title !== '' && url !== '') {
        await prisma_query.create_post(title, url, attached_image, included_image, included_link, snippet, community_id, score)
        // pool.query(`INSERT INTO posts (title, url, created_at, attached_image, included_image, included_link, snippet, community_id, sentiment_score)
        // VALUES ('${title}', '${url}', to_timestamp(${Date.now()} / 1000.0), '${attached_image}', '${included_image}', '${included_link}', '${snippet}', ${community_id}, ${score})`, function(err, result) {})
      }
    })
  }


}

module.exports = extract
