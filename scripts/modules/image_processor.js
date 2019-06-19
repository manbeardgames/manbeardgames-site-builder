const fse = require('fs-extra');
const log = require('./logger');


//  ===================================================================================
/**
 * Copies all files from ./source/image to ./public/img
 */
//  ===================================================================================
function process() {
    log.log(`Copying images from ./source/img to ./public/img`);
    fse.copy('./source/img', './public/img');
}

module.exports.process = process;