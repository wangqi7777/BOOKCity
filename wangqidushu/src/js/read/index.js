define([
    'jquery',
    'base64',
    'temp',
    'getUrl',
    'text!template/reader/reader.html'
], function($, base64, temp, getUrl, strreader) {
    var storage = window.localStorage;
    var fontSize = storage.getItem('fontSize') || 16;
    console.log(fontSize);
    $('.read-cont-list li p').css('fontSize', fontSize * 1);
    // 显示隐藏菜单
    $('.read-menu').on('click', function() {
        $('.read-menu-box').addClass('active');
    });
    $('.read-cont').on('click', function() {
        $('.read-menu-box').removeClass('active');
    });

    // 获取总章节数
    var chapternum = getUrl('chapternum');
    $('.read-menu-bot .top .cen b').html(chapternum);

    // 默认显示第一章
    var chapterId = getUrl("curchapter") || storage.getItem('chapterId') * 1 || 1;
    getText();
    // 点击下一章
    $('.read-menu-bot .top .right').on('click', function(ev) {
        var oEvent = ev || event;
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
        chapterId++;
        chapterId = chapterId > chapternum ? chapternum : chapterId;
        getText();
        $('.read-menu-bot .top .cen i').html(chapterId);
    });
    // 点击上一张
    $('.read-menu-bot .top .left').on('click', function(ev) {
        var oEvent = ev || event;
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
        chapterId--;
        chapterId = chapterId < 1 ? 1 : chapterId;
        getText();
        $('.read-menu-bot .top .cen i').html(chapterId);
    });
    // 点击目录
    $('.read-menu-bot .bot .menu-btn').on('click', function() {
        window.location.href = 'menu.html?id=' + getUrl('id') + '&active=' + chapterId;
    });
    // 点击改变字体大小
    $('.config-font').on('click', "button", function(ev) {
        var oEvent = ev || event;
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
        fontSize = parseInt($('.read-cont-list li p').css('fontSize'));
        if ($(this).html() === '大') {
            $('.read-cont-list li p').css('fontSize', ++fontSize);
        } else {
            $('.read-cont-list li p').css('fontSize', --fontSize);
        }
        storage.setItem('fontSize', fontSize);
        console.log(fontSize);
    })

    function getText() {
        storage.setItem('chapterId', chapterId)
        $.ajax({
            url: '/api/reader',
            data: {
                chapterNum: chapterId
            },
            dataType: 'json',
            success: function(data) {
                jsonp(data.jsonp, function(data) {
                    var data = JSON.parse($.base64().decode(data));
                    temp(strreader, data, '.read-cont-list')
                });
            }
        });
    }

    function jsonp(url, success) {
        var script = document.createElement('script');
        window['duokan_fiction_chapter'] = function(data) {
            success(data);
            document.head.removeChild(script);
        }
        script.src = url;
        document.head.appendChild(script);
    }
});