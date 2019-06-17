const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const config = require('../site.config');
const sass = require('sass');
const paths = require('../paths');
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['csharp']);

// marked.setOptions({
//     highlight: function(code, lang, callback) {
//         let coded = '';
//         pygmentize({lang: lang, format: 'html'}, code, (err, result) => {
//             coded = result.toString();
//         });
//         return coded;
//     }
//   });

marked.setOptions({
    gfm: true
});


//  Clear build path
fse.emptyDirSync(paths.build.root);
fse.emptyDirSync(paths.temp.root);

ProcessSass();
ProcessImages();
ProcessJavaScript();
ProcessVendor();
ProcessPages();
GenerateDevBlog();
// GenerateTutorials();
//GenerateTutorials_New();
ProcessTutorials();


//  ===================================================================================
/**
 * Processes the Sass files in the srcPath and outputs the CSS file in the buildPath
 */
//  ===================================================================================
function ProcessSass() {
    //  Get any .scss files that do not have a _ in the  beginning
    let fileList = glob.sync('**/!(_)*.scss', {
        cwd: paths.source.sass
    });
    console.log(`Sass files found: ${fileList.length}`);

    //  Render each sass file
    fileList.forEach((file, i) => {
        //  Get the file data
        let fileInfo = path.parse(file);
        console.log(`    Processing ${fileInfo.name}`);

        //  Create the destiniation directory
        fse.ensureDir(paths.build.sass);

        //  Create full filepath to the Sass file
        let filePath = path.join(paths.source.sass, fileInfo.dir, `${fileInfo.name}${fileInfo.ext}`);

        //  render the Sass to CSS
        let result = sass.renderSync({
            file: filePath
        });

        //  Ouput the result as a .css file
        fse.writeFileSync(path.join(paths.build.sass, `${fileInfo.name}.css`), result.css);
    });
}

//  ===================================================================================
/**
 * Processes the image files in the srcPath and outputs them in the buildPath
 */
//  ===================================================================================
function ProcessImages() {
    console.log(`Copying images from '${paths.source.images}' to '${paths.build.images}'`);
    fse.copy(paths.source.images, paths.build.images);
}

//  ===================================================================================
/**
 * Processes the javascript files in the srcPath and outputs them in the buildPath
 */
//  ===================================================================================
function ProcessJavaScript() {
    //  Copy over the javascript files
    console.log(`Copying javascript files from '${paths.source.js}' to '${paths.build.js}'`);
    fse.copy(paths.source.js, paths.build.js);
}

//  ===================================================================================
/**
 * Processes the vendor files in the srcPath and outputs them in the buildPath
 */
//  ===================================================================================
function ProcessVendor() {
    console.log("Copying vendor files from source to build");
    for (var vendor in paths.source.vendor) {
        console.log(`    Copying files for ${vendor}`)
        fse.copy(paths.source.vendor[vendor], paths.build.vendor[vendor]);
    }
}

//  ===================================================================================
/**
 * Processes the EJS pages in the srcPath and outputs the HTML version in the buildPath
 */
//  ===================================================================================
function ProcessPages() {
    //  Get the master games collection
    let gamesJson = fse.readFileSync(path.join(paths.source.data, 'games_list.json'));
    let games = JSON.parse(gamesJson);

    //  Get a list of all the pages
    let pageList = glob.sync('**/*.@(md|ejs|html)', {
        cwd: paths.source.pages
    });
    console.log(`Pages found: ${pageList.length}`);

    //  Iterage the page list
    pageList.forEach((page, i) => {
        //  Get the file info on the page
        let fileInfo = path.parse(page);
        console.log(`    Processing ${page}`);

        //  Generate the full path to the page file
        let fullFilePath = path.join(paths.source.pages, page);

        //  Create the path for the build directory
        let buildDir = path.join(paths.build.root, fileInfo.dir);

        //  Create the build directory
        fse.ensureDirSync(buildDir);

        //  Read the contents of the file for the page
        let pageContent = fse.readFileSync(fullFilePath, 'utf-8');

        //  Get the front matter from the page content
        let fMatter = frontMatter(pageContent);

        //  Create the page data from the front matter
        let pageData = Object.assign({}, {
            site: fMatter.attributes.site,
            og: fMatter.attributes.og,
            page: fMatter.attributes.page,
            games: games
        });

        //  Render the page based on the file extension.
        let renderedPage;
        switch (fileInfo.ext) {
            case '.md':
                renderedPage = marked(fMatter.body);
                break;
            case '.ejs':
                renderedPage = ejs.render(fMatter.body, pageData, {
                    filename: fullFilePath
                });
                break;
            default:
                renderedPage = fMatter.body;
        }

        //  Get the name of the layout to use (flexed is default if not provided)
        let layoutName = fMatter.attributes.page.layout || 'default';

        //  Get the path to the layout file.
        let layoutFilePath = path.join(paths.source.layouts, `${layoutName}.ejs`);

        //  Read the contents of the file for the layout. We'll use thise
        //  during the render steps below.
        let layoutContent = fse.readFileSync(layoutFilePath, 'utf-8');

        //  Create the data to be used by the layout
        let layoutData = Object.assign({}, pageData, {
            body: renderedPage,
            filename: layoutFilePath
        })

        //  If the layout is the 'game' layout, then assign the extra game
        //  data needed
        if (layoutName === 'game') {
            //  Get a list of all the screenshot files
            let screenshots = glob.sync('**/*', {
                cwd: path.join(paths.source.pages, fileInfo.dir, "img", "screenshots")
            });
            layoutData = Object.assign({}, layoutData, {
                game: fMatter.attributes.game,
                screenshots: screenshots
            });
        }

        //  Render the layout
        let renderedLayout = ejs.render(layoutContent, layoutData);

        //  Write the render to disk as a .html file
        fse.writeFileSync(path.join(buildDir, `${fileInfo.name}.html`), renderedLayout);

    })
}

//  ===================================================================================
/**
 * Processes all dev-blog posts and returns back a collection of the names of
 * each post
 */
//  ===================================================================================
function ProcessPosts() {

    //  Get the list of all posts
    let postFiles = glob.sync('**/*.md', {
        cwd: paths.source.posts
    });

    //  Go through each post file
    let blogData = [];
    postFiles.forEach((post, i) => {

        //  Get the fileInfo
        let fileInfo = path.parse(post);

        //  Create the build directory
        let buildDir = path.join(paths.build.devblog, fileInfo.name);

        //  Make the directory
        fse.ensureDirSync(buildDir);

        //  Read the page
        let pageTemplete = fse.readFileSync(path.join(paths.source.posts, post), 'utf-8');

        //  Extract the front matter
        let fMatter = frontMatter(pageTemplete);

        let pageData = Object.assign({}, config, {
            page: fMatter.attributes,
        });


        //  Render the marked
        var markedRenderer = new marked.Renderer();
        markedRenderer.heading = function (text, level) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `
            <h${level} id=${escapedText}>${text}</h${level}>`;
        }
        let renderedPost = marked(fMatter.body, {
            renderer: markedRenderer
        });

        //  Determine which layout to use
        let layout = fMatter.attributes.layout || 'blog-post';

        //  Generate the file name of the layout
        let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

        //  Read the data from the layout file
        let layoutTemplete = fse.readFileSync(layoutFileName, 'utf-8');

        //  Render the layout
        let completePage = ejs.render(
            layoutTemplete,
            Object.assign({}, pageData, {
                body: renderedPost,
                filename: layoutFileName
            })
        );

        //  Generate the path to write the file
        let finalFilePath = `${buildDir}/index.html`;

        //  Write to file
        fse.writeFileSync(finalFilePath, completePage);


        //  Add the neccessary info to the blogdata
        blogData.push({
            title: fMatter.attributes.title,
            short: fMatter.attributes.short,
            date: fMatter.attributes.date,
            cover: `/img/posts/${fileInfo.name}/post-cover.png`,
            url: `/dev-blog/${fileInfo.name}`
        });
    });

    //  Return the blog data
    return blogData;
}

//  ===================================================================================
/**
 * Generates the dev-blog 
 */
//  ===================================================================================
function GenerateDevBlog() {

    //  Ensure the dev-blog build directory exists
    fse.ensureDir(paths.build.devblog);

    //  Generate all of the dev-blog posts. 
    let blogData = ProcessPosts();

    //  Get the dev blog partial
    let fileInfo = path.parse(paths.source.devblog);

    //  Read the page file
    let pageTemplete = fse.readFileSync(paths.source.devblog, 'utf-8');

    //  Get the front matter
    let fMatter = frontMatter(pageTemplete);

    //  Create the data object for the page
    let pageData = Object.assign({}, config, {
        page: fMatter.attributes,
        posts: blogData
    });

    //  Generate the page content
    let renderedPage = ejs.render(fMatter.body, pageData, {
        filename: paths.source.devblog
    });

    //  Determine which layout to use
    let layout = fMatter.attributes.layout || 'default';

    //  Generate the file name of the layout
    let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

    //  Read the data from the layout file
    let layoutTemplate = fse.readFileSync(layoutFileName, 'utf-8');

    //  Render the layout usin the rendered page from above as the body
    let completePage = ejs.render(layoutTemplate, Object.assign({}, pageData, {
        body: renderedPage,
        filename: layoutFileName
    }));

    //  Generate the output path
    let completePath = path.join(paths.build.pages, 'dev-blog', 'index.html');

    //  Save the html file
    fse.writeFileSync(completePath, completePage);
}


//  ===================================================================================
/**
 * Generates the tutorials
 */
//  ===================================================================================
function GenerateTutorials() {
    //  Ensure the dev-blog build directory exists
    fse.ensureDir(paths.build.tutorials);

    //  Generate all of the tutorial posts. 
    let tutorials = ProcessTutorials();

    //  Generate the path to the tutorial index partial
    let filePath = path.join(paths.source.partials, '_tutorials.ejs');

    //  Get the tutorial index partial
    let fileInfo = path.parse(filePath);

    //  Read the page file
    let pageTemplete = fse.readFileSync(filePath, 'utf-8');

    //  Get the front matter
    let fMatter = frontMatter(pageTemplete);

    //  Create the data object for the page
    let pageData = Object.assign({}, config, {
        page: fMatter.attributes,
        tutorials: tutorials
    });

    //  Generate the page content
    let renderedPage = ejs.render(fMatter.body, pageData, {
        filename: filePath
    });

    //  Determine which layout to use
    let layout = fMatter.attributes.layout || 'default';

    //  Generate the file name of the layout
    let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

    //  Read the data from the layout file
    let layoutTemplate = fse.readFileSync(layoutFileName, 'utf-8');

    //  Render the layout usin the rendered page from above as the body
    let completePage = ejs.render(layoutTemplate, Object.assign({}, pageData, {
        body: renderedPage,
        filename: layoutFileName
    }));

    //  Generate the output path
    let completePath = path.join(paths.build.tutorials, 'index.html');

    //  Save the html file
    fse.writeFileSync(completePath, completePage);
}

//  ===================================================================================
/**
 * Processes the tutorial pages
 */
//  ===================================================================================
function ProcessTutorials_old() {
    //  Ensure the directory exists
    fse.ensureDirSync(paths.build.tutorials);

    let navHeaders = GenerateTutorialNavHeaders();
    let seriesData = GenerateTutorialSeriesData();

    //  Get a list of all the tutorial files
    let tutorialFiles = glob.sync('**/*.md', {
        cwd: paths.source.tutorials
    });

    tutorialFiles.forEach((tutorial, i) => {
        //  Get hte file info
        let fileInfo = path.parse(tutorial);

        let dirSpine = fileInfo.dir.replace(/[0-9]+-/g, '');
        let nameSpine = fileInfo.name.replace(/[0-9]+-/g, '');

        //  Generate the build directory path string
        let buildDir = path.join(paths.build.tutorials, dirSpine, nameSpine);

        //  Make the directory
        fse.ensureDirSync(buildDir);

        //  Read the page
        let pageTemplete = fse.readFileSync(path.join(paths.source.tutorials, tutorial), 'utf-8');

        //  Extract the front matter
        let fMatter = frontMatter(pageTemplete);

        let pageData = Object.assign({}, config, {
            page: fMatter.attributes
        });

        //  Render the marked
        var markedRenderer = new marked.Renderer();
        markedRenderer.heading = function (text, level) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            var style = level === 1 ? "title" : level === 2 ? "heading" : "sub-heading";
            return `
            <h${level} class="${style}" id=${escapedText}>${text}</h${level}>`;
        }

        markedRenderer.code = function (code, language, isEscapsed) {
            var html = prism.highlight(code, prism.languages.csharp, language);
            return `
            <pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`;
            // return `
            // <pre><code class="${language}">${code}</code></pre>`

        }

        markedRenderer.image = function (href, title, text) {
            var imgPath = path.join('/img', 'tutorials', dirSpine, nameSpine, href);
            return `<img class="img-fluid" src="${imgPath}" alt="${title}" />`;
        }

        markedRenderer.link = function (href, title, text) {
            var link = marked.Renderer.prototype.link.call(this, href, title, text);
            return link.replace('<a', '<a target="_blank"');
        }
        let renderedPost = marked(fMatter.body, {
            renderer: markedRenderer
        });

        //  Determine which layout to use
        let layout = fMatter.attributes.layout || 'tutorials';

        //  Generate the file name of the layout
        let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

        //  Read teh data from the layout file
        let layoutTemplete = fse.readFileSync(layoutFileName, 'utf-8');

        //  Render the layout
        let completePage = ejs.render(
            layoutTemplete,
            Object.assign({}, pageData, {
                body: renderedPost,
                filename: layoutFileName,
                tutorials: seriesData,
                navHeaders: navHeaders
            })
        );

        //  Generate the path to write the file
        let finalFilePath = `${buildDir}/index.html`;

        //  Write to file
        fse.writeFileSync(finalFilePath, completePage);

    });

    return seriesData;

    // //  Process the tutorial pages
    // let tutorialData = ProcessTutorials();
}

function GenerateTutorialSeriesData() {
    //  Get a list of all the tutorial files
    let tutorialFiles = glob.sync('**/*.md', {
        cwd: paths.source.tutorials
    });

    //  Start a collection of the tutorial series.  A series is the base folder that
    //  the individual tutorials are located in
    let series = [];

    //  Iterate all of the tutorial files and process them for the colleciton
    tutorialFiles.forEach((tutorial, i) => {
        //  Get hte file info of the tutorial file
        let fileInfo = path.parse(tutorial);

        //  Add the directory name of the file to the series array
        series.push({
            name: fileInfo.dir,
            tutorials: []
        });
    });

    //  FIlter the series collection so that it only contains the unique values
    series = series.filter((value, index, self) => {
        return index === self.findIndex((s) => s.name === value.name);
    });

    //  Get the description of each series
    for (var i = 0; i < series.length; i++) {
        let descriptionFilePath = path.join(paths.source.tutorials, series[i].name, 'description.yaml');

        //  Read the description file
        let descriptionMatter = fse.readFileSync(descriptionFilePath, 'utf-8');

        //  Parse the frontmatter
        let fMatter = frontMatter(descriptionMatter);

        //  Store the description
        series[i].description = fMatter.attributes.description;
    }

    //  Add all files into the tutorials collection of the appropriate series
    tutorialFiles.forEach((tutorial, i) => {
        //  Get the file info of the tutorial file
        let fileInfo = path.parse(tutorial);
        //  Get the index of the series in the series colleciton that this tutorial
        //  belongs to
        let idx = series.findIndex(s => s.name === fileInfo.dir);
        //  Add the tutorial name to the tutorials colleciton of the series at
        //  the found index
        series[idx].tutorials.push({
            name: fileInfo.name
        });
    });

    //  Sort the series by name
    series.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    });

    //  Sort each tutorial by name
    let idx = 0;
    for (idx = 0; idx < series.length; idx++) {
        series[idx].tutorials.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    //  Sanatize the names of all series and tutorials so that the numbers
    //  are removed and they are in title case
    series.forEach((series, i) => {
        series.nameSpine = series.name.replace(/[0-9]+-/g, '');
        series.name = series.nameSpine;
        series.name = series.name.split('-').join(' ');
        series.name = series.name
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

        series.tutorials.forEach((tutorial, i) => {
            tutorial.nameSpine = tutorial.name.replace(/[0-9]+-/g, '');
            tutorial.name = tutorial.nameSpine;
            tutorial.name = tutorial.name.split('-').join(' ');
            tutorial.name = tutorial.name
                .toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        });

    });

    return series;

}


function GenerateTutorialNavHeaders() {
    //  Get a list of all the tutorial files
    let tutorialFiles = glob.sync('**/*.md', {
        cwd: paths.source.tutorials
    });
    //let directories = []

    let headers = [];
    tutorialFiles.forEach((tutorial, i) => {
        //  Get the file info of the tutorial file
        let fileInfo = path.parse(tutorial);
        //  Add the directory fo the file to the headers array
        //directories.push(fileInfo.dir);
        headers.push({
            name: fileInfo.dir,
            subHeaders: []
        });
    });

    //  Filter the headers so that it only contains the unique values
    headers = headers.filter((value, index, self) => {
        return index === self.findIndex((h) => h.name === value.name);
    });

    //  Add all files into the subheader collection of the appropriate header
    tutorialFiles.forEach((tutorial, i) => {
        let fileInfo = path.parse(tutorial);
        let idx = headers.findIndex(x => x.name === fileInfo.dir);
        headers[idx].subHeaders.push({
            name: fileInfo.name
        });
    });

    //  Sort the headers by name
    headers.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    });

    //  Sort each subheader by name
    let idx = 0;
    for (idx = 0; idx < headers.length; idx++) {
        headers[idx].subHeaders.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });
    };

    //  Sanatize the names of all headers and subheaders so that
    //  the numbers are removed and they are in title case
    headers.forEach((header, i) => {
        header.nameSpine = header.name.replace(/[0-9]+-/g, '');
        header.name = header.nameSpine;
        header.name = header.name.split('-').join(' ');
        header.name = header.name
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

        header.subHeaders.forEach((subHeader, i) => {
            subHeader.nameSpine = subHeader.name.replace(/[0-9]+-/g, '');
            subHeader.name = subHeader.nameSpine;
            subHeader.name = subHeader.name.split('-').join(' ');
            subHeader.name = subHeader.name
                .toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        });
    });

    return headers;
}


function GenerateTutorials_New() {

    //  Ensure the tutorials build directory exists
    fse.ensureDir('./public/tutorials/');

    //  Generate all of the tutorial posts
    let tutorialData = ProcessTutorials_New();

    //  Get the tutorial partial
    // let filePath = path.parse(paths.source.partials, '_tutorials.ejs');
    let filePath = path.join(paths.source.partials, '_tutorials.ejs');

    //  Read the page file
    let pageTempelte = fse.readFileSync(filePath, 'utf-8');

    //  Get the front matter
    let fMatter = frontMatter(pageTempelte);

    //  Create the data object for the page
    let pageData = Object.assign({}, config, {
        page: fMatter.attributes,
        tutorials: tutorialData
    });

    //  Generate the page content
    let renderedPage = ejs.render(fMatter.body, pageData, {
        fileName: filePath
    });

    //  Determine which layout to use
    let layout = fMatter.attributes.layout || 'default';

    //  Generate the file name of hte layout
    let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

    //  Read teh data from the layout file
    let layoutTemplete = fse.readFileSync(layoutFileName, 'utf-8');

    //  Render the layout using the rendered page from above as the body
    let completePage = ejs.render(layoutTemplete, Object.assign({}, pageData, {
        body: renderedPage,
        filename: layoutFileName
    }));

    //  Genereate the output path
    let completePath = path.join(paths.build.pages, 'tutorials', 'index.html');

    //  Save the html file
    fse.writeFileSync(completePath, completePage);





    // //  Ensure that the tutorials build directory exists
    // fse.ensureDir(paths.build.tutorial);

    // //  Process all of the tutorials and receive back a list
    // //  of all the tutorials
    // let tutorials = ProcessTutorials_New();

    // //  Generate the path to the tutorial index partial
    // let filePath = path.join(paths.source.partials, '_tutorials.ejs');

    // //  Get the file info of the tutorial index partial
    // let fileInfo = path.parse(filePath);

    // //  Read the page templete
    // let pageTemplete = fse.readFileSync(filePath, 'utf-8');

    // //  Get the front matter
    // let fMatter = frontMatter(pageTemplete);

    // //  Create the data object for the page
    // let pageData = Object.assign({}, config, {
    //     page: fMatter.attributes
    // })



}

function ProcessTutorials_New() {

    //  First load the config.json for the tutotials directory
    let tutorialConfigJson = fse.readFileSync('./source/tutorials/config.json');
    let tutorialConfig = JSON.parse(tutorialConfigJson);

    //  First process all of the individual tutorials
    tutorialConfig.tutorials.forEach((tutorial, i) => {
        //  Get the file info
        let fileInfo = path.parse(`./source/tutorials/${tutorial}.md`);

        // Create the build directory
        let buildDIr = path.join(`./public/tutorials/${tutorial}`)

        //  Ensure the directory exists
        fse.ensureDirSync(buildDir);

        //  Read the page
        let pageTemplate = fse.readFileSync(`./source/tutorials/${tutorial}.md`, 'utf-8');

        //  Extract the front matter
        let fMatter = frontMatter(pageTemplate);

        //  Create the page data
        let pageData = Object.assign({}, config, {
            page: fMatter.attributes
        });

        //  Create the MarkDown renderer
        var markRenderer = new marked.Renderer();

        //  How headings are processed
        markedRenderer.heading = function (text, level) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `
            <h${level} id=${escapedText}>${text}</h${level}>`;
        }

        //  How code sections are handled
        markedRenderer.code = function (code, language, isEscapsed) {
            var html = prism.highlight(code, prism.languages.csharp, language);
            return `
            <pre class="language-${language}"><code class = "language-${language}">${html}</code></pre>`;
        }

        //  how images are handled
        markedRenderer.image = function (href, title, text) {
            var imgPath = path.join('img', 'tutorials', tutorial, href);
            return `
            <div class="text-center">
            <img class="img-fluid border border-dark" src="\\${imgPath}" alt="${title}" />
            </div>`;
        }

        //  How links are handled
        markedRenderer.link = function (href, title, text) {
            var link = marked.Renderer.prototype.link.call(this, href, title, text);
            return link.replace('<a', '<a target="_blank"');
        }

        //  How tables are handled
        markedRenderer.table = function (header, body) {
            return `
            <table class="table"><thead class="thead-dark">${header}</thead><tbody>${body}</tbody></table>`
        }

        //  How block quaotes are handled
        markedRenderer.blockquote = function (quote) {
            return `
            <div class="card text-white bg-dark mb-3">
            <div class="card-header">
            <span class="lead">Note:</span>
            </div>
            <div class="card-body">
            ${quote}
            </div>
            </div>`
        }

        //  Render the MarkDown as HTML
        let renderedPost = marked(fMatter.body, {
            renderer: markedRenderer
        });

        //  Determine which layout to use
        let layout = fMatter.attributes.layout || 'tutorial';

        //  Read the data from the layout file
        let layoutTemplate = fse.readFileSync(`./source.layouts/${layout}.ejs`, 'utf-8');

        //  Render the layout
        let completePage = ejs.render(
            layoutTemplate,
            Object.assign({}, pageData, {
                body: renderedPost,
                filename: `./source/layouts/${layout}.ejs`
            })
        );

        //  Generate the path to write the file
        let finalFilePath = `./public/tutorials/${tutorial}/index.html`

        //  Write to file
        fse.writeFileSync(finalFilePath, completePage);
    })

    //  Get a list of all tutorials
    let tutorialFiles = glob.sync('**/*.md', {
        cwd: './source/tutorials/'
    });

    //  Got through each tutorial file and process it
    let tutorialData = [];
    tutorialFiles.forEach((tutorial, i) => {
        //  Get the file info
        let fileInfo = path.parse(tutorial);

        //  Create the build directory
        let buildDir = path.join(paths.build.tutorials, fileInfo.name);

        //  Make the directory
        fse.ensureDirSync(buildDir);

        //  Read the page
        let pageTemplete = fse.readFileSync(path.join(paths.source.tutorials, tutorial), 'utf-8');

        //  Extract the front matter
        let fMatter = frontMatter(pageTemplete);

        let pageData = Object.assign({}, config, {
            page: fMatter.attributes,
        });


        //  Render the markdown
        var markedRenderer = new marked.Renderer();
        // markedRenderer.heading = function (text, level) {
        //     var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        //     var style = level === 1 ? "title" : level == 2 ? "heading" : "sub-heading";
        //     return `
        //     <h${level} class="${style}" id=${escapedText}>${text}</h${level}`;
        // }

        markedRenderer.heading = function (text, level) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `
            <h${level} id=${escapedText}>${text}</h${level}>`;
        }

        markedRenderer.code = function (code, language, isEscapsed) {
            var html = prism.highlight(code, prism.languages.csharp, language);
            return `
            <pre class="language-${language}"><code class = "language-${language}">${html}</code></pre>`;
        }

        markedRenderer.image = function (href, title, text) {
            var imgPath = path.join('img', 'tutorials', fileInfo.name, href);
            // var imgPath = path.join('/img', 'tutorials', dirSpine, nameSpine, href);
            return `
            <div class="text-center">
            <img class="img-fluid border border-dark" src="\\${imgPath}" alt="${title}" />
            </div>`;
        }

        markedRenderer.link = function (href, title, text) {
            var link = marked.Renderer.prototype.link.call(this, href, title, text);
            return link.replace('<a', '<a target="_blank"');
        }

        markedRenderer.table = function (header, body) {
            return `
            <table class="table"><thead class="thead-dark">${header}</thead><tbody>${body}</tbody></table>`
        }

        markedRenderer.blockquote = function (quote) {
            return `
            <div class="card text-white bg-dark mb-3">
            <div class="card-header">
            <span class="lead">Note:</span>
            </div>
            <div class="card-body">
            ${quote}
            </div>
            </div>`
        }

        let renderedPost = marked(fMatter.body, {
            renderer: markedRenderer
        });

        //  Determine which layout to use
        let layout = fMatter.attributes.layout || 'tutorial';

        //  Generate the file naem of the layout
        let layoutFileName = path.join(paths.source.layouts, layout + '.ejs');

        //  Read the data from the layout file
        let layoutTemplate = fse.readFileSync(layoutFileName, 'utf-8');

        //  Render the layout
        let completePage = ejs.render(
            layoutTemplate,
            Object.assign({}, pageData, {
                body: renderedPost,
                filename: layoutFileName
            })
        );

        //  Generate the path to write the file
        let finalFilePath = `${buildDir}/index.html`;

        //  Write to file
        fse.writeFileSync(finalFilePath, completePage);

        if (fMatter.attributes.publish === "ok") {
            //  Add the neccessary info to the tutorialdata
            tutorialData.push({
                title: fMatter.attributes.title,
                short: fMatter.attributes.short,
                date: fMatter.attributes.date,
                index: fMatter.attributes.index,
                cover: `/img/tutorials/${fileInfo.name}/tutorial-cover.png`,
                url: `/tutorials/${fileInfo.name}`
            });
        }
    });

    //  Sort the tutorials by their index
    tutorialData.sort((a, b) => {
        if (a.index < b.index) {
            return -1;
        } else if (a.index > b.index) {
            return 1;
        } else {
            return 0;
        }
    });

    //  Return the tutorial data
    return tutorialData;
}

//  ===================================================================================
/**
 * Processes the tutorial pages
 * This is the absolute new one, all others shoudl be removed when this is finished
 */
//  ===================================================================================
function ProcessTutorials() {
    //  First we need to read the contents of the tutorail config JSOn file
    let tutorialConfigJson = fse.readFileSync('./source/tutorials/config.json');

    //  next we parse the JSON into an object that we can work with
    let tutorialConfig = JSON.parse(tutorialConfigJson);

    //  Next we need to ensure that the output directory exists
    fse.ensureDirSync(tutorialConfig.outputDirectory);

    //  Next we need to process all of the individual (not part of a series) tutorials
    tutorialConfig.tutorials.forEach((tutorial, i) => {
        //  Read the contents of the tutorial file associated with this tutorial
        var fileContent = fse.readFileSync(path.join(tutorial.sourceDir, tutorial.fileName + tutorial.fileExt), 'utf-8');

        //  Render the file contents using a marked renderer
        var render = RenderMark_Tutorials(fileContent);

        //  Generate the filename of the layout to use based on the layout config for the tutoria
        let layoutFileName = path.join('./source/layouts', tutorial.layout + '.ejs');

        //  Read the contents of the layout file
        let layoutFileContent = fse.readFileSync(layoutFileName, 'utf-8');

        //  Perform the final render using ejs
        let finalRender = ejs.render(
            layoutFileContent,
            Object.assign({}, {
                page: {
                    "title": tutorial.title,
                    "description": tutorial.short,
                    "ogtitle": tutorial.opengraph.title,
                    "ogimage": tutorial.opengraph.image,
                    "ogdescription": tutorial.opengraph.description
                },
                body: render,
                filename: layoutFileName
            })
        );

        //  Ensure the directory to output to exists
        fse.ensureDirSync(tutorial.outputDir);

        //  Write the final rendered HTMl file to disk
        fse.writeFileSync(path.join(tutorial.outputDir, 'index.html'), finalRender);
    })

    //  Next we process all of the series tutorials
    tutorialConfig.series.forEach((series, i) => {
        //  process all of the individual tutorials that are part of this series
        series.tutorials.forEach((tutorial, i) => {
            //  Render the tutorial
            var render = RenderTutorial(tutorial);

            //  Ensure the directory to output to exists
            fse.ensureDirSync(tutorial.outputDir);

            //  Write the final rendered HTML file to disk
            fse.writeFileSync(path.join(tutorial.outputDir, 'index.html'), render);
        })

    })

}

function RenderTutorial(tutorial) {
    //  Read the contents of hte tutorial file associated with this tutorial
    var fileContent = fse.readFileSync(path.join(tutorial.sourceDir, tutorial.fileName + tutorial.fileExt), 'utf-8');

    //  Render the file contents using a marked renderer
    var render = RenderMark_Tutorials(fileContent);

    //  Generate the filename of the layout to use based on the layout config for the tutorial
    let layoutFileName = path.join('./source/layouts', tutorial.layout + '.ejs');

    //  Read the contents of the layout file
    let layoutFileContent = fse.readFileSync(layoutFileName, 'utf-8');

    //  Perform the final render using ejs
    let finalRender = ejs.render(
        layoutFileContent,
        Object.assign({}, {
            page: {
                "title": tutorial.title,
                "description": tutorial.short,
                "ogtitle": tutorial.opengraph.title,
                "ogimage": tutorial.opengraph.image,
                "ogdescription": tutorial.opengraph.description
            },
            body: render,
            filename: layoutFileName
        })
    );

    return finalRender;
}



function RenderMark_Tutorials(fileContent) {
    //  Create a new MarkDown renderer
    var renderer = new marked.Renderer();

    //  Configure how to render heading tags
    renderer.heading = function (text, level) {
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `
        <h${level} id=${escapedText}>${text}</h${level}>`;
    }

    //  Configure how to render code tags
    renderer.code = function (code, language, isEscapsed) {
        var html = prism.highlight(code, prism.languages.csharp, language);
        return `
        <pre class="language-${language}"><code class = "language-${language}">${html}</code></pre>`;
    }

    //  Configure how to render image tags
    //  TODO: This will break. Need to redo how images are done

    renderer.image = function (href, title, text) {
        var imgPath = path.join('img', 'tutorials', href);
        // var imgPath = path.join('/img', 'tutorials', dirSpine, nameSpine, href);
        return `
        <div class="text-center">
        <img class="img-fluid border border-dark" src="\\${imgPath}" alt="${title}" />
        </div>`;
    }

    //  Configure how to render link tags
    renderer.link = function (href, title, text) {
        var link = marked.Renderer.prototype.link.call(this, href, title, text);
        return link.replace('<a', '<a target="_blank"');
    }

    //  Configure how to render table tags
    renderer.table = function (header, body) {
        return `
        <table class="table"><thead class="thead-dark">${header}</thead><tbody>${body}</tbody></table>`
    }

    //  Configure how to render blockquote tags
    renderer.blockquote = function (quote) {
        return `
        <div class="card text-white bg-dark mb-3">
        <div class="card-header">
        <span class="lead">Note:</span>
        </div>
        <div class="card-body">
        ${quote}
        </div>
        </div>`
    }

    //  Render the markdown file contents as HTML
    let render = marked(fileContent, {
        renderer: renderer
    });

    //  Return the render
    return render;
}