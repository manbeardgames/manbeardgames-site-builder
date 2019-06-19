const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('./logger');


//  ===================================================================================
/**
 * Processes all site pages in ./source/pages and renders them in HTML to 
 * ./public/{page_name}/index.html
 */
//  ===================================================================================
function process() {
    log.log('Processing pages');
    //  Read the contents fo the games json file
    let games_json = fse.readFileSync('./source/data/games_list.json');

    //  Parse the json into an object
    let games = JSON.parse(games_json);

    //  Get a list of all the pages
    let page_list = glob.sync('**/*.@(md|ejs|html)', {
        cwd: './source/pages'
    });

    page_list.forEach((page, i) => {
        //  Get the file info 
        let file_info = path.parse(page);

        log.log(`Processing ${page}`, {
            indent: 1
        })

        //  Generate the full path to the file
        let page_file_path = path.join('./source/pages', page);

        //  Create the path for the build directory
        let build_dir = path.join('./public', file_info.dir);

        //  Create the build directory
        fse.ensureDirSync(build_dir);

        //  Read the content sof hte file for the page
        let page_file_content = fse.readFileSync(page_file_path, 'utf-8');

        //  Get the front matter from the page content
        let front_matter = frontMatter(page_file_content);

        //  Create the page data from the front matter
        let page_data = Object.assign({}, {
            site: front_matter.attributes.site,
            og: front_matter.attributes.og,
            page: front_matter.attributes.page,
            games: games
        });

        //  Render the page based on teh file extension
        let render;
        switch (file_info.ext) {
            case '.md':
                render = marked(front_matter.body);
                break;
            case '.ejs':
                render = ejs.render(front_matter.body, page_data, {
                    filename: page_file_path
                });
                break;
            default:
                render = front_matter.body;
        }

        //  Get teh name of the layout to use
        let layout_name = front_matter.attributes.page.layout || 'default';

        //  Get the path tot he layout file.
        let layout_file_path = `./source/layouts/${layout_name}.ejs`;

        //  Read the contents of the file for the layout. We'll use this during the render steps below
        let layout_content = fse.readFileSync(layout_file_path, 'utf-8');

        //  Create the data to be used by the layout
        let layout_data = Object.assign({}, page_data, {
            body: render,
            filename: layout_file_path
        });

        //  If the layout is the 'game' layout, then assign the extra game data needed
        if (layout_name === 'game') {
            //  Get a list of all the screenshot files
            let screenshot = glob.sync('**/*', {
                cwd: path.join('./source/pages', file_info.dir, 'img', 'screenshots')
            });

            layout_data = Object.assign({}, layout_data, {
                game: front_matter.attributes.game,
                screenshots: screenshot
            });
        }

        //  Render the layout
        let final_render = ejs.render(layout_content, layout_data);

        //  Write the render to disk as a .html file
        fse.writeFileSync(path.join(build_dir, file_info.name + '.html'), final_render);
    })
}

module.exports.process = process;