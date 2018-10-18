const bodyParser = require('body-parser');
const express = require('express');
const Bot = require('../bot');

function MessegesRouter() {

    let router = express();

    router.use(bodyParser.json({ limit: '100mb' }));
    router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

    router.route('/received')

        .get(function (req, res, next) {
            console.log('GET /messages/received');

            // Your verify token. Should be a random string.
            let VERIFY_TOKEN = process.env.APP_ACCESS;

            // Parse the query params
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];

            // Checks if a token and mode is in the query string of the request
            if (mode && token) {

                // Checks the mode and token sent is correct
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {

                    // Responds with the challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
                    res.status(200).send(challenge);

                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.sendStatus(403);
                }
            }

        })

        .post(function (req, res, next) {
            console.log('POST /messages/received');

            for (var i = 0; i < req.body.entry.length; i++) {

                for (var j = 0; j < req.body.entry[i].messaging.length; j++) {

                    let message = {
                        sender_id : req.body.entry[i].messaging[j].sender.id,
                        timestamp : req.body.entry[i].messaging[j].timestamp,
                        text : req.body.entry[i].messaging[j].message.text.toLowerCase(),
                    };

                    Bot.ProcessMessage(message);

                }

            }

            res.status(200);
            res.send("Ok");
            next();
        });

        router.route('/dialogflow')

            .get(function(req, res, next){

                console.log("POST /messages/dialogflow");
                res.status(200).send("ok");

            })
            .post(function(req, res, next){

                console.log("GET /messages/dialogflow");
                console.log(req.body);
                res.status(200).send();

            });

    return router;
}

module.exports = MessegesRouter;