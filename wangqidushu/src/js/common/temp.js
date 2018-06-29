define([
    'jquery', 'handlebars'
], function($, handlebars) {
    return function(text, data, parent, check) {
        var compile = handlebars.compile(text);
        handlebars.registerHelper('finish', function(items) {
            if (items) {
                return '完结'
            } else {
                return '连载中...'
            }
        });
        handlebars.registerHelper('updatedTime', function(items) {
            var data = new Date(items);
            return data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + '  ' + data.getHours() + ':' + data.getMinutes();
        });
        handlebars.registerHelper('wordcount', function(items) {
            return Math.round(items / 10000)
        })
        if (check) {
            $(parent).append(compile(data))
        } else {
            $(parent).html(compile(data))
        }
    }
});