const __root__dir = process.cwd();
const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const logger = require('../lib/logger');
const stylesheets = require('./stylesheet-tasks');
const images = require('./image-tasks');
const javascripts = require('./javascript-tasks');
const controllers = require('./controller-tasks');
const vendors = require('./vendor-tasks');


// var exports = module.exports = {};

exports.build = function () {

    //  Generate our directory paths
    let public_dir = path.join(__root__dir, 'public');
    let content_dir = path.join(public_dir, 'content');
    let images_dir = path.join(content_dir, 'images');
    let javascript_dir = path.join(content_dir, 'javascripts');
    let stylesheets_dir = path.join(content_dir, 'stylesheets');


    //  Empty our public directory
    fse.emptyDirSync(public_dir);

    //  Create the content directory
    fse.ensureDirSync(content_dir);

    //  Create the stylesheets directory
    fse.ensureDirSync(stylesheets_dir);

    //  Process stylsheets
    stylesheets.process();

    //  Copy over processed stylesheets
    stylesheets.moveTo(stylesheets_dir);

    //  Proces Images
    images.process();

    //  Copy over processed images
    images.moveTo(images_dir);

    //  Proces javascript files
    javascripts.process();

    //  Copy over processed javascript files
    javascripts.moveTo(javascript_dir);

    //  Process vendors
    vendors.process();

    //  Process controllers
    controllers.process();









}