define([
    'jquery',
    'temp',
    'lazyload',
    'text!template/search/search.html',
    'text!template/search/search-dl.html'
], function(
    $,
    temp,
    lazyload,
    strsearch,
    strgirlsfavorite) {
    $.ajax({
        url: '/api/searchKey',
        dataType: 'json',
        success: function(data) {
            var index = 0;
            temp(strsearch, data, '.search-section-inner');
        }
    });

    $('.search-header-input-btn').on('click', function() {
        var inp = $(this).prev();
        var val = $.trim(inp.val());
        if (val != '') {
            $.getJSON('/api/result', { value: val }, function(data) {
                console.log(data.cont)
                if (data.cont.length) {
                    temp(strgirlsfavorite, data.cont, '.search-section');
                    $('img.lazy').lazyload({
                        effect: 'fadeIn',
                        container: $('.search-section')
                    });
                } else {
                    var ele = `
                    <div class = search-tit>${data.msg}</div>`
                    $('.search-section').html(ele);
                }
            });
        } else {
            var ele = `
                <div class = search-tit>没有相应的搜索结果</div>`
            $('.search-section').html(ele)
        }
    });
});