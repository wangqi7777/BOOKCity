define([
    'jquery',
    'temp',
    'getUrl'
], function($, temp, getUrl) {
    var bookid = getUrl('id'),
        activeid = getUrl('active');
    $.ajax({
        url: '/api/menulist',
        data: {
            id: bookid
        },
        dataType: 'json',
        success: function(data) {
            data.item.toc.map(function(v) {
                v.chapter_id == activeid ? v.active = true : v.active = false;
            });
            temp($('.menu-list-li').html(), data.item, '.menu-list');
            scroll(data.item.toc.length);
        }
    });

    function scroll(n) {
        $('.section').scrollTop($('li span.active').position().top);
        $('.menu-list li').on('click', function() {
            window.location.href = "read.html?id=" + bookid + "&chapternum=" + n + "&curchapter=" + $(this).index();
        })
    }
});