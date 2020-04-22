'use strict'

const monitor = {

  spy: () => {
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

}

module.exports = monitor
