const Bot = require('../bot');
var request = require('request');

function tellScoreLiveMatch(sender) {

    var options = {
        url: 'https://domingoasdez.com/api/games/live',
        method: 'GET',
    }

    request(options, function (error, response, body) {
        
        if (response.statusCode === 200) {

            let matches = JSON.parse(body);

            if (matches.data.length === 0) {
                console.log("\t[BRAIN]: No live games, doing nothing!");

                Bot.SendAction(sender.sender_id, 'mark_seen');

            } else {
                console.log("\t[BRAIN]: There are games now!");
            }

        }

        console.log("fim");

    });
}

module.exports = { tellScoreLiveMatch }