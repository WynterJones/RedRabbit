window.$ = window.jQuery = require('jquery')

// electron
const shell = require('electron').shell
const { ipcRenderer } = require('electron')

// Connect to Database - https://www.prisma.io/
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
prisma.connect()

// temp - remove soon
  const { Pool, Client } = require('pg')
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
// temp - remove soon

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

// Global
let source_url = ''
let community_id = 0

// Main Loop
setInterval(function () {
  monitor.spy()
}, 120000)

// Build Sidebar
db_requests.communities()

// Save Extracted Data
ipcRenderer.on('extracthtml', (event, html) => { extract.save(event, html) })

// Events
$(document).find('[data-fancybox="gallery"]').fancybox()
$(document).on('click', '.browser_link',     function (event) { events.open_browser_link(event, this) })
$(document).on('click', '.go-to-next-page',  function (event) { events.load_next_page(event, this) })
$(document).on('change', '#search',          function (event) { search.input_change(event, this) })
$(document).on('click', '.search-by-word',   function (event) { search.by_keyword(event, this) })
$(document).on('click', '.post-click',       function (event) { events.post(event, this) })
$(document).on('click', '#dashboard',        function (event) { dashboard.init(event, this) })
$(document).on('click', '#settings',         function (event) { events.settings(event, this) })
$(document).on('click', '#add-community',    function (event) { events.open_add_community(event, this) })
$(document).on('click', '#add-reddit-url',   function (event) { events.add_community(event, this) })
$(document).on('click', '#community_list a', function (event) { events.open_community(event, this) })
$(document).on('click', '.tab-link',         function (event) { events.open_tab(event, this) })
