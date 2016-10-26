'use strict';
var through = require('through2');
var log = require('gulp-util').log;
var path = require('path');
var fs = require('fs');
var globParent = require('glob-parent');
var resolveGlob = require('to-absolute-glob');

//匹配正则
var reScript = /<\s*script\s+[^\>\<]*src\s*=\s*["|']([^"'>]+)[^>]*><\s*\/\s*script\s*>/gmi;
var reCss = /<link(?:.*?)href=[\"\'](.+?)[\"\'][^>]*(\/)*\>(?:<\/link>)*/gmi;
var sepRe = (process.platform === 'win32' ? /[\/\\]/ : /\/+/);
var cdnUrl = 'http://www.eajax.cn/staict/';
var module_name = 'ez-html-url-replace';

module.exports = function (options) {
    //init default options
    options = options || {};
    options.root = options.root || {};
    options.root.js = options.root.js || cdnUrl;
    options.root.css = options.root.css || cdnUrl;
    options.debug = options.debug || false;
    options.dir = options.dir || './dist/';
    options.forcePrefix = options.forcePrefix || '';
    options.debug && log('runtimer opts:', options);

    //copy from glob-stram module
    //get absolute path from the drive
    function getBasePath(ourGlob, opt) {
        var basePath;
        var parent = globParent(ourGlob);

        if (parent === '/' && opt && opt.root) {
            basePath = path.normalize(opt.root);
        } else {
            basePath = resolveGlob(parent, opt);
        }

        if (!sepRe.test(basePath.charAt(basePath.length - 1))) {
            basePath += path.sep;
        }
        return basePath;
    }

    var replaceHtml = function (chunk, enc, callback) {
        if (chunk.isNull()) return callback(null, file);
        if (chunk.isStream()) return callback(new gutil.PluginError(module_name, 'Streaming is not supported'));
        var fileContent = chunk.contents.toString();
        options.debug && log(fileContent);
        var basePath=getBasePath('');


        fileContent = fileContent.replace(reScript, function (match, url) {
                var relative_prefix = '/'+(getBasePath(getBasePath(chunk.path)+url).replace(basePath,''));
                return '<script src="' + options.root.js + options.forcePrefix+ relative_prefix + url.replace(/(.*\/)*([^.]+\.\w+)/gmi,'$2')+ '"></script>'
            })
            .replace(reCss, function (match, url) {
                console.log('css path.dirname========:',url);
                var relative_prefix = '/'+(getBasePath(getBasePath(chunk.path)+url).replace(basePath,''));
                return '<link rel="stylesheet" href="' + options.root.css + options.forcePrefix+ relative_prefix + url.replace(/(.*\/)*([^.]+\.\w+)/gmi,'$2')+ '"/>'
            });
        chunk.contents = new Buffer(fileContent);
        this.push(chunk);
        callback(null, chunk);
    };

    return through.obj(replaceHtml, function (cb) {
        cb();
    });
};
