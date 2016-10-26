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

### `demo.html -- before build`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>source template</title>
    <link rel="stylesheet" href="/css/sytle1.css"/>
    <link href="css/sytle1.css"/>
    <link href="../style/sytle2.css"/>
    <link href="../../sytle1.css"/>
    <script main="index.js" src="../config.js"></script>
    <script src="../../index.js"></script>
    <script src="index.js"></script>
    <script type="text/javascript" src="./main.js"></script>
    <script type="text/javascript" src="//www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="http://www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="https://www.baidu.com/js/main.js"></script>
</head>
<body>

</body>
</html>
```

### `demo.html -- after build`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>source template</title>
    <link rel="stylesheet" href="//www.baidu.com/cnd/config/css/sytle1.css"/>
    <link href="//www.baidu.com/cnd/config/example/css/sytle1.css"/>
    <link href="//www.baidu.com/cnd/config/style/sytle2.css"/>
    <link href="//www.baidu.com/cnd/config//usr/local/workspace/sytle1.css"/>
    <script main="index.js" src="//www.baidu.com/cnd/config/config.js"></script>
    <script src="//www.baidu.com/cnd/config//usr/local/workspace/index.js"></script>
    <script src="//www.baidu.com/cnd/config/example/index.js"></script>
    <script type="text/javascript" src="//www.baidu.com/cnd/config/example/main.js"></script>
    <script type="text/javascript" src="//www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="http://www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="https://www.baidu.com/js/main.js"></script>
</head>
<body>

</body>
</html>
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
