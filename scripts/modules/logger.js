//  ===================================================================================
/**
 * Logs a message to the console with date and time stamp
 */
//  ===================================================================================
function log(message, opts) {
    options = Object.assign({}, {
        indent: 0
    }, opts);

    let indent = ' '.repeat(options.indent * 4);
    console.log(`[${new Date().toLocaleDateString()}] | [${new Date().toLocaleTimeString()}] | ${indent}${message}`)
}

module.exports.log = log;