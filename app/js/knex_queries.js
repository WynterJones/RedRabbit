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
              'snippet',
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

  posts_community_chart: async (community_id) => {
    const id = parseInt(community_id)
    return knex('posts')
            .select(knex.raw("date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1)"))
            .where('community_id', id)
            .groupBy(knex.raw(1))
            .orderBy('date_trunc', 'asc')
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

  create_post: async (title, url, attached_image, included_image, included_link, snippet, community_id, sentiment_score, reddit_video) => {
    return knex('posts')
            .insert({
              title: title,
              url: url,
              created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              attached_image: attached_image,
              included_image: included_image,
              included_link: included_link,
              snippet: `${snippet}`,
              community_id: parseInt(community_id),
              reddit_video: `${reddit_video}`,
              sentiment_score: parseFloat(sentiment_score)
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
              'name'
            )
            .orderBy('id', 'asc')
  },

  delete_community: async () => {
    const id = parseInt($('#community_list a.active').attr('data-id'))
    await prisma.communities.delete({
      where: { id: id }
    })
    .catch(e => {})
    .finally(async () => {
      await prisma.posts.deleteMany({
        where: { community_id: id }
      })
      .catch(e => {})
      .finally(async () => {
        $(`#community_list a.active[data-id="${id}"]`).remove()
        $('#dashboard').trigger('click')

      })
    })

  },

  community: async (id) => {
    return knex('communities')
            .where('id', id)
  },

  create_community: async (name) => {
    return knex('communities')
            .insert({
              name: name
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
