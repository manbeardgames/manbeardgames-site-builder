const fse = require('fs-extra');
const log = require('./logger');

//  ===================================================================================
/**
 * Copies all configured vender libraries from ./node_modules to the configured
 * ./public directory.  To add or remove venders edit the vendors array
 * in this function
 */
//  ===================================================================================
function process() {
    let vendors = [{
            in: './node_modules/bootstrap/dist/css/bootstrap.css',
            out: './public/vendor/bootstrap/css/bootstrap.css'
        },
        {
            in: './node_modules/bootstrap/dist/js/bootstrap.js',
            out: './public/vendor/bootstrap/js/bootstrap.js'
        },
        {
            in: './node_modules/popper.js/dist/popper.js',
            out: './public/vendor/popper.js/js/popper.js'
        },
        {
            in: './node_modules/jquery/dist/jquery.js',
            out: './public/vendor/jquery/js/jquery.js'
        },
        {
            in: './node_modules/@mdi/font/css/materialdesignicons.css',
            out: './public/vendor/mdi/css/materialdesignicons.css'
        },
        {
            in: './node_modules/@mdi/font/fonts',
            out: './public/vendor/mdi/fonts'
        },
        {
            in: './node_modules/prismjs/themes/prism-tomorrow.css',
            out: './public/vendor/prismjs/css/prism-tomorrow.css'
        }
    ];

    vendors.forEach((vendor, i) => {
        log.log(`Copying ${vendor.in} to ${vendor.out}`);
        fse.copy(vendor.in, vendor.out);
    })
}


module.exports.process = process;