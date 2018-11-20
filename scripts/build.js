const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const config = require('../site.config');
const sass = require('sass');


marked.setOptions({
    gfm: true
});

//  Get the paths object from the config
let paths = config.paths;


//  Clear build path
console.log("----------------------------------------")
console.log(' Clearing tmp and build directories')
console.log("----------------------------------------")

// fse.emptyDirSync(buildPath);
fse.emptyDirSync(paths.build.root);
console.log(`...Cleared '${paths.build.root}'`);

fse.emptyDirSync(paths.tmp.root);
console.log(`...Cleared '${paths.tmp.root}'`);

//  Process all sass documents
ProcessSass(paths.src.sass, paths.build.css);

//  Process all images
ProcessImages(paths.src.img, paths.build.img);

//  Process all javascript
ProcessJavaScript(paths.src.js, paths.build.js);

//  Process all vendor files
ProcessVendor(paths.src.vendor, paths.build.vendor);


//  Get a list of all the pages
let pageList = glob.sync('**/*.@(md|ejs|html)', { cwd: paths.src.pages });

//  Iterage the page list
pageList.forEach((page, i) => {
    //  Get the file info on the page
    let fileInfo = path.parse(page);

    //  Generate the full path to the page file
    let fullFilePath = path.join(paths.src.pages, page);

    //  Create the path for the build directory
    let buildDir = path.join(paths.tmp.root, fileInfo.dir);

    //  Create the build directory
    fse.ensureDir(buildDir);

    //  Read the contents of the file for the page
    let pageContent = fse.readFileSync(fullFilePath, 'utf-8');

    //  Get the front matter from the page content
    let fMatter = frontMatter(pageContent);

    //  Create the page data from the front matter
    let pageData = Object.assign({}, {
        site: fMatter.attributes.site,
        og: fMatter.attributes.og,
        page: fMatter.attributes.page,
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
    let layoutFilePath = path.join(paths.src.layouts, `${layoutName}.ejs`);

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
        let screenshots = glob.sync('**/*', { cwd: path.join(paths.src.pages, fileInfo.dir, "img", "screenshots") });
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






// //  Imprort the games list
// let games = ProcessGameListData('./source/data/games_list.json');

// //  Process the pages
// ProcessPages(paths.src.pages, paths.src.layouts, paths.build.root, { "games": games });

// GenerateGamePages(games, paths.src.layouts, paths.src.img, paths.build.img, paths.build.root);

// let blogData = ProcessPosts(paths.src.posts, paths.src.layouts, paths.build.posts);

// GenerateDevBlog(paths.src.devblog, paths.build.posts, blogData, paths.src.layouts);







//  ===================================================================================
/**
 * Processes the Sass files in the srcPath and outputs the CSS file in the buildPath
 * @param {string} srcPath The root source path for the Sass files
 * @param {string} buildPath The root path to output the CSS files in
 */
//  ===================================================================================
function ProcessSass(srcPath, buildPath) {
    console.log("----------------------------------------")
    console.log(' Processing Sass files')
    console.log(` srcPath: '${srcPath}'`);
    console.log(` buildPath: '${buildPath}'`);
    console.log("----------------------------------------")

    //  Get any .scss files that do not have a _ in the  beginning
    let fileList = glob.sync('**/!(_)*.scss', { cwd: `${srcPath}` });
    console.log(`...Located ${fileList.length} Sass file(s) to process`);

    //  Render each sass file
    fileList.forEach((file, i) => {
        //  Get the file data
        let fileData = path.parse(file);

        //  Create the destiniation directory
        fse.mkdirSync(buildPath);

        let filePath = path.join(`${srcPath}`, `${fileData.dir}`, `${fileData.name}${fileData.ext}`);
        console.log(`...Generated output path '${filePath}'`);

        //  render the sass
        console.log('...Rendering Sass to CSS');
        let result = sass.renderSync({ file: filePath });

        //  Ouput the result as a .css file
        process.stdout.write('...Writting CSS to file...');
        fse.writeFileSync(`${buildPath}/${fileData.name}.css`, result.css);
        console.log('...SUCCESS');
    });
}

//  ===================================================================================
/**
 * Processes the image files in the srcPath and outputs them in the buildPath
 * @param {string} srcPath The root source path for the image files
 * @param {string} buildPath The root path to output the image files in
 */
//  ===================================================================================
function ProcessImages(srcPath, buildPath) {
    console.log("----------------------------------------")
    console.log(' Processing Image Files')
    console.log("----------------------------------------")

    //  Copy over the image files
    process.stdout.write(`...Copying from '${srcPath}' to '${buildPath}'`);
    fse.copy(`${srcPath}`, `${buildPath}`);
    console.log('...SUCCESSS');
}


//  ===================================================================================
/**
 * Processes the javascript files in the srcPath and outputs them in the buildPath
 * @param {string} srcPath The root source path for the javascript files
 * @param {string} buildPath The root path to output the javascript files in
 */
//  ===================================================================================
function ProcessJavaScript(srcPath, buildPath) {
    console.log("----------------------------------------")
    console.log(' Processing JavaScript Files')
    console.log("----------------------------------------")

    //  Copy over the javascript files
    process.stdout.write(`...Copying from '${srcPath}' to '${buildPath}'`);
    fse.copy(`${srcPath}`, `${buildPath}`);
    console.log('...SUCCESSS');
}


//  ===================================================================================
/**
 * Processes the vendor files in the srcPath and outputs them in the buildPath
 * @param {Array} srcPath The full source paths for the vendor files
 * @param {Array} buildPath The full path to output the vendor files in
 */
//  ===================================================================================
function ProcessVendor(srcPath, buildPath) {
    console.log("----------------------------------------")
    console.log(' Processing Vendor Files')
    console.log("----------------------------------------")

    //  Copy over the vendor files
    for (var vendor in srcPath) {
        process.stdout.write(`...Copying '${srcPath}' to '${buildPath}'`);
        fse.copy(`${srcPath[vendor]}`, `${buildPath[vendor]}`);
        console.log('...SUCCESSS');
    }
}

//  ===================================================================================
/**
 * Imports the games list data fromt the given path and returns the the object back
 * @param {string} path The relative path to the games list data
 */
//  ===================================================================================
function ProcessGameListData(path) {
    console.log("----------------------------------------")
    console.log(' Processing Game List Data')
    console.log("----------------------------------------")

    //  Get the games list json
    process.stdout.write('...Importing games list json');
    let json = fse.readFileSync(path);
    console.log('...SUCCESS');

    return JSON.parse(json);
    // //  Parse the games list json into an object
    // const gamesList = JSON.parse(gamesListJson);
}


//  ===================================================================================
/**
 * Processes the EJS pages in the srcPath and outputs the HTML version in the buildPath
 * @param {string} pagesSrcPath The root source path for the EJS pages
 * @param {string} buildPath The root path to output the HTML files in
 * @param {object} data The data to pass to the EJS templete before rendering
 */
//  ===================================================================================
function ProcessPages(pagesSrcPath, layoutSrcPath, buildPath, data) {
    console.log("----------------------------------------")
    console.log(' Processing Pages ')
    console.log("----------------------------------------")

    //  Read pages
    process.stdout.write('...Locating Pages');
    let pages = glob.sync('**/*.@(md|ejs|html)', { cwd: `${pagesSrcPath}` });
    console.log(`...${pages.length} page(s) found'`);


    pages.forEach((page, i) => {
        console.log(`...Processing '${page}'`);
        let fileInfo = path.parse(page);
        let buildDir = path.join(buildPath, fileInfo.dir);

        //  Create destination directory
        fse.mkdirsSync(buildDir);

        //  Read page file
        process.stdout.write('......Reading page templete');
        let pageTemplete = fse.readFileSync(`${pagesSrcPath}/${page}`, 'utf-8');
        console.log('...SUCCESS');

        //  Render page
        console.log('......Parsing Frontmatter');
        let fMatter = frontMatter(pageTemplete);

        console.log('......Creating data object for page');
        let pageData = Object.assign({}, config, {
            page: fMatter.attributes,
            games: data.games
        });


        //  Generate page content according to file type
        process.stdout.write('......Rendering page content from');
        let renderedPage;
        switch (fileInfo.ext) {
            case '.md':
                console.log('...Markdown');
                var r = new marked.Renderer();
                r.heading = function (text, level) {
                    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
                    return `
            <h${level} id=${escapedText}>${text}</h${level}>`;

                }
                renderedPage = marked(fMatter.body, { renderer: r });
                break;
            case '.ejs':
                console.log('...EJS');
                renderedPage = ejs.render(fMatter.body, pageData, {
                    filename: `${pagesSrcPath}/${page}`
                });
                break;
            default:
                console.log('...HTML');
                renderedPage = fMatter.body;
        }

        //  Determine which layout to use
        let layout = fMatter.attributes.layout || 'flexed';

        //  Generate the file name of the layout
        console.log(`......Master layout to use is '${layout}'`);
        let layoutFileName = `${layoutSrcPath}/${layout}.ejs`;

        //  Read the data from the layout file
        console.log(`......Reading layout data from '${layoutFileName}'`);
        let layoutTemplete = fse.readFileSync(layoutFileName, 'utf-8');

        //  Render the layout using the rendered page from above as the body
        process.stdout.write('......Rendering layout');
        let completePage = ejs.render(
            layoutTemplete,
            Object.assign({}, pageData, {
                body: renderedPage,
                filename: layoutFileName,
                game: { name: "ManBeardGames" }
            })
        );
        console.log('...SUCCESS');

        //  Save the html file
        process.stdout.write(`......Saving final render to '${buildPath}/${fileInfo.name}.html'`);
        fse.writeFileSync(`${buildDir}/${fileInfo.name}.html`, completePage);
        console.log('...SUCCESS');

    });
}


//  ===================================================================================
/**
 * Generates the individual game pages
 * @param {Array} games Array of game data
 * @param {string} layoutPath The root source path for the layout templetes
 * @param {string} imgSrcPath The root source path for images
 * @param {string} buildPath The root path to output the HTML files in

 */
//  ===================================================================================
function GenerateGamePages(games, layoutPath, imgSrcPath, imgBuildPath, buildPath) {

    //  For each game we have int he gamesList, build a page for the game using hte
    //  game feature layout templete
    games.forEach(function (game) {

        //  creat the hyphinated game name
        let gameNameHyphinated = game.name.split(' ').join('-').toLowerCase();

        //  Make the directory with the hypinated game name
        let buildDir = path.join(buildPath, gameNameHyphinated);
        fse.mkdir(buildDir);

        //  Get the list of all screenshot files avaialble for this game
        let imgFiles = glob.sync('**/*', { cwd: `${imgSrcPath}/games/${gameNameHyphinated}/screenshots` });

        //  Build the data objec that contains all the screenshots for the game
        let screenshots = [];
        let ogImage = '';
        imgFiles.forEach((img, i) => {
            let imgPath = path.join('img', 'games', gameNameHyphinated, 'screenshots', img);

            //  Change backslashes to forward slashes
            imgPath = imgPath.replace(/\\/g, "/");
            ogImage = imgPath;

            //  add leading forward slashs
            imgPath = `/${imgPath}`;

            //  push to screenshots array
            screenshots.push(imgPath);
        });


        let layoutConfig = Object.assign({}, {
            game: game,
            screenshots: screenshots
        });

        let layoutContet;
        let fileName = `${layoutPath}/gamefeature.ejs`;
        let templete = fse.readFileSync(fileName, 'utf-8');
        let gamePage = ejs.render(
            templete,
            Object.assign({}, layoutConfig, {
                filename: fileName,
                page: {
                    title: game.name,
                    description: game.shortDescription,
                    ogtitle: game.name,
                    ogimage: `https://manbeardgames.com/${ogImage}`,
                    ogdescription: game.shortDescription
                }
            }));

        //  Save the html file
        fse.writeFileSync(`${buildDir}/index.html`, gamePage);
    });
}

function ProcessPosts(postSrcPath, layoutSrcPath, postBuildPath) {

    fse.emptyDirSync(postBuildPath);
    //  Get the list of all posts
    let postFiles = glob.sync('**/*.md', { cwd: postSrcPath });

    //  Go through each post file
    let blogData = [];
    postFiles.forEach((post, i) => {

        //  Get the fileInfo
        let fileInfo = path.parse(post);

        //  Create the build directory
        let buildDir = path.join(postBuildPath, fileInfo.name);

        //  Make the directory
        fse.mkdirSync(buildDir);

        //  Read the page
        let pageTemplete = fse.readFileSync(`${postSrcPath}/${post}`, 'utf-8');

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
        let layoutFileName = `${layoutSrcPath}/${layout}.ejs`;

        //  Read the data from the layout file
        let layoutTemplete = fse.readFileSync(layoutFileName, 'utf-8');

        //  Render the layout
        let completePage = ejs.render(
            layoutTemplete,
            Object.assign({}, pageData, {
                body: renderedPost,
                filename: layoutFileName,
                game: { name: "ManBeardGames" }
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

function GenerateDevBlog(templatePath, buildPath, postData, layoutSrcPath) {

    //  Get the dev blog partial
    let fileInfo = path.parse(templatePath);

    //  Create the destiniation directory


    //  Read the page file
    let pageTemplete = fse.readFileSync(templatePath, 'utf-8');

    //  Get the front matter
    let fMatter = frontMatter(pageTemplete);

    //  Create the data object for the page
    let pageData = Object.assign({}, config, {
        page: fMatter.attributes,
        posts: postData
    });

    //  Generate the page content
    let renderedPage = ejs.render(fMatter.body, pageData, {
        filename: templatePath
    });

    //  Determine which layout to use
    let layout = fMatter.attributes.layout || 'flexed';

    //  Generate the file name of the layout
    let layoutFileName = `${layoutSrcPath}/${layout}.ejs`;

    //  Read teh data from the layout file
    let layoutTemplate = fse.readFileSync(layoutFileName, 'utf-8');

    //  Render the layout usin the rendered page from above as the body
    let completePage = ejs.render(layoutTemplate, Object.assign({}, pageData, {
        body: renderedPage,
        filename: layoutFileName,
        game: { name: "Dev Blog" }
    }));

    //  Generate the output path
    let completePath = `${buildPath}/index.html`;

    //  Save the html file
    fse.writeFileSync(completePath, completePage);
}

