window.$ = window.jQuery = require('jquery')

// electron
const shell = require('electron').shell
const { ipcRenderer } = require('electron')
const { Pool, Client } = require('pg')

// npm
const Chart = require('chart.js')
const moment = require('moment')
const cheerio = require('cheerio')
const pagination = require('paginationjs')
const {getMetadata} = require('page-metadata-parser')
const domino = require('domino')
const format_number = require('format-number')
const TextCleaner = require('text-cleaner')
const Sentiment = require('sentiment')
const fancybox = require("@fancyapps/fancybox")

// local js
const templates = require('./js/templates')
const calculate = require('./js/calculate')
const db_requests = require('./js/db_requests')
let source_url = ''
let community_id = 0

$(document).find('[data-fancybox="gallery"]').fancybox({
  // Options will go here
});

const client = new Client({
  user: '',
  password: '',
  host: 'localhost',
  database: 'monitor_reddit',
  port: 5432,
})
const pool = new Pool({
  user: '',
  password: '',
  host: 'localhost',
  database: 'monitor_reddit',
  port: 5432,
})
client.connect()

// open link in browser
$(document).on('click', '.browser_link', function(event) {
  event.preventDefault()
  event.stopPropagation()
  shell.openExternal($(this).attr('href'))
})

// search
$(document).on('change', '#search', function(event) {
  event.preventDefault()
  const search_term = $(this).val()
  if (search_term) {
    $('#search-info').show()
    db_requests.search(search_term)
  } else {
    $('#search-info').hide()
    db_requests.posts()
  }
})

// search by frequent word
$(document).on('click', '.search-by-word', function(event) {
  event.preventDefault()
  $('.tab-link[data-tab="overview"]').trigger('click')
  $('#search').val($(this).text()).trigger('change')
})

// pagination load more
$(document).on('click', '.go-to-next-page', function(event) {
  event.preventDefault()
  $('.paginationjs-next').trigger('click')
  window.scrollTo(0, 0)
})

// video click
$(document).on('click', '.post-click', function(event) {
  event.preventDefault()
  if ($(this).attr('href')) {
    shell.openExternal($(this).attr('href'))
  }
  else {
    shell.openExternal($(this).find('a').first().attr('href'))
  }
})

// open dashboard
$(document).on('click', '#dashboard', function(event) {
  event.preventDefault()
  $('.tab, header, #nav').hide()
  $('#dashboard-tab').show()
  $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
  $(this).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
  $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
  db_requests.setup_chart('dashboard-chart', 'chart-dashboard-postsperday')
  client.query("SELECT COUNT(*) FROM posts", function (err, result) {
    total = result.rows[0].count
    $('#overalltotalRows').text(format_number()(total))
    let global_sentiment = []
    result.rows.forEach(function(item, index) {
      global_sentiment.push(parseInt(item.sentiment_score))
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
  })
  client.query(`SELECT pg_size_pretty( pg_total_relation_size('posts') )`, function(err, result) {
    $('#dashboard-disk-usage').text(result.rows[0].pg_size_pretty)
  })
  client.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 150', function (err, result) {
    let video_data = []
    let image_data = []
    let count = 0
    let count_videos = 0
    result.rows.forEach(function(item, index) {
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
    })
    const posts_data = result.rows.splice(0, 5)
    $('#dashboard-posts').html(templates.small_posts(posts_data))
    $('.dashboard-open-community').each(function() {
      const this_id = $(this).attr('data-id')
      $(this).text($(`#community_list a[data-id="${this_id}"]`).text())
    })
    $('#dashboard-images').html(templates.images(image_data))
    $('#dashboard-videos').html(templates.videos_dashboard(video_data))
    db_requests.dashboard_analyze()
  })
})

// open settings
$(document).on('click', '#settings', function(event) {
  event.preventDefault()
  $('.tab, header, #nav').hide()
  $('#settings-tab').show()
  $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
  $(this).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
  $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
})

// open add new
$(document).on('click', '#add-community', function(event) {
  event.preventDefault()
  $('.tab, header, #nav').hide()
  $('#add-new-tab').show()
  $('#main_nav a').attr('class', 'block py-1 px-2 capitalize border border-gray-800')
  $(this).attr('class', 'block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
  $('#community_list a.active').attr('class','block py-1 px-2 capitalize border border-gray-800')
  $('#redditURL').val('').select()
})

// add reddit url
$(document).on('click', '#add-reddit-url', function(event) {
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
})

// communities
$(document).on('click', '#community_list a', function(event) {
  event.preventDefault()
  window.scrollTo(0, 0)
  const name = $(this).attr('data-name')
  const id = $(this).attr('data-id')
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
  $(this).attr('class', 'active block py-1 px-2 rounded border-gray-700 border text-gray-300 bg-gray-900 capitalize')
  $('.tab-link[data-tab="overview"]').trigger('click')
})

// open tabs
$(document).on('click', '.tab-link', function(event) {
  event.preventDefault()
  const tab = $(this).attr('data-tab')
  if (!$(this).hasClass('disabled')) {
    $('.tab-link').each(function() {
      let disabled = ''
      if ($(this).hasClass('disabled')) {
        disabled = 'disabled'
      }
      $(this).attr('class', `${disabled} tab-link text-gray-500 py-4 px-6 block font-medium focus:outline-none`)
    })
    $(this).attr('class', 'active-tab tab-link py-4 px-6 block focus:outline-none text-blue-100  font-medium bg-blue-600')
    $('.tab').hide()
    $(`.tab[data-tab="${tab}"]`).show()
    if (tab === 'images') {
      db_requests.images()
    }
    if (tab === 'videos') {
      db_requests.videos()
    }
    if (tab === 'overview') {
      $('#search-info').hide()
      $('#search').val('')
      db_requests.posts()
      db_requests.setup_chart('signal-chart', 'chart-signal-postsperday')
    }
    if (tab === 'analytics') {
      db_requests.analyze()
    }
    if (tab === 'settings') {
      db_requests.settings()
    }
  }
})

// save to database
ipcRenderer.on('extracthtml', (event, html) => {
  const $ = cheerio.load(html)
  $('.Post').each((i, element) => {
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
    if ($(element).find('a[data-click-id="body"]').text() !== '') {
      pool.query(`INSERT INTO posts (title, url, created_at, attached_image, included_image, included_link, snippet, community_id, sentiment_score)
      VALUES ('${title}', '${url}', to_timestamp(${Date.now()} / 1000.0), '${attached_image}', '${included_image}', '${included_link}', '${snippet}', ${community_id}, ${score})`, function(err, result) {})
    }
  })
})

// Build sidebar
db_requests.communities()

// loop
setInterval(function () {
  runSpy()
}, 300000)


function runSpy() {
  $('#community_list a').each(function(index, element) {
    setTimeout(() => {
      $('#community_list a').find('i').remove()
      $('#community_list a').removeClass('actively_checked')
      community_id = $(this).attr('data-id')
      $(this).append('<i class="fas fa-spinner float-right fa-spin opacity-50" style="margin-top:3px"></i>')
      let url = `https://www.reddit.com/r/${$(this).attr('data-name')}/new`
      ipcRenderer.send('scrapeurl', url)
    }, index * 4000)
  })
  setTimeout(() => {
    $('#community_list a').find('i').remove()
    $('#community_list a').removeClass('actively_checked')
  }, parseInt($('#community_list a').length) * 4000)
}
