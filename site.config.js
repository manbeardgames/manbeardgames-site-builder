module.exports = {
    site: {
        title: 'ManBeardGames',
        description: '',
        opengraph: {
            type: '',
            img: '',
            description: '',
        },
        basePath: process.env.NODE_ENV === 'production' ? '/testsite' : ''
    },
    paths: {
        src: {
            root: './source',
            img: './source/img',
            sass: './source/scss',
            js: './source/js',
            pages: './source/pages',
            layouts: './source/layouts',
            devblog: './source/partials/_dev-blog.ejs',
            posts: './source/posts',
            vendor: {
                bootstrapcss: './node_modules/bootstrap/dist/css/bootstrap.css',
                bootstrapjs: './node_modules/bootstrap/dist/js/bootstrap.js',
                jquery: './node_modules/jquery/dist/jquery.js',
                mdicss: './node_modules/@mdi/font/css/materialdesignicons.css',
                mdifonts: './node_modules/@mdi/font/fonts/'
            }
        },
        build: {
            root: './public',
            img: './public/img',
            css: './public/css',
            js: './public/js',
            posts: './public/dev-blog',
            vendor: {
                bootstrapcss: './public/vendor/bootstrap/css/bootstrap.css',
                bootstrapjs: './public/vendor/bootstrap/js/bootstrap.js',
                jquery: './public/vendor/jquery/jquery.js',
                mdicss: './public/vendor/mdi/css/materialdesignicons.css',
                mdifonts: './public/vendor/mdi/fonts/'
            }
        },
        tmp: {
            root: './.tmp',
            img: './.tmp/img',
            sass: './.tmp/sass',
            css: './.tmp/css',
            js: './.tmp/js',
            vendor: {
                bootstrapcss: './.tmp/vendor/bootstrap/css/bootstrap.css',
                bootstrapjs: './.tmp/vendor/bootstrap/js/bootstrap.js',
                jquery: './.tmp/vendor/jquery/jquery.js',
                mdicss: './.tmp/vendor/mdi/css/materialdesignicons.css',
                mdifonts: './.tmp/vendor/mdi/fonts/'                
            }
        }
    }
}