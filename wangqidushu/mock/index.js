var homedata = require('./index/home.json');
var page1 = require('./index/recommend1');
var page2 = require('./index/recommend2');
var page3 = require('./index/recommend3');
var searchKey = require('./search/searchKey');
var searchResult = require('./search/search');
var details = require('./details/352876');
var menulist = require('./menu/chapter-list');
var reader1 = require('./read/data1');
var reader2 = require('./read/data2');
var reader3 = require('./read/data3');
var reader4 = require('./read/data4');

var data = {
    '/api/bookcity': homedata,
    '/api/bookshelf': page1,
    '/api/loadmore?pagenum=1&limit=20': page1,
    '/api/loadmore?pagenum=2&limit=20': page2,
    '/api/loadmore?pagenum=3&limit=20': page3,
    '/api/searchKey': searchKey,
    '/api/details?id=352876': details,
    '/api/menulist?id=352876': menulist,
    '/api/reader?chapterNum=1': reader1,
    '/api/reader?chapterNum=2': reader2,
    '/api/reader?chapterNum=3': reader3,
    '/api/reader?chapterNum=4': reader4,
}

module.exports = function(url) {
    if (/\/api\/result/.test(url)) {
        var searchdata = decodeURIComponent(url.split('?')[1].split('=')[1]);
        var reg = new RegExp(searchdata, 'g');
        var obj = {
            msg: '没有相应的搜索结果',
            cont: []
        }
        var newarr = searchResult.items.filter(function(v, i) {
            return reg.test(v.title) || reg.test(v.summary) || reg.test(v.authors)
        });
        if (newarr.length) {
            obj.msg = 'success';
            obj.cont = newarr
        }
        return obj;
    }
    return data[url]
}