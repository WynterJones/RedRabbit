'use strict'

const prisma_queries = {

  posts: async (id) => {
    return await prisma.posts.findMany()
  },

  post: async (id) => {
    return await prisma.posts.findOne({
      where: {
        id: id
      }
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
        id: id
      }
    })
  },

  create_community: async (name) => {
    return await prisma.communities.create({
        data: {
          name: `${name}`
        }
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
