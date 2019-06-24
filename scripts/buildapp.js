const fse = require('fs-extra');
const scss = require('./modules/sass_processor');
const images = require('./modules/image_processor');
const javascripts = require('./modules/javascript_processor');
const vendors = require('./modules/vendor_processor');
const { log } = require('./modules/logger');
const home_controller = require('../app/controllers/home');

log('Build started');

//  Make sure the public directory is empty each time we do a build
fse.emptyDirSync('./public');

//  Process the SCSS files
scss.processApp();

//  Process the image files
images.processApp();

//  Process the javascript files
javascripts.processApp();

//  Process the vendor files
vendors.process();


//  Render the home controller
home_controller.render();

log('Finished build');
