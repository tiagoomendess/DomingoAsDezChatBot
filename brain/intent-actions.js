var request = require('request');
var Bot = require('../bot');

function tellScoreLiveMatch(sender) {

    var options = {
        url: 'https://domingoasdez.com/api/games/live',
        method: 'GET',
    }

    request(options, function (error, response, body) {
        
        if (response.statusCode === 200) {

            console.log("---");
            console.log(body);

        }

    });
}

module.exports = { tellScoreLiveMatch }