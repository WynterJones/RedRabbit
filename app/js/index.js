// Electron
const shell 					= require('electron').shell
const { ipcRenderer } = require('electron')

// jQuery
window.$ = window.jQuery = require('jquery')

// NPM (package.json)
const isDev 					= require('electron-is-dev')
const Chart 					= require('chart.js')
const moment 					= require('moment')
const cheerio 				= require('cheerio')
const { getMetadata }	= require('page-metadata-parser')
const domino 					= require('domino')
const format_number 	= require('format-number')
const TextCleaner 		= require('text-cleaner')
const Sentiment 			= require('sentiment')
const fancybox 				= require('@fancyapps/fancybox')
const Store 					= require('electron-store')
const store 					= new Store()

//  System
const layout 					= require('./js/layout')
const templates 			= require('./js/templates')
const calculate 			= require('./js/calculate')
const db_requests 		= require('./js/db_requests')
const database_query 	= require('./js/knex_queries')
const dashboard 			= require('./js/dashboard')
const charts 					= require('./js/charts')
const pagination 			= require('./js/pagination')
const keyword 				= require('./js/keyword')
const events 					= require('./js/events')
const search 					= require('./js/search')
const extract 				= require('./js/extract')
const monitor 				= require('./js/monitor')
const posts 					= require('./js/posts')
const community 			= require('./js/community')
const tab 						= require('./js/tab')
const settings 				= require('./js/settings')

// Global
let loop_time = 300000
let source_url = ''
let community_id = 0

// Dev
if (isDev) {
  require('devtron').install()
}

// Main Loop
setInterval(function () {
  monitor.spy()
}, loop_time)

// Layout
layout.load('header')
layout.load('sidebar')
layout.load('tab_nav')
layout.load('dashboard')
layout.load('settings')
layout.load('add_community')
layout.load('no_data')
layout.load('loading')
layout.load('tab/overview')
layout.load('tab/images')
layout.load('tab/videos')
layout.load('tab/analytics')

// IPC Listen and Save Extracted Data
ipcRenderer.on('extracthtml', (event, data) => { extract.save(event, data) })

// Event Listeners
$(document).find('[data-fancybox="gallery"]').fancybox()
$(document).on('click', '.browser_link',     function (event) { events.open_browser_link(event, this) })
$(document).on('click', '.tab-link',         function (event) { tab.open(event, this) })
$(document).on('change', '#search',          function (event) { search.input_change(event, this) })
$(document).on('click', '.search-by-word',   function (event) { search.by_keyword(event, this) })
$(document).on('click', '.post-click',       function (event) { posts.open(event, this) })
$(document).on('click', '.go-to-next-page',  function (event) { posts.next_page(event, this) })
$(document).on('click', '#dashboard',        function (event) { dashboard.init(event, this) })
$(document).on('click', '#settings',         function (event) { settings.open(event, this) })
$(document).on('click', '#add-community',    function (event) { community.add_new(event, this) })
$(document).on('click', '#add-reddit-url',   function (event) { community.save(event, this) })
$(document).on('click', '#community_list a', function (event) { community.open(event, this) })
$(document).on('click', '#delete-community', function (event) { database_query.delete_community() })
$(document).on('click', '#install-create-tables', function (event) { database_query.create_tables(event, this) })

// Build Sidebar
db_requests.communities()
