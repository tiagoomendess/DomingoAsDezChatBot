var request = require('request');
var Bot = require('../bot');

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
                setTimeout(function() {
                    Bot.SendAction(sender.sender_id, 'mark_seen');
                }, 5000);
            } else {
                console.log("\t[BRAIN]: There are games now!");
            }

        }

        console.log("fim");

    });
}

module.exports = { tellScoreLiveMatch }