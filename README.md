ez-html-replace
===============

> 替换html里面script和link标签的引用地址

> replace js' `src` and css' `href` with their cdn url.

> No need for any comments.

## Install
```
npm install ez-html-replace --save-dev
```

## Example
### `gulpfile.js`
```js
var cdn = require('ez-html-replace');
var cdnUrl = '//www.baidu.com/cnd/';

gulp.task('cdn', function() {
    gulp.src('./example/*.html')
        .pipe(cdn({
            forcePrefix: 'config',
            root: {
                js: cdnUrl,
                css: cdnUrl
            },
            debug: false
        })).pipe(gulp.dest('./example/output/'))
});
```

### cdn(options)

### options

Type: `Object`

#### options.forcePrefix
Type: `String`
Default: ''

Fixed context directory prefix.example : http://www.eajax.cn/cdn/{forePrefix}/css/index.css 

#### options.root
Type: `Object`

#### options.root.js
Type: `String`

The CDN prefix for js files.

#### options.root.css
Type: `String`

The CDN prefix for css files.

#### options.debug
Type: `Boolean`
Default: false

Output debug log.
