define([
    'jquery',
    'getUrl',
    'temp',
    'text!template/details/details.html'
], function($, getUrl, temp, strdetails) {
    var $id = getUrl('id');
    $.ajax({
        url: '/api/details?id=' + $id,
        dataType: 'json',
        success: function(data) {
            temp(strdetails, data, '.scroll')
        }
    })
});