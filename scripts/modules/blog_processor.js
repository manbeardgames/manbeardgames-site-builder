const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('./logger');
const mark_renderer = require('./mark_renderer');

//  ===================================================================================
/**
 * Processes the dev-blog index.html page and all posts that are
 * located in ./source/dev-blog
 */
//  ===================================================================================
function process() {
    log.log('Processing Blog');

    //  Ensure the dev-blog build directory exists
    fse.ensureDir('./public/dev-blog');

    //  process all of the dev-blog posts
    let blog_data = process_posts();

    //  Get the dev blog partial file info
    let partial_file_info = path.parse('./source/partials/_dev-blog.ejs');

    //  Read the contents fo the dev-blog partial
    let partial_file_contents = fse.readFileSync('./source/partials/_dev-blog.ejs', 'utf-8');

    //  Parse the front matter
    let front_matter = frontMatter(partial_file_contents);

    //  Create a new data object for the page
    let page_data = Object.assign({}, {
        page: front_matter.attributes,
        posts: blog_data
    });

    //  Render the page 
    let page_render = ejs.render(front_matter.body, page_data, {
        filename: './source/partials/_dev-blog.ejs'
    });

    //  Determine which layout to use
    let layout = front_matter.attributes.layout || 'default';

    //  Genearte teh path to the layout template
    let layout_file_path = './source/layouts/' + layout + '.ejs';

    //  Read the contents of the layout file
    let layout_content = fse.readFileSync(layout_file_path, 'utf-8');

    //  Render the layout using the rendered page from above as the body
    let final_render = ejs.render(
        layout_content,
        Object.assign({}, page_data, {
            body: page_render,
            filename: layout_file_path
        })
    );

    //  Save the final render to disk as HTML file
    fse.writeFileSync('./public/dev-blog/index.html', final_render);

}


//  ===================================================================================
/**
 * Processes all dev-blog posts located in ./source/dev-blog, renders them
 * as HTML and outputs them to ./public/dev-blog/{post_name}/index.html
 */
//  ===================================================================================
function process_posts() {
    //  Get the list of all post files
    let post_files = glob.sync('**/*.md', {cwd: './source/posts'});

    //  Create blog_data array that we'll return in the end
    let blog_data = [];

    //  Process each post file found
    post_files.forEach((post, i) => {
        //  Get the file info
        let file_info = path.parse(post);
        log.log(`Processing ${file_info.name} (${i + 1} of ${post_files.length})`, {indent: 1});

        //  Genearte path to the build directory
        let build_dir = './public/dev-blog/' + file_info.name;

        //  Ensure the build directory exists
        fse.ensureDirSync(build_dir);

        //  Read the contents of the post file
        let post_file_contents = fse.readFileSync(path.join('./source/posts', post), 'utf-8');

        //  Extract the front matter
        let front_matter = frontMatter(post_file_contents);

        //  Create the page data object
        let page_data = Object.assign({}, {
            page: front_matter.attributes
        });

        //  Render using mark renderer
        let post_render = mark_renderer.render(front_matter.body);

        //  Determine which layout to use
        let layout = front_matter.attributes.layout || 'blog-post';

        //  Generate the file name of the layout
        let layout_file_path = './source/layouts/' + layout + '.ejs';

        //  Read the contents of the layout file
        let layout_content = fse.readFileSync(layout_file_path, 'utf-8');

        //  Render using the layout
        let final_render = ejs.render(
            layout_content,
            Object.assign({}, page_data, {
                body: post_render,
                filename: layout_file_path
            })
        );

        //  Write the final render to disk as HTMl file
        fse.writeFileSync(build_dir + '/index.html', final_render);

        //  Add the neccessary info to the blog data
        blog_data.push({
            title: front_matter.attributes.title,
            short: front_matter.attributes.short,
            date: front_matter.attributes.date,
            cover: `/img/posts/${file_info.name}/post-cover.png`,
            url: `/dev-blog/${file_info.name}`
        });
    });

    //  Return the blog data
    return blog_data;

}

module.exports.process = process;