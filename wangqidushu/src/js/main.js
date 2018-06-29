require.config({
    baseUrl: '/js/',
    paths: {
        index: 'index/index',
        search: 'search/index',
        details: 'details/index',
        read: 'read/index',
        menu: 'menu/index',
        login: 'login/index',
        jquery: 'lib/jquery-2.1.1.min',
        flexible: 'lib/flexible',
        swiper: 'lib/swiper-4.3.2',
        bscroll: 'lib/bscroll',
        text: 'lib/require.text',
        template: '../template',
        handlebars: 'lib/handlebars-v4.0.11',
        temp: 'common/temp',
        lazyload: 'lib/jquery.lazyload',
        getUrl: 'common/getUrl',
        base64: 'lib/jquery.base64'
    },
    shim: {
        lazyload: {
            ecports: 'lazyload',
            deps: ['jquery']
        },
        base64: {
            ecports: 'base64',
            deps: ['jquery']
        }
    }

});

require(['flexible'])