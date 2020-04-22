window.$ = window.jQuery = require('jquery')

// Electron
const shell = require('electron').shell
const { ipcRenderer } = require('electron')

// Connect to Database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// npm
const Chart = require('chart.js')
const moment = require('moment')
const cheerio = require('cheerio')
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
const dashboard = require('./js/dashboard')
const charts = require('./js/charts')
const pagination = require('./js/pagination')
const prisma_query = require('./js/prisma_queries')
const keyword = require('./js/keyword')
const events = require('./js/events')
const search = require('./js/search')
const extract = require('./js/extract')
const monitor = require('./js/monitor')
const posts = require('./js/posts')
const community = require('./js/community')
const tab = require('./js/tab')
const settings = require('./js/settings')

// Global
let loop_time = 120000
let source_url = ''
let community_id = 0

// Main Loop
setInterval(function () {
  monitor.spy()
}, loop_time)

// Build Sidebar
db_requests.communities()

// Save Extracted Data
ipcRenderer.on('extracthtml', (event, html) => { extract.save(event, html) })

// Events
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
