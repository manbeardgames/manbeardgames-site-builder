const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const logger = require('../lib/logger');

const __root__dir = process.cwd();
const public_dir = path.join(__root__dir, 'public');
const content_dir = path.join(public_dir, 'content');
const vendor_dir = path.join(content_dir, 'vendor');

// var exports = module.exports = {};

var vendors = {
    bootstrap: {
        process: function () {
            //  Generate directory strings
            let bootstrap_dir = path.join(vendor_dir, 'bootstrap');
            let bootstrap_css_dir = path.join(bootstrap_dir, 'css');
            let bootstrap_js_dir = path.join(bootstrap_dir, 'js');

            //  Ensure directories
            fse.ensureDirSync(bootstrap_css_dir);
            fse.ensureDirSync(bootstrap_js_dir);

            //  Generate file path strings
            let css_from = './node_modules/bootstrap/dist/css/bootstrap.css';
            let js_from = './node_modules/bootstrap/dist/js/bootstrap.js';
            let css_to = path.join(bootstrap_css_dir, 'bootstrap.css');
            let js_to = path.join(bootstrap_js_dir, 'bootstrap.js');

            //  Copy
            fse.copyFileSync(css_from, css_to);
            fse.copyFileSync(js_from, js_to);
        }
    },
    popper: {
        process: function() {
            //  Generate directory strings
            let popper_dir = path.join(vendor_dir, 'popper.js');
            let popper_js_dir = path.join(popper_dir, 'js');

            //  Ensure directories
            fse.ensureDirSync(popper_js_dir);

            //  Generate file path strings
            let js_from = './node_modules/popper.js/dist/popper.js';
            let js_to = path.join(popper_js_dir, 'popper.js');

            //  Copy
            fse.copyFileSync(js_from, js_to);
        }
    },
    jquery: {
        process: function() {
            //  Generate directory strings
            let jquery_dir = path.join(vendor_dir, 'jquery');
            let jquery_js_dir = path.join(jquery_dir, 'js');

            //  Ensure directories
            fse.ensureDirSync(jquery_js_dir);

            //  Generate file path strings
            let js_from = './node_modules/jquery/dist/jquery.js';
            let js_to = path.join(jquery_js_dir, 'jquery.js');

            //  Copy
            fse.copyFileSync(js_from, js_to);            
        }
    },
    mdi: {
        process: function() {
            //  Generate directory string
            let mdi_dir = path.join(vendor_dir, 'mdi');
            let mdi_css_dir = path.join(mdi_dir, 'css');
            let mdi_fonts_dir = path.join(mdi_dir, 'fonts');

            //  Ensure directories
            fse.ensureDirSync(mdi_css_dir);
            fse.ensureDirSync(mdi_fonts_dir);

            //  Generate file path strings
            let css_from = './node_modules/@mdi/font/css/materialdesignicons.css';
            let css_to = path.join(mdi_css_dir, 'materialdesignicons.css');
            let fonts_from = './node_modules/@mdi/font/fonts/';
            let fonts_to = mdi_fonts_dir;

            //  Copy
            fse.copyFileSync(css_from, css_to);
            fse.copySync(fonts_from, fonts_to);
        }
    },
    prismjs: {
        process: function() {
            //  Generate directory strings
            let prismjs_dir = path.join(vendor_dir, 'prismjs');
            let prismjs_css_dir = path.join(prismjs_dir, 'css');

            //  Ensure directories
            fse.ensureDirSync(prismjs_css_dir);

            //  Generate file path strings
            let css_from = './node_modules/prismjs/themes/prism-tomorrow.css';
            let css_to = path.join(prismjs_css_dir, 'prism-tomorrow.css');

            //  Copy
            fse.copyFileSync(css_from, css_to);              
        }
    }
}

exports.process = function() {
    for(var vendor in vendors) {
        if(vendors.hasOwnProperty(vendor)) {
            vendors[vendor].process();
        }
    }
}