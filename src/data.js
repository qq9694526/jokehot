var rp = require('request-promise');
var cheerio = require('cheerio'); // Basically jQuery for node.js
const iconv = require('iconv-lite');
// 'Content-Type: text/html; charset=utf-8'
var options = {
  // uri: 'https://www.baidu.com/s?ie=UTF-8&wd=cheerio',
  uri: 'http://top.baidu.com/buzz?b=1&c=513&fr=topbuzz_b42_c513', // 百度实时热点
  transform: function (body) {
    const html = iconv.decode(body, 'gbk')
    return cheerio.load(html);
  },
  encoding: null
};

const getData = function () {
  return rp(options)
    .then(function ($) {
      let result = []
      $('.list-table tr').map((index, item) => {
        if (result.length < 10 && $(item).find(".list-title").text()) {
          result.push({
            title: $(item).find(".list-title").text(),
            heat: $(item).find(".icon-fall").text() || $(item).find(".icon-rise").text()
          })
        }
      })
      return result
    })
}
export default getData
