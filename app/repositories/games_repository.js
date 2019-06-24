const { data } = require('../db/games');

//  ===================================================================================
/**
 * Gets the game object from the database based on the name give.
 * If no game with the name given is found, null is returned * 
 */
//  ===================================================================================
let getGameByName = function(name) {
    for(let i = 0; i < data.length; i++) {
        if(data[i]["name"] === name) {
            return data[i];
        }
    }
    return null;
}

//  ===================================================================================
/**
 *  Returns the collection of all game objects in the database
 */
//  ===================================================================================
let getAllGames = function() {
    return data;
}


module.exports.getGameByName = getGameByName;
module.exports.getAllGames = getAllGames;
