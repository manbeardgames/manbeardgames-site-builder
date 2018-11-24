const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const config = require('../site.config');
const sass = require('sass');
const paths = require('../paths');

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


//  ===================================================================================
/**
 * Processes the Sass files in the srcPath and outputs the CSS file in the buildPath
 */
//  ===================================================================================
function ProcessSass() {
    //  Get any .scss files that do not have a _ in the  beginning
    let fileList = glob.sync('**/!(_)*.scss', { cwd: paths.source.sass });
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
        let result = sass.renderSync({ file: filePath });

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
    let pageList = glob.sync('**/*.@(md|ejs|html)', { cwd: paths.source.pages });
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
            let screenshots = glob.sync('**/*', { cwd: path.join(paths.source.pages, fileInfo.dir, "img", "screenshots") });
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
    let postFiles = glob.sync('**/*.md', { cwd: paths.source.posts });

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
        let renderedPost = marked(fMatter.body, { renderer: markedRenderer });

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
 * Generates the dev-blog index page
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
    let layout = fMatter.attributes.layout || 'flexed';

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

