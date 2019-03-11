const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const logger = require('../lib/logger');
const sass = require('sass');

const __root__dir = process.cwd();
const stylesheets_dir = path.join(__root__dir, 'app', 'assets', 'stylesheets');

// var exports = module.exports = {};


exports.process = function () {
    logger.log('----------');
    logger.log(`Processing Stylesheets in ${stylesheets_dir}`);
    logger.log('----------');

    //  Ensure we have that directory
    fse.ensureDirSync(stylesheets_dir);

    //  Get any .scss files that do not begin with '_'
    var scss_files = glob.sync('**/!(_)*.scss', { cwd: stylesheets_dir });

    logger.info(`${scss_files.length} file(s) found to process`);

    //  Go through each of the scss_files found and render them as a css file
    scss_files.forEach((file, i) => {
        //  Get the file data
        let fileInfo = path.parse(file);

        logger.logIndented(`Processing ${fileInfo.name}`, 1);

        //  Generate the full path to the scss file
        let file_path = path.join(stylesheets_dir, fileInfo.dir, `${fileInfo.name}${fileInfo.ext}`);

        //  Generate the full path to the css file we'll output too
        let output_file_path = path.join(stylesheets_dir, fileInfo.dir, `${fileInfo.name}.css`);

        //  render the scss to css
        let rendered = sass.renderSync({ file: file_path });

        //  Ouput the result as a .css file
        fse.writeFileSync(output_file_path, rendered.css);
    });
}

exports.moveTo = function (dir) {

    //  Ensure the directory we are moving to exists
    fse.ensureDirSync(dir);

    //  Get the list of all rendered .css files
    let css_files = glob.sync('**/*.css', { cwd: stylesheets_dir });

    //  Go through each of the css files and copy them to the dir
    css_files.forEach((file, i) => {
        //  Get the file info
        let file_info = path.parse(file);

        //  Generate full path to file
        let from = path.join(stylesheets_dir, file_info.dir, `${file_info.name}${file_info.ext}`);

        //  Generate the full path to copy to
        let to = path.join(dir, file_info.dir, `${file_info.name}${file_info.ext}`);

        //  Ensure the directory to copy to
        fse.ensureDirSync(path.join(dir, file_info.dir));


        //  Copy the file from the app to public
        fse.copyFileSync(from, to);
    });
}

