const colors = require('./console-colors');

// var exports = module.exports = {};

exports.log = function(message) {
    console.log(`${colors.reset}`, message);
}

exports.logIndented = function(message, indent_level = 0) {
    let indent = '';
    var i;
    for(i = 0; i < indent_level; i++) {
        indent += '    ';
    }
    console.log(`${colors.reset}`, `${indent}${message}`);
}

exports.info = function(message) {
    console.log(`${colors.fg_blue}%s${colors.reset}`, message);
}

exports.infoIndented = function(message, indent_level = 0) {
    let indent = '';
    var i;
    for(i = 0; i < indent_level; i++) {
        indent += '    ';
    }
    console.log(`${colors.fg_blue}%s${colors.reset}`, `${indent}${message}`);
}

exports.error = function(message) {
    console.log(`${colors.fg_red}%s${colors.reset}`, message);
}

exports.errorIndented = function(message, indent_level = 0) {
    let indent = '';
    var i;
    for(i = 0; i < indent_level; i++) {
        indent += '    ';
    }
    console.log(`${colors.fg_red}%s${colors.reset}`, `${indent}${message}`);
}

exports.warning = function(message) {
    console.log(`${colors.fg_yellow}%s${colors.reset}`, message);
}

exports.warningIndented = function(message, indent_level = 0) {
    let indent = '';
    var i;
    for(i = 0; i < indent_level; i++) {
        indent += '    ';
    }
    console.log(`${colors.fg_yellow}%s${colors.reset}`, `${indent}${message}`);
}
