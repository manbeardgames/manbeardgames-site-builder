const fse = require('fs-extra');
const sass = require('./modules/sass_processor');
const images = require('./modules/image_processor');
const javascript = require('./modules/javascript_processor');
const vendors = require('./modules/vendor_processor');
const pages = require('./modules/pages_processor');
const blog = require('./modules/blog_processor');
const tutorials = require('./modules/tutorials_processor');



//  Ensure that we start with an empty directory for the outputs
fse.emptyDirSync('./public');
tutorials.process();