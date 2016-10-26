"use strict";
var gulp = require('gulp');
var cdn = require('./index');
var log = require('gulp-util').log;
var rimraf = require('gulp-rimraf');

var cdnUrl = '//www.baidu.com/cnd/';

// 默认演示测试任务
gulp.task('default',['clear_demo'],function(cb){
    return gulp.src('./example/*.html')
        .pipe(cdn({
            forcePrefix: 'config',
            root: {
                js: cdnUrl,
                css: cdnUrl
            },
            debug: false
        })).pipe(gulp.dest('./example/output/'));
});

// 清除演示目录
gulp.task('clear_demo',function(cb){
    log('clear dir client...... ');
    return gulp.src(
        './example/output/', {read: false}
    ).pipe(rimraf());
});