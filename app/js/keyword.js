'use strict'

const conjuction_words = ["the","of","and","a","org","to","in","is","you","that","it","he","was","for","on","are","as","with","his","they","I","at","be","this","have","from","or","one","had","by","word","but","not","what","all","were","we","when","your","can","said","there","use","an","each","which","she","do","how","their","if","will","up","other","about","out","many","then","them","these","so","some","her","would","make","like","him","into","time","has","look","two","more","write","go","see","number","no","way","could","people","my","than","first","water","been","call","who","oil","its","now","find","long","down","day","did","get","come","made","may","part", "have", "just", "us", "why", "here", "our", "over", "new", "video", "anyone", "over", "know", "does", "being", "any", "after", "before", "well", "i’m", "i'm", "guys", "next", "last", "year", "month", "day", "minute", "years", "months", "days", "minutes", "it's", "getting", "off", "need", "null", "http", "https", "com", "www", "it’s", "i’ve", "don’t", "even", "want", "most", "only", "really", "also", "going", "think", "because", "something", "nothing", "right", "left", "post", "back", "watch", "where", "very", "youtube", "reddit", "those", "else", "everyone", "0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "dont", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadnt", "happens", "hardly", "has", "hasn", "hasnt", "hasnt", "have", "haven", "havent", "having", "he", "hed", "hed", "hell", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "heres", "hereupon", "hers", "herself", "hes", "hes", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "hows", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "id", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "ill", "im", "im", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isnt", "it", "itd", "itd", "itll", "its", "its", "itself", "iv", "ive", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "lets", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightnt", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustnt", "my", "myself", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "neednt", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shant", "she", "shed", "shed", "shell", "shes", "shes", "should", "shouldn", "shouldnt", "shouldve", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "thatll", "thats", "thats", "thatve", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "therell", "thereof", "therere", "theres", "theres", "thereto", "thereupon", "thereve", "these", "they", "theyd", "theyd", "theyll", "theyre", "theyre", "theyve", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "ts", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasnt", "way", "we", "wed", "wed", "welcome", "well", "well", "well-b", "went", "were", "were", "weren", "werent", "werent", "weve", "what", "whatever", "whatll", "whats", "whats", "when", "whence", "whenever", "whens", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "wheres", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "wholl", "whom", "whomever", "whos", "whos", "whose", "why", "whys", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "wont", "words", "world", "would", "wouldn", "wouldnt", "wouldnt", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "youd", "youll", "your", "youre", "youre", "yours", "yourself", "yourselves", "youve", "yr", "ys", "yt", "z", "zero", "zi", "zz"]


const keyword = {

  community: async () => {
    let totalShow = 15
    const all_posts = await database_query.posts_by_community_id()
    let word_list = {}
    let word_array = []
    all_posts.forEach(function(item, index) {
      let words = TextCleaner(`${item.title} ${item.snippet}`).stripHtml().condense().toLowerCase().removeApostrophes().removeStopWords().valueOf().split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/)
      for (var i in  words) {
        if (words[i].length > 1) {
          word_list[words[i]] ? word_list[words[i]]+=1 : word_list[words[i]]=1
        }
      }
    })
    Object.keys(word_list).forEach(function(key) {
      let new_object = {
        'word': key.trim().toLowerCase(),
        'count': word_list[key]
      }
      if (!conjuction_words.includes(key)) {
        word_array.push(new_object)
      }
    })
    $('#word-table').html('')
    let all_post_count = all_posts.length
    let table_html = ''
    let community_id = $('#community_list a.active').attr('data-id')
    word_array.sort(compare).forEach(async function(item, index) {
      if (index < totalShow) {
        let full_count = 0
        const search_all_posts = []
        all_posts.forEach(function(post, index) {
          if (post.title && post.title.toLowerCase().includes(item.word) ||
              post.snippet && post.snippet.toLowerCase().includes(item.word)) {
            full_count++
          }
        })
        const percentage = (full_count * 100) / all_post_count
        $('#word-table').append(`<tr>
          <td class="border border-gray-700 text-gray-300 px-4 py-2"><a href="#" class="search-by-word hover:underline">${item.word}</a></td>
          <td class="border border-gray-700 text-gray-300 px-4 py-2">${format_number()(item.count)}</td>
          <td class="border border-gray-700 text-gray-300 px-4 py-2">${format_number()(full_count)}</td>
          <td class="border border-gray-700 text-gray-300 px-4 py-2">${percentage.toFixed(2)}%</td>
        </tr>`)
      }
    })
  },

  dashboard: (word_list, allPosts, allPostsCount) => {
    let totalShow = 5
    let word_array = []
    Object.keys(word_list).forEach(function(key) {
      let new_object = {
        'word': key.trim().toLowerCase(),
        'count': word_list[key]
      }
      if (!conjuction_words.includes(key)) {
        word_array.push(new_object)
      }
    })
    $('#dashboard-word-table').html('')
    let all_post_count = allPostsCount
    let chart_data = []
    let chart_labels = []
    let full_count = 0
    word_array.sort(compare).forEach(function(item, index) {
      if (index < totalShow) {
        chart_data.push(item.count)
        chart_labels.push(item.word)
        let label_colors = ['#cbd5e0', '#a0aec0', '#718096', '#4a5568', '#2d3748', '#2d3748']
        let search_all_posts = []
        allPosts.forEach(function(post) {
          if (post.title && post.title.toLowerCase().includes(item.word) ||
              post.snippet && post.snippet.toLowerCase().includes(item.word)) {
            search_all_posts.push(post)
          }
        })
        full_count = search_all_posts.length
        $('#dashboard-word-table').append(`<tr>
          <td class="border border-gray-700 text-gray-300 px-4 py-2"><i class="fas fa-circle mr-1" style="color: ${label_colors[index]}"></i> ${item.word}</td>
          <td class="border border-gray-700 text-gray-300 px-4 py-2">${format_number()(item.count)}</td>
          <td class="border border-gray-700 text-gray-300 px-4 py-2">${format_number()(full_count)}</td>
        </tr>`)
      }
    })
    chart_data.push(all_post_count - full_count)
    chart_labels.push('(other)')
    charts.dashboard_keywords(chart_data, chart_labels)
  },

}

function compare(a, b) {
  let comparison = 0;
  if (a.count > b.count) {
    comparison = 1;
  } else if (a.count < b.count) {
    comparison = -1;
  }
  return comparison * -1;
}

module.exports = keyword
