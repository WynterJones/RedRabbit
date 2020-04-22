'use strict'

const prisma_queries = {

  all_posts_by_community_id: async () => {
    return await prisma.posts.findMany({
      where: { community_id: parseInt($('#community_list a.active').attr('data-id')) },
      orderBy: {
        created_at: "desc"
      }
    })
  },

  all_communities: async () => {
    return await prisma.communities.findMany()
  }

}

module.exports = prisma_queries
