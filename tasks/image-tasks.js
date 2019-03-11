const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const logger = require('../lib/logger');
const sass = require('sass');

const __root__dir = process.cwd();
const images_dir = path.join(__root__dir, 'app', 'assets', 'images');

// var exports = module.exports = {};


exports.process = function () {
    //  Nothing yet for processing images
}

exports.moveTo = function(dir) {
        //  Ensure the directory we are moving to exists
        fse.ensureDirSync(dir);

        //  Copy all image files from app to public
        fse.copySync(images_dir, dir);
}