'use strict'

const prisma_queries = {

  posts: async (id) => {
    return await prisma.posts.findMany()
  },

  post: async (id) => {
    return await prisma.posts.findOne({
      where: {
        id: parseInt(id)
      }
    })
  },

  create_post: async (title, url, attached_image, included_image, included_link, snippet, community_id, sentiment_score) => {
    return await prisma.posts.create({
        data: {
          title: title,
          url: url,
          created_at: moment().format('YYYY-MM-DD HH:mm:SS'),
          attached_image: attached_image,
          included_image: included_image,
          included_link: included_link,
          snippet: snippet,
          community_id: parseInt(community_id),
          sentiment_score: parseFloat(sentiment_score)
        }
      }).catch(e => {})
      .finally(async () => {
        await prisma.disconnect()
      })
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
  },

  communities: async () => {
    return await prisma.communities.findMany()
  },

  community: async (id) => {
    return await prisma.communities.findOne({
      where: {
        id: parseInt(id)
      }
    })
  },

  create_community: async (name) => {
    return await prisma.communities.create({
        data: {
          name: `${name}`
        }
      }).catch(e => {})
      .finally(async () => {
        await prisma.disconnect()
      })
  },

  communities_count: async () => {
    return await prisma.communities.count()
  },

  raw: async (sql_statement) => {
    return await prisma.raw(sql_statement)
  }

}

module.exports = prisma_queries
