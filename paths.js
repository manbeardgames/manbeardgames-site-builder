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
        data: path.join(source, 'data')
    },
    build: {
        root: build,
    },
    temp: {
        root: temp
    }
}