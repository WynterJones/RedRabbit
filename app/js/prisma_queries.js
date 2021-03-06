'use strict'

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
prisma.connect()

const prisma_queries = {

  posts: async () => {
    return await prisma.posts.findMany({
      select: {
        title: true,
        url: true,
        created_at: true,
        attached_image: true,
        included_image: true,
        included_link: true,
        snippet: true,
        reddit_video: true,
        community_id: true,
        sentiment_score: true
      },
      orderBy: {
        created_at: "desc"
      }
    })
    .catch(e => {})
  },

  posts_chart: async () => {
    return await prisma.raw("select date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1) from posts group by 1 order by date_trunc ASC")
  },

  posts_for_dashboard: async () => {
    return await prisma.posts.findMany({
      select: {
        title: true,
        url: true,
        created_at: true,
        community_id: true,
        attached_image: true,
        included_link: true,
        sentiment_score: true
      },
      orderBy: {
        created_at: "desc"
      }
    })
    .catch(e => {})
  },

  posts_community_chart: async (community_id) => {
    return await prisma.raw(`select date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1) from posts where community_id = ${parseInt(community_id)} group by 1 order by date_trunc ASC`)
  },

  post: async (id) => {
    return await prisma.posts.findOne({
      where: {
        id: parseInt(id)
      }
    })
    .catch(e => {})
  },

  create_post: async (title, url, attached_image, included_image, included_link, snippet, community_id, sentiment_score, reddit_video) => {
    return await prisma.posts.create({
        data: {
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
        }
      })
      .catch(e => {})
  },

  posts_count: async (id) => {
    return await prisma.posts.count()
  },

  posts_by_community_id: async (id) => {
    if (!id) {
      id = $('#community_list a.active').attr('data-id')
    }
    return await prisma.posts.findMany({
      where: {
        community_id: parseInt(id)
      },
      orderBy: {
        created_at: "desc"
      }
    })
    .catch(e => {})
  },

  communities: async () => {
    return await prisma.communities.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        id: "asc"
      }
    })
    .catch(e => {})
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
    return await prisma.communities.findOne({
      where: {
        id: parseInt(id)
      }
    })
    .catch(e => {})
  },

  create_community: async (name) => {
    return await prisma.communities.create({
        data: {
          name: `${name}`
        }
      })
      .catch(e => {})
  },

  communities_count: async () => {
    return await prisma.communities.count()
  },

  raw: async (sql_statement) => {
    // date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1)
    // prisma.raw("select date_trunc('day', to_date(created_at,'YYYY-MM-DD')), count(1) group by 1 order by created_at AS")
    return await prisma.raw(sql_statement)
  }

}

module.exports = prisma_queries
