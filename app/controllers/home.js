const fse = require('fs-extra');
const ejs = require('ejs');
const fmatter = require('front-matter');
const game_repository = require('../repositories/games_repository');
const { default_meta } = require('../db/meta');

function render() {
    //  Get all games from the repository
    let all_games = game_repository.getAllGames();
    
    //  Generate the path to the view file
    let view_file_path = './app/views/home/index.ejs';

    //  Read the contents of the view file
    let view_file_contents = fse.readFileSync(view_file_path, 'utf-8');

    //  Extract the front matter from the file contents
    let front_matter = fmatter(view_file_contents);

    //  Render the view file
    let view_render = ejs.render(
        front_matter.body,
        Object.assign({}, {
            games: all_games,
            filename: view_file_path
        }),
    );

    //  Geneate the path to the layout file
    let layout_file_path = './app/views/layouts/' + front_matter.attributes.layout + '.ejs';


    //  Read the contents of the layout file
    let layout_file_contents = fse.readFileSync(layout_file_path, 'utf-8');

    //  Render the layout file using the view_render as the body
    let layout_render = ejs.render(
        layout_file_contents,
        Object.assign({}, {
            head: front_matter.attributes.head,
            top_nav: front_matter.attributes.top_nav,
            body: view_render,
            filename: layout_file_path
        })
    );

    //  Ensure the directory to output to exists
    fse.ensureDirSync('./public');

    //  Write the layout_render to disk as a .html file
    fse.writeFileSync('./public/index.html', layout_render);
}

module.exports.render = render;