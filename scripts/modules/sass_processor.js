const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const sass = require('sass');
const log = require('./logger');

//  ===================================================================================
/**
 * Processes all .scss located in ./source/scss, renders them as .css and outputs
 * them to ./public/css
 */
//  ===================================================================================
function process() {
    log.log("Processing SASS Files", { indent: 0 });

    //  Get any .scss files that do not have a _ in the beginning
    let file_list = glob.sync('**/!(_)*.scss', { cwd: './source/scss'});

    //  Render each sass file that was found
    file_list.forEach((file, i) => {
        //  Get the file info
        let file_info = path.parse(file);

        log.log(`Processing ${file_info.name} (${i + 1} of ${file_list.length})`, { indent: 1 });

        //  Create the destination directory
        fse.ensureDirSync('./public/css');

        //  Generate the full file path string to the SASS file
        let file_path = path.join('./source/scss', file_info.dir, file_info.name + file_info.ext);

        //  Render the SASS to CSS
        let render = sass.renderSync({ file: file_path });

        //  Write the render to disk
        fse.writeFileSync(path.join('./public/css', file_info.name + '.css'), render.css);
    })
}

module.exports.process = process;