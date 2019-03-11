const __root__dir = process.cwd();
const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');


// var exports = module.exports = {};

exports.reset = "\x1b[0m"
exports.bright = "\x1b[1m"
exports.dim = "\x1b[2m"
exports.underscore = "\x1b[4m"
exports.blink = "\x1b[5m"
exports.reverse = "\x1b[7m"
exports.hidden = "\x1b[8m"

exports.fg_black = "\x1b[30m"
exports.fg_red = "\x1b[31m"
exports.fg_green = "\x1b[32m"
exports.fg_yellow = "\x1b[33m"
exports.fg_blue = "\x1b[34m"
exports.fg_magenta = "\x1b[35m"
exports.fg_cyan = "\x1b[36m"
exports.fg_white = "\x1b[37m"

exports.bg_Black = "\x1b[40m"
exports.bg_red = "\x1b[41m"
exports.bg_green = "\x1b[42m"
exports.bg_yellow = "\x1b[43m"
exports.bg_blue = "\x1b[44m"
exports.bg_magenta = "\x1b[45m"
exports.bg_cyan = "\x1b[46m"
exports.bg_white = "\x1b[47m"