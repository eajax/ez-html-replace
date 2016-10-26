'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var globParent = require('glob-parent');
var resolveGlob = require('to-absolute-glob');
var log = gutil.log;

//匹配正则
var reScript = /<\s*script\s+[^\>\<]*src\s*=\s*["|']([^"'>]+)[^>]*><\s*\/\s*script\s*>/gmi;
var reCss = /<link(?:.*?)href=[\"\'](.+?)[\"\'][^>]*(\/)*\>(?:<\/link>)*/gmi;
var reRoot = /^\s*\/[^\/]/gm;
var reProtocol = /^\s*(http(s*)|file)\:\/\//gm;
var reFileName = /(.*\/)*([^.]+\.\w+)/gmi;
var reDependProtocol = /^\s*\/{2}/gm;
var sepRe = (
    process.platform === 'win32' ? /[\/\\]/ : /\/+/
);
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
    options.debug && log('runtime opts:', options);

    //copy from glob-stream module
    //get absolute path from the drive
    function getBasePath (ourGlob, opt) {
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

    function getTagHtml (url, match, root_url, forcePrefix, file) {
        var retval = '';
        var basePath = getBasePath('');
        // 获取差量目录 file.path - base.path
        var relative_prefix = '/' + (
                getBasePath(getBasePath(file.path) + url).replace(basePath, '')
            );

        if (url.match(reRoot)) {
            // 绝对根目录:"/xxx.css or /xxx/xx.js"
            retval = match.replace(url, root_url + forcePrefix + url);
        } else if (url.match(reProtocol) || url.match(reDependProtocol)) {
            // 协议路径不替换, http:// https:// file://
            // 协议依赖的路径不替换 //www.eajax.cn/cnd/js/index.js
            retval = match;
        } else {
            // 替换相对路径 ./ ../ ../../
            retval = match.replace(url, root_url + forcePrefix + relative_prefix + url.replace(reFileName, '$2'));
        }
        return retval;
    }

    var replaceHtml = function (chunk, enc, callback) {
        if (chunk.isNull()) {
            return callback(null, chunk);
        }
        if (chunk.isStream()) {
            return callback(new gutil.PluginError(module_name, 'Streaming is not supported'));
        }
        var fileContent = chunk.contents.toString();
        options.debug && log(fileContent);

        fileContent = fileContent.replace(reScript, function (match, url) {
                log('js url replacing:', url);
                return getTagHtml(url, match, options.root.js, options.forcePrefix, chunk);
            })
            .replace(reCss, function (match, url) {
                log('css url replacing:', url);
                return getTagHtml(url, match, options.root.css, options.forcePrefix, chunk);
            });
        chunk.contents = new Buffer(fileContent);
        this.push(chunk);
        callback(null, chunk);
    };

    return through.obj(replaceHtml, function (cb) {
        cb();
    });
};
