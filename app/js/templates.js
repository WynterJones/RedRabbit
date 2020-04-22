'use strict'

const templates = {

  posts: (data) => {
    let html = ''
    $.each(data, function(index, item) {
      let timestamp = ''
      let paddingRight = '0'
      if (item.created_at) {
        timestamp = `<span class="float-left text-sm mr-3">${moment(item.created_at).fromNow()}</span>`
      }
      let included_link = ''
      if (item.included_link && item.included_link != 'undefined') {
        included_link = `<a href="${item.included_link}" class="included-link browser_link truncate float-left text-sm" style="max-width: 70%"><i class="fas fa-link mr-1"></i> ${item.included_link}</a>`
      }
      let sentiment_emoji = 'fa-frown'
      if (item.sentiment_score > 0) {
        sentiment_emoji = "fa-grin-alt";
      } else if (item.sentiment_score === 0) {
        sentiment_emoji = "fa-meh";
      }
      let sentiment_score = `<span class="float-left mr-2 text-sm"><i class="fas ${sentiment_emoji}"></i> <span class="hidden">${item.sentiment_score}</span></span>`
      let attached_image = ''
      if (item.attached_image && item.attached_image != 'undefined') {
        attached_image = item.attached_image
        paddingRight = ''
      }
      else if (item.included_image && item.included_image != 'undefined') {
        attached_image = item.included_image
        paddingRight = ''
      }
      let snippet = ''
      if (item.snippet && item.snippet != '') {
        snippet = `<div class="mb-2 pr-8 text-gray-500">${item.snippet}</div>`
      }

      if (attached_image !== '') {
        html += `<div class="post-click hover-zoom hover:shadow w-full flex clearfix bg-gray-900 text-gray-600 block rounded mb-3 border border-gray-800 overflow-hidden">
          <div class="p-6 w-4/5">
            <a href="https://www.reddit.com${item.url}" style="max-width: 90%" class="font-headline text-2xl leading-snug text-gray-300 font-medium block mb-1">${item.title}</a>
            ${snippet}
            ${sentiment_score}
            ${timestamp}
            ${included_link}
          </div>
          <div class="h-auto w-48 relative w-1/5 bg-cover bg-left border-r border-gray-800 text-center overflow-hidden" style="background-image: url('${attached_image}')">
            <div class="shadow-image-overlay h-full"></div>
          </div>
        </div>`
      }
      else {
        html += `<div class="post-click hover-zoom hover:shadow bg-gray-900 clearfix text-gray-600 block p-6 rounded mb-3 border border-gray-800" style="padding-right: ${paddingRight}">
            <a href="https://www.reddit.com${item.url}" style="max-width: 90%" class="font-headline text-2xl leading-snug text-gray-300 font-medium block mb-1">${item.title}</a>
            ${snippet}
            ${sentiment_score}
            ${timestamp}
            ${included_link}
        </div>`
      }
    });
    return html;
  },

  small_posts: (data) => {
    let html = ''
    $.each(data, function(index, item) {
      let timestamp = ''
      let paddingRight = '0'
      html += `<div class="post-click hover-zoom bg-gray-900 clearfix text-gray-600 block p-3 rounded mb-3 border border-gray-800" style="padding-right: ${paddingRight}">
          <a href="https://www.reddit.com${item.url}" style="width: 90%" class="font-headline browser_link truncate text-gray-300 font-bold block mb-1">${item.title}</a>
          <span class="dashboard-open-community text-sm mr-3 bg-gray-900 rounded border border-gray-700 p-1" data-id="${item.community_id}">${item.community_id}</span>
          <span class="text-sm mr-3"><i class="far fa-calendar-alt mr-1"></i> ${moment(item.created_at).fromNow()}</span>
      </div>`
    });
    return html;
  },

  images: (data) => {
    let html = '<div id="photos">'
    $.each(data, function(index, item) {
      let attached_image = ''
      if (item.attached_image && item.attached_image !== '' && item.attached_image !== 'undefined') {
        attached_image = `<a data-fancybox="gallery" href="${item.attached_image}"><img src="${item.attached_image}" style="width: 100%" class="hover-zoom mb-2 rounded border border-gray-700" /></a>`
        html += `<div class="mb-3">
          ${attached_image}
        </div>`
      }
      else if (item.included_image && item.included_image !== '' && item.included_image !== 'undefined') {
        attached_image = `<a data-fancybox="gallery" href="${item.included_image}"><img src="${item.included_image}" style="width: 100%" class="hover-zoom mb-3 rounded border border-gray-700" /></a>`
        html += `<div class="mb-3">
          ${attached_image}
        </div>`
      }
    })
    return `${html}</div>`
  },

  videos: (data) => {
    let html = ''
    async function start(url, title, reddit_url) {
      if (url.includes('youtu.be/')) {
        let youtube_id = url.split('.be/')
        youtube_id = youtube_id[1]
        url = `https://www.youtube.com/watch?v=${youtube_id}`
      }
      const response = await fetch(url)
      const result = await response.text()
      const doc = domino.createWindow(result).document
      const metadata = getMetadata(doc, url)
      let video_html = ''
      if (metadata.title === 'YouTube') {
        video_html = `<div class="hover-zoom opacity-75 w-full p-6 bg-gray-900 text-gray-600 block rounded mb-3 border border-gray-800 overflow-hidden">
          <h3 class="font-headline  text-gray-300 font-bold block text-lg mb-1">Video Removed From YouTube</h3>
          <a href="https://www.reddit.com${reddit_url}" class="block w-full browser_link text-gray-300 block text-sm mb-1"><strong>Reddit Source:</strong> ${title}</a>
        </div>`
      } else if (metadata.title){
        video_html = `<div class="post-click  hover-zoom w-full flex bg-gray-900 text-gray-600 block rounded mb-3 border border-gray-800 overflow-hidden">
          <div class="p-6 w-4/5">
            <a href="${metadata.url}"  class="font-headline text-2xl browser_link text-gray-300  leading-snug font-medium block mb-1">${metadata.title}</a>
            <div style="width: 85%" class="text-sm text-gray-600">${metadata.description}</div>
          </div>
          <div class="h-auto w-48 relative w-1/5 bg-cover border-r border-gray-800 text-center overflow-hidden" style="background-image: url('${metadata.image}')">
            <div class="shadow-image-overlay h-full"></div>
            <a href="${metadata.url}" class="browser_link block h-full w-full"></a>
          </div>
        </div>`
      }
      $('#video-list').append(video_html)
    }

    $.each(data, function(index, item) {
      let included_link = ''
      html = `<div class="mb-3" id="video-list"></div>`
      if (item.included_link && item.included_link != 'undefined') {
        start(item.included_link, item.title, item.url)
      }
    })
    return html
  },

  videos_dashboard: (data) => {
    let html = ''
    async function start(url, title, reddit_url) {
      if (url.includes('youtu.be/')) {
        let youtube_id = url.split('.be/')
        youtube_id = youtube_id[1]
        url = `https://www.youtube.com/watch?v=${youtube_id}`
      }
      const response = await fetch(url)
      const result = await response.text()
      const doc = domino.createWindow(result).document
      const metadata = getMetadata(doc, url)
      let video_html = ''
      video_html = `<div class="post-click hover-zoom w-full flex bg-gray-900 text-gray-600 block rounded mb-3 border border-gray-800 overflow-hidden">
        <div class="h-auto w-32 w-1/5 bg-cover border-r border-gray-800 text-center overflow-hidden" style="background-image: url('${metadata.image}')"></div>
        <div class="p-6 py-3 w-4/5">
          <a href="${metadata.url}"  class="browser_link text-gray-300  leading-snug font-bold block mb-1">${metadata.title}</a>
          <div style="width: 85%" class="truncate text-sm mb-2 text-gray-600">${metadata.description}</div>
        </div>
      </div>`
      $('#dashboard-video-video-list').append(video_html)
    }

    $.each(data, function(index, item) {
      let included_link = ''
      html = `<div class="mb-3" id="dashboard-video-video-list"></div>`
      if (item.included_link && item.included_link != 'undefined') {
        start(item.included_link, item.title, item.url)
      }
    })
    return html
  }

}

module.exports = templates
