define([
    'jquery'
], function($) {
    $('button').on('click', function() {
        var user = $('.user').val();
        var pwd = $('.pwd').val();
        if (user === "") {
            $('.login-error-1').show().siblings().hide();
        } else {
            if (pwd === "") {
                $('.login-error-2').show().siblings().hide();
            } else {
                if ($(this).hasClass("login-btn")) {
                    // 登录
                    $.ajax({
                        url: '/api/login',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            user: user,
                            pwd: pwd
                        },
                        success: function(data) {
                            alert(data.msg);
                            if (data.code) {
                                history.go(-1);
                                stroge.setItem('userInfo', 1);
                            }
                        }
                    });
                } else {
                    // 注册
                    $.ajax({
                        url: '/api/register',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            user: user,
                            pwd: pwd
                        },
                        success: function(data) {
                            alert(data.msg);
                        }
                    });
                }
            }
        }
    });
    $('.login-eye').on('click', function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.pwd').attr('type', 'text');
        } else {
            $('.pwd').attr('type', 'password');
        }
    });
});