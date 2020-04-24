'use strict'

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'monitor_reddit'
  }
})

const knex_queries = {

  create_tables: async () => {
    knex.schema.hasTable('posts').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('posts', function (t) {
          t.increments('id').primary()
          t.timestamps()
          t.integer('community_id')
          t.float('sentiment_score')
          t.string('title')
          t.string('url')
          t.string('attached_image')
          t.string('included_image')
          t.string('included_link')
          t.string('reddit_video')
        })
        console.log('Posts Table Created')
      }
      else {
        console.log('Posts Table Exists')
      }
    })

    knex.schema.hasTable('communities').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('communities', function (t) {
          t.increments('id').primary()
          t.string('name')
        })
        console.log('Communities Table Created')
      }
      else {
        console.log('Communities Table Exists')
      }
    })
  },

  posts: async () => {
    return knex('posts')
            .select(
              'id',
              'title',
              'url',
              'created_at',
              'attached_image',
              'included_image',
              'included_link',
              'reddit_video',
              'community_id',
              'sentiment_score'
            )
            .orderBy('created_at','desc')
  },

  posts_chart: async () => {
    return knex('posts')
            .select(knex.raw("date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1)"))
            .groupBy(knex.raw(1))
            .orderBy('date_trunc', 'asc')
  },

  posts_community_chart: async (community_id) => {
    const id = parseInt(community_id)
    return knex('posts')
            .select(knex.raw("date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1)"))
            .where('community_id', id)
            .groupBy(knex.raw(1))
            .orderBy('date_trunc', 'asc')
  },

  posts_for_dashboard: async () => {
    return knex('posts')
            .select(
              'title',
              'url',
              'created_at',
              'attached_image',
              'included_image',
              'included_link',
              'community_id',
              'sentiment_score'
            )
            .orderBy('created_at', 'desc')
  },

  post: async (post_id) => {
    const id = parseInt(post_id)
    return knex('posts')
            .select(
              'id',
              'title',
              'url',
              'created_at',
              'attached_image',
              'included_image',
              'included_link',
              'snippet',
              'reddit_video',
              'community_id',
              'sentiment_score'
            )
            .where('id', id)
  },

  create_post: async (title, url, attached_image, included_image, included_link, community_id, sentiment_score, reddit_video) => {
    knex('posts')
      .where('url', url)
      .then(function(rows) {
        if (rows.length === 0) {
          knex('posts').insert({
            title: title,
            url: url,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            attached_image: attached_image,
            included_image: included_image,
            included_link: included_link,
            reddit_video: reddit_video,
            community_id: parseInt(community_id),
            sentiment_score: parseFloat(sentiment_score)
          }).then(() => {})
        }
      })
  },

  posts_count: async (id) => {
    const posts = knex('posts')
    const count = await posts.count()
    return count[0].count
  },

  posts_by_community_id: async (community_id) => {
    let id = community_id
    if (!id) {
      id = parseInt($('#community_list a.active').attr('data-id'))
    }
    return knex('posts')
            .where('community_id', id)
            .orderBy('created_at', 'desc')
  },

  communities: async () => {
    return knex('communities')
            .select(
              'id',
              'name',
              'url',
              'website'
            )
            .orderBy('id', 'asc')
  },

  delete_community: async () => {
    const id = parseInt($('#community_list a.active').attr('data-id'))
    knex('communities').where('id', id).del()
    knex('posts').where('community_id', id).del()
    $(`#community_list a.active[data-id="${id}"]`).remove()
    $('#dashboard').trigger('click')
  },

  community: async (id) => {
    return knex('communities')
            .where('id', id)
  },

  create_community: async (name, url, website) => {
    knex('communities')
      .where('name', name)
      .then(function(rows) {
        if (rows.length === 0) {
          knex('communities').insert({
            name: name,
            url: url,
            website: website
          }).then(() => {
            db_requests.communities()
          })
        }
      })
  },

  communities_count: async () => {
    const communities = knex('communities')
    const count = await communities.count()
    return count[0].count
  },

  raw: async (sql_statement) => {
    return knex.raw(sql_statement)
  }

}

module.exports = knex_queries
