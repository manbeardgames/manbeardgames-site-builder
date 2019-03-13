const app = require('./application-controller');

// var exports = module.exports = {};

exports.routes = {
    index: {
        route: '/',
        buildView: function () {
            //  Get the view data
            let view_data = Object.create(app.readView('home', 'index'));

            //  This view requires extra data about all of our games
            let games = Object.create(app.getDataFolder('games'));

            //  Set the games property for the view data's page data
            view_data.page_data.games = games;

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/index.html', view);
        }
    }
}