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
        sass: path.join(source, 'scss'),
        images: path.join(source, 'img'),
        js: path.join(source, 'js'),
        vendor: {
            bootstrapcss: './node_modules/bootstrap/dist/css/bootstrap.css',
            bootstrapjs: './node_modules/bootstrap/dist/js/bootstrap.js',
            jquery: './node_modules/jquery/dist/jquery.js',
            mdicss: './node_modules/@mdi/font/css/materialdesignicons.css',
            mdifonts: './node_modules/@mdi/font/fonts/'
        }
    },
    build: {
        root: build,
        data: path.join(build, 'data'),
        pages: build,
        devblog: path.join(build, 'dev-blog'),
        sass: path.join(build, 'css'),
        images: path.join(build, 'img'),
        js: path.join(build, 'js'),
        vendor: {
            bootstrapcss:path.join(build, 'vendor', 'bootstrap', 'css', 'bootstrap.css'),
            bootstrapjs: path.join(build, 'vendor', 'bootstrap', 'js', 'bootstrap.js'),
            jquery: path.join(build, 'vendor', 'jquery', 'jquery.js'),
            mdicss: path.join(build, 'vendor', 'mdi', 'css', 'materialdesignicons.css'),
            mdifonts: path.join(build, 'vendor', 'mdi', 'fonts')
        }        
    },
    temp: {
        root: temp,
        data: path.join(temp, 'data'),
        pages: temp,
        devblog: path.join(temp, 'dev-blog'),
        sass: path.join(temp, 'css'),
        images: path.join(temp, 'img'),
        js: path.join(temp, 'js'),
        vendor: {
            bootstrapcss:path.join(temp, 'vendor', 'bootstrap', 'css', 'bootstrap.css'),
            bootstrapjs: path.join(temp, 'vendor', 'bootstrap', 'js', 'bootstrap.js'),
            jquery: path.join(temp, 'vendor', 'jquery', 'jquery.js'),
            mdicss: path.join(temp, 'vendor', 'mdi', 'css', 'materialdesignicons.css'),
            mdifonts: path.join(temp, 'vendor', 'mdi', 'fonts')
        }        

    }
}