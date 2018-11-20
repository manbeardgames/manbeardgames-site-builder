const fse = require('fs-extra');
const path = require('path');

let game = {
    "name": "",
    "shortDescription": "",
    "description": [],
    "trailer": "",
    "platforms": [],
    "os": {
        "windows": false,
        "osx": false,
        "switch": false,
        "xone": false,
        "ps4": false,
        "android": false,
        "ios": false
    }
};

let questions = [
    'name',
    'short',
    'full',
    'trailer',
    'platforms',
    'os'
]

let idx = 0;

AskName();
AskShort();
AskFull();
AskTrailer();
AskPlatforms();
AskOS();

// while (idx < questions.length) {
//     var question = questions[idx];
//     switch (question) {
//         case 'name':
//             idx = idx + AskName();
//             break;
//         case 'short':
//             idx = idx + AskShort();
//             break;
//         case 'full':
//             idx = idx + AskFull();
//             break;
//         case 'trailer':
//             idx = idx + AskTrailer();
//             break;
//         case 'platforms':
//             idx = idx + AskPlatforms();
//             break;
//         case 'os':
//             idx = idx + AskOS();
//             break;
//     }
// }


//  Convert the game object to JSON
let json = JSON.stringify(game);

//  Create the file name
let fileName = path.join('./source', 'data', 'games', `${game.name}.json`);

//  Write the json to disk
fse.writeFileSync(fileName, json);




function prompt(question, callback) {
    var stdin = process.stdin;
    var stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}












function AskName() {

    let val = 0;
    prompt("What is the name of the game?", function (input) {
        let name = SanatizeInput(input);

        if (name === '' || name === null) {
            name = "Example Name";
        }

        game.name = name;
        val = 1;
    });

    return val;

    // process.stdout.write('What is the name of the game? ' + '\n');
    // let name = process.stdin.read();

    // return 1;

}

function AskShort() {

    let val = 0;
    prompt("Give a short description of the game (1-2 sentences", function (input) {
        let short = SanatizeInput(input);

        if (short === null) {
            short = '';
        }

        game.shortDescription = short;
        val = 1;
    });

    return val;

    // process.stdout.write('Give a short description of the game (1-2 sentences' + '\n');

    // let short = process.stdin.read();

    // return 1;
}

function AskFull() {
    let val = 0;

    console.log("Give a full description of the game");
    console.log("Enter one paragraph at a time.  If finished, leave balnk and hit enter");

    prompt('', function (input) {
        let full = SanatizeInput(full);
        if (full === '') {
            val = 1;
        } else {
            game.description.push(full);
            val = 0;
        }
    });

    return val;

    // process.stdout.write('Give a full description of the game' + '\n');
    // process.stdout.write('Enter one paragraph at a time.  If finished, leave blank and hit enter' + '\n');

    // let full = process.stdin.read();
    // full = SanatizeInput(full);

    // if (full === '') {
    //     return 1;
    // } else {
    //     game.description.push(full);
    //     return 0;
    // }
}

function AskTrailer() {
    let val = 0;

    prompt('Give the link to the trailer on youtube', function (input) {
        let trailer = input;

        if (trailer === null) {
            trailer = '';
        }
        game.trailer = trailer;
        val = 1;
    });

    return val;

}

function AskPlatforms() {

    console.log('Enter a platform thsi has been released on (steam, itch, and ludum are the only ones acceptable');
    console.log('If finished, entering platforms, leave blank and press enter');

    let val = 0;
    prompt('', function (input) {
        let name = SanatizeInput(input);

        if (name === 'steam' || name == 'itch' || name === 'ludum') {
            console.log('Give the link to the game on that platform');
            prompt('', function (inputtwo) {
                let link = inputtwo;
                if (link === null) {
                    link = '';
                }

                platforms.push({ name: name, link: link });
                val = 0;
            });
        } else {
            val = 1;
        }
    });

    return val;

    // process.stdout.write('Enter a platform this has been released on (steam, itch, ludum are the only acceptable ones atm' + '\n');
    // process.stdout.write('If finished entering platforms, leave blank and press enter');

    // let name = process.stdin.read();
    // name = SanatizeInput(name);

    // if (name === 'steam' || name === 'itch' || name === 'ludum') {
    //     process.stdout.write('Give the link to the game on that platform' + '\n');
    //     let link = process.stdin.read();
    //     if (link === null) {
    //         link = '';
    //     }

    //     platforms.push({ name: name, link: link });
    //     return 0;
    // } else {
    //     return 1;
    // }
}

function AskOS() {

    let win = false;
    let osx = false;
    let nswitch = false;
    let xone = false;
    let ps4 = false;
    let android = false;
    let ios = false;

    prompt('Availalbe on Windows? (y/n)', function(input) {
        let answer = input;
        win = answer.toLowerCase() === 'y' ? true : false;
    });

    prompt('Availalbe on Mac OSX? (y/n)', function(input) {
        let answer = input;
        osx = answer.toLowerCase() === 'y' ? true : false;
    });
    
    
    prompt('Availalbe on Nintendo Switch? (y/n)', function(input) {
        let answer = input;
        nswitch = answer.toLowerCase() === 'y' ? true : false;
    });
    
    
    prompt('Availalbe on Xbox One? (y/n)', function(input) {
        let answer = input;
        xone = answer.toLowerCase() === 'y' ? true : false;
    });
    
    
    prompt('Availalbe on Playstation 4? (y/n)', function(input) {
        let answer = input;
        ps4 = answer.toLowerCase() === 'y' ? true : false;
    });
    
    
    prompt('Availalbe on Android? (y/n)', function(input) {
        let answer = input;
        android = answer.toLowerCase() === 'y' ? true : false;
    });
    
    
    prompt('Availalbe on Apple iPhones? (y/n)', function(input) {
        let answer = input;
        ios = answer.toLowerCase() === 'y' ? true : false;
    });

    game.os.win = win;
    game.os.osx = osx;
    game.os.switch = nswitch;
    game.os.xone = xone;
    game.os.ps4 = ps4;
    game.os.android = android;
    game.os.ios = ios;

    return 1;
    
    


    // process.stdout.write('Avaialble on Windows? (y/n): ');
    // let win = process.stdin.read();

    // process.stdout.write('\n' + 'osx? (y/n) ');
    // let osx = process.stdin.read();

    // process.stdout.write('\n' + 'switch? (y/n) ');
    // let nswitch = process.stdin.read();

    // process.stdout.write('\n' + 'xone? (y/n) ');
    // let xone = process.stdin.read();

    // process.stdout.write('\n' + 'ps4? (y/n) ');
    // let ps4 = process.stdin.read();

    // process.stdout.write('\n' + 'android? (y/n) ');
    // let android = process.stdin.read();

    // process.stdout.write('\n' + 'ios? (y/n) ');
    // let ios = process.stdin.read();

    // game.os.win = win.toLowerCase() === 'y' ? true : false;
    // game.os.osx = osx.toLowerCase() === 'y' ? true : false;
    // game.os.switch = nswitch.toLowerCase() === 'y' ? true : false;
    // game.os.xone = xone.toLowerCase() === 'y' ? true : false;
    // game.os.ps4 = ps4.toLowerCase() === 'y' ? true : false;
    // game.os.android = android.toLowerCase() === 'y' ? true : false;
    // game.os.ios = ios.toLowerCase() === 'y' ? true : false;

    // return 1;
}

function SanatizeInput(str) {
    sanatized = str;
    return sanatized;
}