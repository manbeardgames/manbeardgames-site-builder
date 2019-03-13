const ejs = require('ejs');
const md = require('marked');
const fm = require('front-matter');
const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const prism = require('prismjs');

/**
 * The root directory of the application
 */
const __root__dir = process.cwd();

/**
 * The base directory where all data objects are stored
 */
const db_dir = path.join(__root__dir, 'db');

const app_dir = path.join(__root__dir, 'app');

const assets_dir = path.join(app_dir, 'assets');

/**
 * The base directory where the application controllers are stored
 */
const controllers_dir = path.join(__root__dir, 'app', 'controllers');

/**
 * The base directory where the application views are stored
 */
const views_dir = path.join(__root__dir, 'app', 'views');

/**
 * The base directory where the application view layouts are stored
 */
const layouts_dir = path.join(views_dir, 'layouts');

/**
 * The base directory where the application partial views are stored
 */
const partials_dir = path.join(views_dir, 'partials');

/**
 * The base directory where the applications public files are stored
 */
const public_dir = path.join(__root__dir, 'public');

const content_dir = path.join(public_dir, 'content');


// var exports = module.exports = {};



/**
 * Renders the given EJS View
 * @param {string} body A string containing the contents of the EJS View to render
 * @param {Object} data The page data object to pass to the EJS renderer for the view
 */
function renderEjs(body, data) {
    //  Set the options for the renderer
    let options = {
        //  By setting the root directory to our "views" directory, when we want to
        //  do partials in the .ejs, we can just say <%- include('/partials/_landing') %> and
        //  it will use the path as relative from the root
        root: views_dir
    };

    //  Use the ejs module to render
    let rendered = ejs.render(body, data.page_data, options);

    //  Return the render
    return rendered;
}

/**
 * Renders the given Markdown View
 * @param {string} body A string containing the contents of the MarkDown View to render
 */
function renderMarkdown(body, opts) {
    let defopts = {
        img_path: '/content/images'
    };

    options = Object.assign({}, defopts, opts);

    //  For marked rendering, we're going to return back not only the
    //  rendered html, but also a collection of the headers that can be
    //  used for things like content tables in partials
    let headers = [];

    //  Create a new marked renderer so we can customize it for what
    //  we need in our project
    let markedRenderer = new marked.Renderer();

    //  Specifiy settings for heading tags
    markedRenderer.heading = function (text, level) {
        //  Genereate an id value for the header tag that is
        //  the header text, all lowercase with all spaces as -'s
        let id = text.toLowerCase().replace(/[^\w]+/g, '-')

        headers.push({
            id: id,
            text: text
        });

        //  Return back the html for the header
        return `<h${level} id=${id}>${text}</h${level}>`;
    }

    //  Specify rendering for code
    markedRenderer.code = function (code, language, isEscaped) {
        //  Use the prism library to highlight the code for us. Language
        //  is always C# on this site for now
        var html = prism.highlight(code, prism.languages.csharp, language);

        //  wrap the html in a pre and code tag before returning
        return `
        <pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`;
    }

    //  Specify rendering for images
    markedRenderer.image = function (href, title, text) {
        //  Generate the path to the image
        var img_path = path.join(options.img_path, href);

        //  Genereate and return the html of the img tag
        return `<img class="img-fluid" src=${img_path}" alt="${title}" />`;
    }

    //  Specify rendering for links
    markedRenderer.links = function (href, title, text) {
        //  Generate a link
        var link = marked.Renderer.prototype.link.call(this, href, title, text);

        //  Adjust the link's html so that it opens in a new window and return it
        return link.replace('<a', '<a target="_blank"');
    }

    //  Use the marked module to render with the renderer we created
    let rendered = marked(body, { renderer: markedRenderer });

    //  return the render
    return { render: rendered, headers: headers };
}

/**
 * Renders an EJS Layout
 * @param {string} name The name of the EJS Layout to render
 * @param {Object} data The data object to pass to the EJS renderer when rendering the Layout View
 */
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

/**
 * Reads the contents of a view
 * @param {string} controller The name of the controller the view belongs to
 * @param {string} view The name of the view
 */
var readView = function (controller, view) {
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

        //  Get the default view data
        let default_view_data = getDataSingle('view_data');


        //  Generate the view object based on the values from the front matter.
        //  if the front matter data does not exist, use the default view data instead
        let view_data = Object.assign({}, {
            body: front_matter.body || default_view_data.body,
            type: view_ext || default_view_data.type,
            layout: front_matter.attributes.page_layout || default_view_data.layout,
            file_path: view_file_path || default_view_data.file_path,
            page_data: {
                site_title: front_matter.attributes.site_title || default_view_data.page_data.site_title,
                site_description: front_matter.attributes.description || default_view_data.page_data.site_description,
                og_title: front_matter.attributes.og_title || default_view_data.page_data.og_title,
                og_image: front_matter.attributes.og_image || default_view_data.page_data.og_image,
                og_description: front_matter.attributes.og_description || default_view_data.page_data.og_description,
                og_type: front_matter.attributes.og_type || default_view_data.page_data.og_type,
                page_nav_header: front_matter.attributes.page_nav_header || default_view_data.page_data.page_nav_header,
                attributes: front_matter.attributes.attributes || default_view_data.page_data.attributes
            }
        });

        //  return a new object based on the view data
        return view_data;
    }
    else {
        throw `Unable to locate view ${view} in ${view_dir}`
    }
}

/**
 * Renders an EJS View
 * @param {Object} view_data An object containing the view data to pass to the EJS Renderer
 */
var renderView = function (view_data) {
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

/**
 * Saves a view to disk
 * @param {string} route The route to access the view
 * @param {string} view The rendered view to save to disk
 */
var saveView = function (route, view) {
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

/**
 * Retrives a single data object from the db folder
 * @param {string} name The name of the data object to retrieve from the db folder
 */
var getDataSingle = function (name) {
    //  Build path to the data file
    let data_file_path = path.join(db_dir, `${name}.json`);

    //  Read the data file
    let data_file_contents = fse.readFileSync(data_file_path, 'utf-8');

    //  Parse the json from the data file contents
    return JSON.parse(data_file_contents);
}

/**
 * Retrieves a collection of all data objects from the db directory specified
 * @param {string} name The name of the directory within the db folder where the data objects are stored
 */
var getDataFolder = function (name) {
    //  Build path to the data folder
    let data_folder_path = path.join(db_dir, name);

    //  Create our initial data collection
    let data = []

    //  Glob the directory to get a list of all .json files
    let data_files = glob.sync('*.json', { cwd: data_folder_path });

    //  Iterate all of the data_files, parse the json of each one,
    //  and add to the data collection
    data_files.forEach((data_file, i) => {
        //  Build that path directly to the file
        let data_file_path = path.join(data_folder_path, data_file);

        //  Get the file info
        let data_file_info = path.parse(data_file_path);

        //  Read the contents of the file
        let data_file_contents = fse.readFileSync(data_file_path, 'utf-8');

        //  Parse the json
        let data_file_as_json = JSON.parse(data_file_contents);

        //  Add it to the data collection
        data.push(data_file_as_json);
    });

    // return the data collection
    return data;
}

// ----------------------------------------------------
//  Module Exports
// ----------------------------------------------------

/**
 * A collection of all base directories within the application
 */
exports.directories = {
    root: __root__dir,
    controllers: controllers_dir,
    views: views_dir,
    layouts: layouts_dir,
    partials: partials_dir
}

/**
 * A collection of all controllers that should be run when the
 * application build task executes
 */
exports.controllers = ['home', 'games'];


exports.readView = readView;
exports.renderView = renderView;
exports.saveView = saveView;
exports.getDataSingle = getDataSingle;
exports.getDataFolder = getDataFolder;