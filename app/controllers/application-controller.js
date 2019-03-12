const ejs = require('ejs');
const md = require('marked');
const fm = require('front-matter');
const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');

const __root__dir = process.cwd();
const db_dir = path.join(__root__dir, 'db');
const controllers_dir = path.join(__root__dir, 'app', 'controllers');
const views_dir = path.join(__root__dir, 'app', 'views');
const layouts_dir = path.join(views_dir, 'layouts');
const partials_dir = path.join(views_dir, 'partials');
const public_dir = path.join(__root__dir, 'public');


// var exports = module.exports = {};

// exports.renderEjs =
function renderEjs(body, data) {
    //  Ensure that data is at the minimum an empty
    //  object
    data = Object.assign({}, data);

    //  Use the ejs module to render
    let rendered = ejs.render(body, data.page_data, {
        filename: data.file_path
    });

    //  Return the render
    return rendered;
}
// exports.renderMarkdown = 

function renderMarkdown(body) {
    //  Use the marked module to render
    let rendered = marked(body);

    //  return the render
    return rendered;
}

function renderLayout(name, data) {
    //  Locate the layout view file
    let view_file = glob.sync(`**/${name}.ejs`, { cwd: layouts_dir });

    if (view_file.length > 0) {
        //  Get the full file path to the layout
        let view_file_path = path.join(layouts_dir, view_file[0]);

        //  Read the contents of the layout view file
        let view_content = fse.readFileSync(view_file_path, 'utf-8');

        //  Render the layout view content
        let view_render = ejs.render(view_content, data, {
            filename: view_file_path
        });

        //  Return the rendered view
        return view_render
    }
    else {

        throw `Unable to locate layout with the name ${name} in ${layouts_dir}`
    }
}


exports.directories = {
    root: __root__dir,
    controllers: controllers_dir,
    views: views_dir,
    layouts: layouts_dir,
    partials: partials_dir
}

exports.controllers = ['home'];

exports.readView = function (controller, view) {
    //  Generate the path to the view dir
    let view_dir = path.join(views_dir, controller);

    //  Locate the view in the directory
    let view_file = glob.sync(`**/${view}.@(md|ejs|html)`, { cwd: view_dir });

    //  If we have 1 or more files, read the content
    if (view_file.length >= 1) {
        let view_file_path = path.join(view_dir, view_file[0]);
        let view_content = fse.readFileSync(view_file_path, 'utf-8');
        let view_ext = path.parse(view_file[0]).ext;


        //  Extract front matter
        let front_matter = fm(view_content);

        //  Generate the view object
        let view_data = Object.assign({}, {
            body: front_matter.body ? front_matter.body : '<html><head></head><body>Error Reading View</body></html>',
            type: view_ext ? view_ext : 'text',
            layout: front_matter.layout || 'default',
            file_path: view_file_path,
            page_data: {
                title: front_matter.site_title || '',
                description: front_matter.description || '',
                og_title: front_matter.og_title || '',
                og_description: front_matter.og_description || '',
                og_image: front_matter.og_image || '',
                nav_header: front_matter.nav_header || '',
                attributes: front_matter.attributes
            }
        });

        //  return the view data
        return view_data
    }
    else {
        throw `Unable to locate view ${view} in ${view_dir}`
    }
}


exports.renderView = function (view_data) {
    let renderedPage = '';
    switch (view_data.type) {
        case '.md':
            renderedPage = renderMarkdown(view_data.body);
            break;
        case '.ejs':
            renderedPage = renderEjs(view_data.body, view_data);
            break;
        default:
            renderedPage = view_data.body;
            break;
    }

    //  Get the name of the layout
    let layout_name = view_data.layout || 'default';

    //  Generate object for layout
    let layout_data = Object.assign({}, view_data.page_data, {
        body: renderedPage
    });

    //  Render the layout as EJS. All layouts should be EJS
    let finalRender = renderLayout(layout_name, layout_data);

    //  Return the final render
    return finalRender;
}

exports.saveView = function (route, view) {
    //  First ensure the public directory
    // fse.ensureDirSync(public_dir);

    //  Next build the path to the directory for the route
    let view_path = path.join(public_dir, route);

    //  Get the file info from the view_path
    let file_info = path.parse(view_path);

    //  Ensure the directory that the view is supposed to go in
    fse.ensureDirSync(file_info.dir);

    //  Write the view to disk
    fse.writeFileSync(view_path, view);
}

exports.getData = function(name) {
    //  Build path to the data file
    let data_file_path = path.join(db_dir, `${name}.json`);

    //  Read the data file
    let data_file_contents = fse.readFileSync(data_file_path, 'utf-8');

    //  Parse the json from the data file contents
    return JSON.parse(data_file_contents);
}




