//---------------------------------------------------------
//  Game Controller
//  The game controller is responsible for creating the individual page
//  for each game.
//
//  The game controller is a little unique in that it does not contain
//  a seperate route entry for each game. Since every game page is templeted
//  the same, just with different information on the view, instead one
//  route view is used that generates the views of every game page, passing
//  the game data to the render.
//---------------------------------------------------------

const app = require('./application-controller');

// var exports = module.exports = {};

exports.routes = {
    all: {
        buildView: function () {
            //  Get the data collection of all games
            let games = app.getDataFolder('games');

            //  Get the default view data from the db.  We do this since we don't
            //  have a view to render from to obtain the data. Instead, we'll use
            //  this default view data and update the values per game below
            let default_view_data = app.getDataSingle('view_data');

            //  Iterate each of the games in the game collection
            games.forEach((game, i) => {
                //  Use the default view data as the base for the view data
                let view_data = Object.create(default_view_data);

                //  Set the layout to game
                view_data.layout = 'game';

                //  Set the page nav header to the name of the game
                view_data.page_data.page_nav_header = game.name;

                //  Store the data object about the game in the view's page data
                view_data.page_data.game = game;

                //  Render the view
                let view = app.renderView(view_data);

                //  Save the view to the public folder
                app.saveView(`/${game.spine}/index.html`, view);

            });
        }
    }
}