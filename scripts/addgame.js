//  fs-extra for working with files
const fse = require('fs-extra');
//  readlin-sync for asking questions in console and getting response back
const read = require('readline-sync');
//  path module for working creating paths
const path = require('path');
//  paths contain the pathing information for reading and writing to disk
const paths = require('../paths');
//  site.config contains the config information about the site
const config = require('../site.config');

//  Instantiate our game object. This will hold all the 
//  data that we parse out through the questions below
let game = {};


//  Get the name of the game
game.name = AskName();
game.nameSpine = game.name.toLowerCase().split(' ').join('-');

//  Get the short description of the game
game.shortDescription = AskShort();

//  Get the long description of the game
game.description = AskFull();

//  Get the link to the trailer for the game
game.trailer = AskTrailer();

//  Get the game platform information
game.platforms = AskPlatforms();

//  Get which operating systems the game is on
game.os = AskOS();

//  Add the game to the master games_list
let games;
if(fse.existsSync(path.join(paths.source.data, 'games_list.json'))) {
    //  Reading json
    console.log("Parsing existing file");
    var gamesJson = fse.readFileSync(path.join(paths.source.data, 'games_list.json'));
    games = JSON.parse(gamesJson);

    //  Addin game
    console.log('adding game');
    games.push(game);
} else {
    //  Not found
    games = [];
    //  Adding game
    console.log("Adding to new collection");
    games.push(game);
}


//  Create JSON from game
let json = JSON.stringify(games, null, 4);

fse.writeFileSync(path.join(paths.source.data, 'games_list.json'), json);


// //  Ensure that the path to the data folder exists for output
// fse.ensureDirSync(path.join(paths.source.data, 'games'));

// //  Write the json to the data folder
// fse.writeFileSync(path.join(paths.source.data, 'games', game.nameSpine + '.json'), json);

//  create new folder structure for the game page
fse.ensureDirSync(path.join(paths.source.pages, game.nameSpine));

//  create the index.ejs file with front matter for the game page
let fMatter = '---' + '\n';
fMatter += 'site: ' + JSON.stringify(config.site, null, 4) + '\n';
fMatter += 'opengraph: ' + JSON.stringify(config.opengraph, null, 4) + '\n';
fMatter += 'page: ' + JSON.stringify({layout: 'game', navheader: game.name}, null, 4) + '\n';
fMatter += 'game: ' + JSON.stringify(game, null, 4) + '\n';
fMatter += '---';

//  Write the json file to the page
fse.writeFileSync(path.join(paths.source.pages, game.nameSpine, 'index.ejs'), fMatter);

//  Add the image folder
fse.ensureDirSync(path.join(paths.source.pages, game.nameSpine, 'img'));






// -------------------------------------------------------
/**
 * Asks the user to input the name of the game.
 * @returns {string} The value entered by the user
 */
// -------------------------------------------------------
function AskName() {
    //  Ask the question
    let result = read.question('game name: (My Game) ');

    //  Parse the result
    if (!result || result === '') {
        result = 'My Game';
    }

    //  Return the result
    return result;
}

// -------------------------------------------------------
/**
 * Asks the user to input the short description for the game
 * @returns {string} The value entered by the user
 */
// -------------------------------------------------------
function AskShort() {
    //  Ask the question
    let result = read.question('short description: ');

    //  Parse the result
    if (!result) {
        result = '';
    }

    //  Return the result
    return result;
}

// -------------------------------------------------------
/**
 * Asks the user to input the full description of the game. Each entry
 * by the user consitutes one paragraph.  
 * @returns {string[]} The collection of values entered by the user
 */
// -------------------------------------------------------
function AskFull() {
    //  Setup the array to hold the user answers
    let result = [];

    //  Setup loop
    let resolved = false;
    while (!resolved) {
        //  Ask the question
        let answer = read.question('Full Description: (blank when finished) ');

        //  If there is no answer, or the answer is blank, we've finished
        if (!answer || answer === '') {
            resolved = true;
        } else {
            result.push(answer);
        }
    }

    //  Return the result
    return result;
}

// -------------------------------------------------------
/**
 * Asks the use for the link to the trailer of the game
 * @returns {string} The value entered by the user
 */
// -------------------------------------------------------
function AskTrailer() {
    //  Ask question
    let result = read.question('trailer: (youtube only) ');

    //  Parse the result
    if (!result) {
        result = '';
    }

    //  Return the result
    return result;
}

// -------------------------------------------------------
/** Asks the user for the platforms and the links to their pages.
 * @returns {array} An collection of objects, one for each platform
 */
// -------------------------------------------------------
function AskPlatforms() {
    //  Setup the array to hold the user answer
    let result = [];

    //  Setup loop
    let resolved = false;

    while (!resolved) {
        //  Ask which platform
        let platform = read.question('platform: (name, url) ');

        if (!platform || platform === '') {
            resolved = true;
        } else {
            let [name, url] = platform.split(','),
                answer = { name: name, url: url };

            result.push(answer);
        }
    }

    //  Return the result
    return result;
}

// -------------------------------------------------------
/**
 * Asks the user which operating systems the game is avaialble on
 * @returns {object} The object containing the true/false values for each operating system.
 */
// -------------------------------------------------------
function AskOS() {

    //  Ask the questions
    let win = read.question('window: (y/n) ');
    let osx = read.question('macos: (y/n) ');
    let linux = read.question('linux: (y/n) ');
    let nswitch = read.question('nintendo switch: (y/n) ');
    let xone = read.question('xbox one: (y/n) ');
    let ps4 = read.question('playstation 4: (y/n) ');
    let anroid = read.question('android: (y/n) ');
    let ios = read.question('iphone: (y/n) ');

    //  Parse the results into an object
    let os = {
        win: win === 'y' ? true : false,
        osx: osx === 'y' ? true : false,
        linux: linux === 'y' ? true : false,
        nswitch: nswitch === 'y' ? true : false,
        xone: xone === 'y' ? true : false,
        ps4: ps4 === 'y' ? true : false,
        anroid: anroid === 'y' ? true : false,
        ios: ios === 'y' ? true : false
    }

    //  Return the result
    return os;

}