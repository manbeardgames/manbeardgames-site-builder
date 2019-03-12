const app = require('./application-controller');
const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');
const fMatter = require('front-matter');

// var exports = module.exports = {};

exports.routes = {
    index: {
        route: '/',
        buildView: function () {
            //  Get the view data
            let view_data = app.readView('home', 'index');

            //  this view requires extra data about the games
            let games = app.getData('games_list');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                games: games
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/index.html', view);
        },

    }
}