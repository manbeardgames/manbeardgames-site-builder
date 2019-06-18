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
    log(`Sass files found: ${fileList.length}`);

    //  Render each sass file
    fileList.forEach((file, i) => {
        //  Get the file data
        let fileInfo = path.parse(file);
        log(`    Processing ${fileInfo.name}`);

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
    log(`Copying images from '${paths.source.images}' to '${paths.build.images}'`);
    fse.copy(paths.source.images, paths.build.images);
}

//  ===================================================================================
/**
 * Processes the javascript files in the srcPath and outputs them in the buildPath
 */
//  ===================================================================================
function ProcessJavaScript() {
    //  Copy over the javascript files
    log(`Copying javascript files from '${paths.source.js}' to '${paths.build.js}'`);
    fse.copy(paths.source.js, paths.build.js);
}

//  ===================================================================================
/**
 * Processes the vendor files in the srcPath and outputs them in the buildPath
 */
//  ===================================================================================
function ProcessVendor() {
    log("Copying vendor files from source to build");
    for (var vendor in paths.source.vendor) {
        log(`    Copying files for ${vendor}`)
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
    log(`Pages found: ${pageList.length}`);

    //  Iterage the page list
    pageList.forEach((page, i) => {
        //  Get the file info on the page
        let fileInfo = path.parse(page);
        log(`    Processing ${page}`);

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
 * This is the absolute new one, all others shoudl be removed when this is finished
 */
//  ===================================================================================
function ProcessTutorials() {
    log('Processing Tutorials');
    //  First we need to read the contents of the tutorail config JSOn file
    let tutorialConfigJson = fse.readFileSync('./source/tutorials/config.json');

    //  next we parse the JSON into an object that we can work with
    let tutorialConfig = JSON.parse(tutorialConfigJson);

    //  Next we need to ensure that the output directory exists
    fse.ensureDirSync(tutorialConfig.output_dir);

    //  Next we need to process all of the individual (not part of a series) tutorials
    tutorialConfig.tutorials.forEach((tutorial, i) => {
        log(`    Processing ${tutorial.title} (${i + 1} of ${tutorialConfig.tutorials.length})`);

        //  Check to see first if the tutorial is marked as a series
        if (tutorial.isSeries) {
            log(`        ${tutorial.title} is a series, processing as series`);
            //  If it is a series, then we need to process first the individual tutorails
            //  in the series, then process an index page for the series itself
            tutorial.tutorials.forEach((sub_tutorial, i) => {
                log(`        Processing ${sub_tutorial.title} (${i + 1} of ${tutorial.tutorials.length})`);
                //  First render the sub tutorial
                let render = RenderTutorial(sub_tutorial);

                //  Ensure the directory to output to exists
                fse.ensureDirSync(sub_tutorial.output_dir);

                //  Write the final rendered HTML file to disk
                fse.writeFileSync(path.join(sub_tutorial.output_dir, 'index.html'), render);
            })

            //  Now use the _series_index partial to render the index page for the series
            let partialContent = fse.readFileSync('./source/partials/tutorials/_series_index.ejs', 'utf-8');
            let partialRender = ejs.render(
                partialContent,
                Object.assign({}, {
                    series_name: tutorial.title,
                    series_description: tutorial.short,
                    tutorials: tutorial.tutorials,
                    filename: './source/partials/tutorials/_series_index.ejs'
                })
            );
            let layoutFileName = path.join('./source/layouts', tutorial.layout + '.ejs');
            let layoutFileContent = fse.readFileSync(layoutFileName, 'utf-8');
            let seriesRender = ejs.render(
                layoutFileContent,
                Object.assign({}, {
                    page: {
                        "title": tutorial.title,
                        "description": tutorial.description,
                        "ogtitle": tutorial.opengraph.title,
                        "ogimage": tutorial.opengraph.image,
                        "ogdescription": tutorial.opengraph.description
                    },
                    body: partialRender,
                    filename: layoutFileName
                })
            );

            fse.ensureDirSync(path.join('./public/tutorials', ));

            fse.writeFileSync(path.join(tutorial.output_dir, 'index.html'), seriesRender);


        } else {
            //  Render the tutorial
            var render = RenderTutorial(tutorial);

            //  Ensure the directory to output to exists
            fse.ensureDirSync(tutorial.output_dir);

            //  Write the final rendered HTML file to disk
            fse.writeFileSync(path.join(tutorial.output_dir, 'index.html'), render);
        }
    })


    //  The main tutorial page uses the same _series_index partial as the other series pages
    let partialContent = fse.readFileSync('./source/partials/tutorials/_series_index.ejs', 'utf-8');

    //  Render the content
    let partialRender = ejs.render(
        partialContent,
        Object.assign({}, {
            series_name: tutorialConfig.title,
            series_description: tutorialConfig.short,
            tutorials: tutorialConfig.tutorials,
            filename: './source/partials/tutorials/_series_index.ejs'
        })
    );

    //  Genereate the filename of hte layout to use based on the layout config
    let layoutFileName = path.join('./source/layouts', tutorialConfig.layout + '.ejs');

    //  Read the contents of the layout file
    let layoutFileContent = fse.readFileSync(layoutFileName, 'utf-8');

    //  Perform the finel render using ejs
    let finalRender = ejs.render(
        layoutFileContent,
        Object.assign({}, {
            page: {
                "title": tutorialConfig.title,
                "description": tutorialConfig.description,
                "ogtitle": tutorialConfig.opengraph.title,
                "ogimage": tutorialConfig.opengraph.image,
                "ogdescription": tutorialConfig.opengraph.description
            },
            body: partialRender,
            filename: layoutFileName
        })
    )

    //  Ensure the directory to output to exists
    fse.ensureDirSync(tutorialConfig.output_dir);

    //  Write the final rendered HTML file
    fse.writeFileSync(path.join(tutorialConfig.output_dir, 'index.html'), finalRender);



}

function RenderTutorial(tutorial) {
    //  Read the contents of hte tutorial file associated with this tutorial
    var fileContent = fse.readFileSync(path.join(tutorial.source_dir, tutorial.file_name + tutorial.file_ext), 'utf-8');

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

function log(message) {
    console.log(`[${new Date().toLocaleDateString()}] | [${new Date().toLocaleTimeString()}] | ${message}`)
}