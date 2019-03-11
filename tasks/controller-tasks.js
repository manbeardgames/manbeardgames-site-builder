const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');

const __root__dir = process.cwd();
const controllers_dir = path.join(__root__dir, 'app', 'controllers');
const views_dir = path.join(__root__dir, 'app', 'views');
const layouts_dir = path.join(views_dir, 'layouts');
const partials_dir = path.join(views_dir, 'partials');

// var exports = module.exports = {};

exports.create_controller = function (name) {

    if (name === undefined) {
        console.error("No name provided for controller");
        return;
    }

    name == name.toLowerCase();

    //  Generate controller directory path
    let controller_root_dir = path.join(__root__dir, 'app', 'controllers');

    //  Ensure we have the controllers directory
    fse.ensureDirSync(controller_root_dir);

    //  Get a list of files in the directory
    var files = glob.sync('**/*-controller.js', { cwd: controller_root_dir });

    //  Ensure that the controller doesn't already exist
    if(files.indexOf(`${name}_controller.js`) !== -1) {
        console.error(`Controller with name ${name} already exists`);
        return;
    }


    console.log(`Creating ${name} in ${controller_root_dir}`);

    //  Genereate path to controller file
    let controller_file_path = path.join(controller_root_dir, `${name}-controller.js`);
    fse.writeFileSync(controller_file_path, `// var exports = module.exports = {} \n\n // views/${name}/index.ejs \n exports.module.index = function() { \n\n }`);
    
    //  Generate views directory path
    let views_root_dir = path.join(__root__dir, 'app', 'views');

    //  Ensure we have a views directory
    fse.ensureDirSync(views_root_dir);

    //  Generate view directory for this controller
    let controller_view_directory = path.join(views_root_dir, name);

    //  Ensure we have the view directory for this controller
    fse.ensureDirSync(controller_view_directory);

    console.log(`Creating the Index view for controller in ${controller_view_directory}`);

    fse.writeFileSync(path.join(controller_view_directory, "index.ejs")," ");

    console.log("Finished");
}

exports.process = function() {
    const controllers = require('../app/controllers/application-controller').controllers;

    controllers.forEach((controller, i) => {
        
        let routes = Object.assign({}, 
            require(path.join(controllers_dir, `${controller}-controller.js`)).routes);
        
        for(var route in routes) {
            if(routes.hasOwnProperty(route)) {
                routes[route]();
            }
        }
        // routes.forEach((route, i) => {
        //     route();
        // })
    });
}



