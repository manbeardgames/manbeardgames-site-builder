const fse = require('fs-extra');
const log = require('./logger');

//  ===================================================================================
/**
 * Copies all javascript files from ./source/js to ./public.js
 */
//  ===================================================================================
function process() {
    log.log(`Copying javascript files from ./source/js to ./public/js`);
    fse.copy('./source/js', './public/js');
}

module.exports.process = process;