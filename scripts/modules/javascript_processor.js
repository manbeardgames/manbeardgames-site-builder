const fse = require('fs-extra');
const { log } = require('./logger');

//  ===================================================================================
/**
 * Copies all javascript files from ./source/js to ./public.js
 */
//  ===================================================================================
function process() {
    log(`Copying javascript files from ./source/js to ./public/js`);
    fse.copy('./source/js', './public/js');
}

function processApp() {
    log(`Copying javascript files from ./app/content/javascript to ./public/js`);
    fse.copy('./app/content/javascript', './public/js');
}

module.exports.process = process;
module.exports.processApp = processApp;