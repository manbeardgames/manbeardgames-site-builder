const fse = require('fs-extra');
const read = require('readline-sync');





let game = {};



game.name = AskName();
game.shortDescription = AskShort();
game.descriptio = AskFull();
game.trailer = AskTrailer();
game.platforms = AskPlatforms();
game.os = AskOS();

//  Create JSOn from game
let json = JSON.stringify(game, null, 4);

//  Write json to disk
fse.writeFileSync('./.tmp/promptTest.json', json);




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

function AskFull() {
    //  Setup the array to hold the user answers
    let result = [];
    let count = 1;

    //  Setup loop
    let resolved = false;

    while (!resolved) {
        //  Ask the question
        let answer = read.question('Full Description: (blank when finished) ');

        if (!answer || answer === '') {
            resolved = true;
        } else {
            count++;
            result.push(answer);
        }
    }

    //  Return the result
    return result;
}

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

function AskPlatforms() {
    //  Setup the array to hold the user answer
    let result = [];

    //  Setup loop
    let count = 1;
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

function SanatizeInput(str) {
    sanatized = str;
    return sanatized;
}