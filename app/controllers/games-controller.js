const app = require('./application-controller');
const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');
const fMatter = require('front-matter');

// var exports = module.exports = {};

exports.routes = {
    beats: {
        route: '/beats/',
        buildView: function () {
            
            //  Get the view data
            let view_data = app.readView('games', 'beats');
            
            //  Get the data for beats from database
            let db = app.getData('beats');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                game: db,
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/beats/index.html', view);
        }
    },
    droplet: {
        route: '/droplet/',
        buildView: function () {
            
            //  Get the view data
            let view_data = app.readView('games', 'droplet');
            
            //  Get the data for droplet from database
            let db = app.getData('droplet');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                game: db,
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/droplet/index.html', view);
        }
    },
    echo: {
        route: '/echo/',
        buildView: function () {
            
            //  Get the view data
            let view_data = app.readView('games', 'echo');
            
            //  Get the data for echo from database
            let db = app.getData('echo');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                game: db,
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/echo/index.html', view);
        }
    },
    ophidian: {
        route: '/ophidian/',
        buildView: function () {
            
            //  Get the view data
            let view_data = app.readView('games', 'ophidian');
            
            //  Get the data for ophidian from database
            let db = app.getData('ophidian');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                game: db,
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/ophidian/index.html', view);
        }
    },
    slime_battle_royal: {
        route: '/slime-battle-royale/',
        buildView: function () {
            
            //  Get the view data
            let view_data = app.readView('games', 'slime-battle-royale');
            
            //  Get the data for beats from database
            let db = app.getData('slime-battle-royale');

            view_data.page_data = Object.assign({}, view_data.page_data, {
                game: db,
            });

            //  render the view
            let view = app.renderView(view_data);

            //  save the view to public folder
            app.saveView('/slime-battle-royale/index.html', view);
        }
    }
}