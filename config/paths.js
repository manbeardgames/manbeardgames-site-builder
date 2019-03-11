//  path for creating paths with .join
const path = require('path');

//  This is the directoy that contains the source files to build against
let source = './source';

//  This is the directory that the build will be written to
let build = './public';

//  This is a temporary directoy that will be used to store items for processing during build
let temp = './.tmp';

module.exports = {
    source: {
        root: source,
        data: path.join(source, 'data'),
        layouts: path.join(source, 'layouts'),
        pages: path.join(source, 'pages'),
        partials: path.join(source, 'partials'),
        devblog: path.join(source, 'partials', '_dev-blog.ejs'),
        posts: path.join(source, 'posts'),
        tutorials: path.join(source, 'tutorials'),
        sass: path.join(source, 'content', 'scss'),
        images: path.join(source, 'content', 'img'),
        js: path.join(source, 'content', 'js'),
        vendor: {
            "bootstrap-css": './node_modules/bootstrap/dist/css/bootstrap.css',
            "bootstrap-js": './node_modules/bootstrap/dist/js/bootstrap.js',
            "popperjs-js": './node_modules/popper.js/dist/popper.js',
            "jquery-js": './node_modules/jquery/dist/jquery.js',
            "mdi-css": './node_modules/@mdi/font/css/materialdesignicons.css',
            "mdi-fonts": './node_modules/@mdi/font/fonts/',
            "prismjs-css": './node_modules/prismjs/themes/prism-tomorrow.css'
        }
    },
    build: {
        root: build,
        data: path.join(build, 'data'),
        pages: build,
        devblog: path.join(build, 'dev-blog'),
        tutorials: path.join(build, 'tutorials'),
        sass: path.join(build, 'content', 'css'),
        images: path.join(build, 'content', 'img'),
        js: path.join(build, 'content', 'js'),
        vendor: {
            "bootstrap-css": path.join(build, 'vendor', 'bootstrap', 'css', 'bootstrap.css'),
            "bootstrap-js": path.join(build, 'vendor', 'bootstrap', 'js', 'bootstrap.js'),
            "popperjs-js": path.join(build, 'vendor', 'popper.js', 'js', 'popper.js'),
            "jquery-js": path.join(build, 'vendor', 'jquery', "js", 'jquery.js'),
            "mdi-css": path.join(build, 'vendor', 'mdi', 'css', 'materialdesignicons.css'),
            "mdi-fonts": path.join(build, 'vendor', 'mdi', 'fonts'),
            "prismjs-css": path.join(build, 'vendor', 'prismjs', 'css', 'prism-tomorrow.css')
        }
    },
    temp: {
        root: temp,
        data: path.join(temp, 'data'),
        pages: temp,
        devblog: path.join(temp, 'dev-blog'),
        tutorials: path.join(temp, 'tutorials'),
        sass: path.join(temp, 'content', 'css'),
        images: path.join(temp, 'content', 'img'),
        js: path.join(temp, 'content', 'js'),
        vendor: {
            "bootstrap-css": path.join(temp, 'vendor', 'bootstrap', 'css', 'bootstrap.css'),
            "bootstrap-js": path.join(temp, 'vendor', 'bootstrap', 'js', 'bootstrap.js'),
            "popperjs-js": path.join(temp, 'vendor', 'popper.js', 'js', 'popper.js'),
            "jquery-js": path.join(temp, 'vendor', 'jquery', "js", 'jquery.js'),
            "mdi-css": path.join(temp, 'vendor', 'mdi', 'css', 'materialdesignicons.css'),
            "mdi-fonts": path.join(temp, 'vendor', 'mdi', 'fonts'),
            "prismjs-css": path.join(temp, 'vendor', 'prismjs', 'css', 'prism-tomorrow.css')
        }

    }
}