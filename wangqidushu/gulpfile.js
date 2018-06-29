var gulp = require('gulp');
var server = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
var autoprefixer = require('gulp-autoprefixer');
var mincss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var minhtml = require('gulp-htmlmin');

var mock = require('./mock/');
var userData = require('./mock/login/user').userInfo;

gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 7070,
            open: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? 'index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === '/api/login' || pathname === '/api/register') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = decodeURIComponent(Buffer.concat(arr).toString());
                            data = require('querystring').parse(data);
                            if (pathname === '/api/login') {
                                // 登录
                                var result = userData.some(function(v) {
                                    return v.user === data.user && v.pwd === data.pwd;
                                });
                                if (result) {
                                    res.end(JSON.stringify({ 'code': 1, msg: '登录成功' }));
                                } else {
                                    res.end(JSON.stringify({ 'code': 0, msg: '用户名或密码错误' }));
                                }
                            } else if (pathname === '/api/register') {
                                // 注册
                                userData.push(data);
                                var userObj = {
                                    userInfo: userData
                                };
                                require('fs').writeFileSync('./mock/login/user.json', JSON.stringify(userObj));
                                res.end(JSON.stringify({ 'code': 1, msg: '注册成功' }));
                            }
                        });
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))

});

gulp.task('dev', ['server']);

// 压缩css
gulp.task('mincss', function() {
    gulp.src('./src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(mincss())
        .pipe(gulp.dest('./bulid/css'));
});

// 压缩js
gulp.task('minjs', function() {
    gulp.src(['src/js/**/*.js', '!src/js/lib/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./bulid/js'));
});

// 压缩html
gulp.task('minhtml', function() {
    gulp.src('./src/page/*.html')
        .pipe(minhtml({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
        }))
        .pipe(gulp.dest('./bulid/page'));
});

gulp.task('bulid', ['mincss', 'minjs', 'minhtml']);