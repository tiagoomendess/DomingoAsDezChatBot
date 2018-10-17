const bodyParser = require('body-parser');
const express = require('express');

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

                console.log("-----------\n");

                for (var j = 0; j < req.body.entry[i].messaging.length; j++) {

                    let sender_id = req.body.entry[i].messaging[j].sender.id;
                    let timestamp = req.body.entry[i].messaging[j].timestamp;
                    let message = req.body.entry[i].messaging[j].message.text;
                    console.log("[" + sender_id + "] @(" + timestamp + ") -> " + message);

                }

                console.log("-----------\n");

            }

            res.status(200);
            res.send("Ok");
            next();
        });

    return router;
}

module.exports = MessegesRouter;