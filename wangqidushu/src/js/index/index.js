define([
        'jquery',
        'swiper',
        'temp',
        'lazyload',
        'text!template/index/index-banner-nav.html',
        'text!template/index/index-weekhot.html',
        'text!template/index/index-recommend.html',
        'text!template/index/index-girlsfavorite.html',
        'text!template/index/index-special.html'
    ],
    function(
        $,
        swiper,
        temp,
        lazyload,
        strbannernav,
        strweekhot,
        strrecommend,
        strgirlsfavorite,
        strspecial) {
        // 首页tab切换
        $('.book-btn').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            $('.index-box').css('transform', 'translateX(-' + index * 100 + '%)')
        });
        // 请求首页书城数据
        $.ajax({
            url: '/api/bookcity',
            dataType: 'json',
            success: indexbookcity
        });

        // 请求书架数据
        $.ajax({
            url: '/api/bookshelf',
            dataType: 'json',
            success: indexbookshelf
        })

        function indexbookcity(data) {
            // 轮播图
            temp(strbannernav, data.items[0].data, '.index-banner-nav');
            var mySwiper = new swiper('.swiper-container', {
                loop: true,
                autoplay: true
            })

            // 本周最火
            temp(strweekhot, data.items[1], '.index-weekhot');

            var index = 0;
            // 重磅推荐
            temp(strrecommend, change(index, data.items[2].data.data, 5), '.index-recommend-section');

            // 女生最爱
            temp(strgirlsfavorite, change(index, data.items[3].data.data, 5), '.index-girlsfavorite-section');

            //男生最爱
            temp(strgirlsfavorite, change(index, data.items[4].data.data, 5), '.index-boysfavorite-section');

            // 限时免费
            data.items[5].data.data.map(function(v) {
                v.title = v.data.title;
                v.cover = v.data.cover;
                v.fiction_id = v.data.fiction_id;
            });
            temp(strweekhot, data.items[5], '.index-free');

            // 精选专题
            temp(strspecial, data.items[6], '.index-special');

            // 图片懒加载
            $('img.lazy').lazyload({
                effect: 'fadeIn',
                container: $('.index-bookcity')
            });

            // 上拉加载
            LoadingMove('.index-bookcity');

            // 换一换
            $('.huanyihuan').on('click', function() {
                var index = $(this).data('id') * 1; //0
                var ind = $(this).attr('data') * 1;
                var obj = data.items[ind];
                index++;
                index = index % (obj.data.count / 5);
                var str = ind === 2 ? strrecommend : strgirlsfavorite;
                $(this).data('id', index);
                temp(str, change(index, obj.data.data, 5), '.' + $(this).parent().prev().attr('class'));
                // 图片懒加载
                $('img.lazy').lazyload({
                    effect: 'fadeIn',
                    container: $('.index-bookcity')
                });
            });

        };

        function indexbookshelf(data) {
            var index = 0;
            temp(strgirlsfavorite, change(index, data.items, 6), '.index-list');
            $('.index-search-pic').on('click', function() {
                $(this).toggleClass('index-search-pic-list');
                $('.index-list').toggleClass('index-list-repear');
            });

            $('.index-search-text').on('click', function() {
                window.location.href = 'page/search.html'
            })

            // 图片懒加载
            $('img.lazy').lazyload({
                effect: 'fadeIn',
                container: $('.index-bookshelf')
            });
        }

        function change(index, data, n) {
            var limit = n;
            var start = index * limit;
            var end = index * limit + limit;
            var newArr = data.slice(start, end);
            newArr.map(function(v, i) {
                v.cont = "0" + (i + 1 * 1);
            })
            return newArr;
        };

        // 页码
        var pagenum = 0;

        function LoadingMove(parent) {
            if (pagenum >= 3) {
                $('.index-loading-text').html('暂无更多数据');
                return false;
            }
            // 可视高度
            var clientH = $(parent).height();
            $(parent).on('scroll', function() {
                // 最大滚动高度 内容高度 - 可视高度
                var maxScroll = $(this).children().height() - clientH;
                if ($(this).scrollTop() + 60 >= maxScroll) {
                    $(this).off('scroll')
                    pagenum++;
                    render(pagenum);
                }
            });
        };

        function render(n) {
            $.ajax({
                url: '/api/loadmore',
                data: {
                    pagenum: n,
                    limit: 20
                },
                dataType: 'json',
                success: function(data) {
                    temp(strgirlsfavorite, data.items, '.index-loading-inner', 1);
                    LoadingMove('.index-bookcity');
                    // 图片懒加载
                    $('img.lazy').lazyload({
                        effect: 'fadeIn',
                        container: $('.index-bookcity')
                    });
                }
            })
        }
    });