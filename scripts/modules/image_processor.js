const fse = require('fs-extra');
const { log } = require('./logger');


//  ===================================================================================
/**
 * Copies all files from ./source/image to ./public/img
 */
//  ===================================================================================
function process() {
    log(`Copying images from ./source/img to ./public/img`);
    fse.copy('./source/img', './public/img');
}

function processApp() {
    log('Copying images from ./app/contents/images to ./public/img');
    fse.copy('./app/content/images', './public/img');
}

module.exports.process = process;
module.exports.processApp = processApp;