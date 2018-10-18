const Senders = require("../data/senders");
var request = require('request');

function BotService() {

    let service = {
        ProcessMessage,
    };

    //https://domingoasdez.com/api/games/live
    function ProcessMessage(message) {

        console.log("Message Received! Processing...\n");
        Senders.saveMessage(message);
        let received = Senders.getMessages(message.sender_id);
        let sent = Senders.getReplies(message.sender_id);

        let intent = getIntent(received, sent);

        switch (intent) {
            case "tell_score":
                console.log("[BOT]: User wants to report a match score!");
                SendMessage(message.sender_id, "Recebido", "RESPONSE");
                break;

            default:
                console.log("[BOT]: Don't know what user Wants!");
                break;
        }

    }

    /**
    * @param {string} sender_id
    * @param {string} text
    * @param {string} message_type <RESPONSE|UPDATE|MESSAGE_TAG>
    */
    function SendMessage(sender_id, text, message_type) {

        let timestamp = new Date().getTime();
        Senders.saveReply({ sender_id, timestamp, text });

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            method: 'POST',
            data: {
                "messaging_type": message_type,
                "recipient":{
                    "id": sender_id
                },
                "message":{
                    "text": text
                }
            }
        }

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            } else {
                console.log(error);
            }
        })

    }

    /**
    * @param {string} sender_id
    * @param {string} action <mark_seen|typing_on|typing_off>
    */
    function SendAction(sender_id, action) {

        let face_message = {
            recipient: {
                id: sender_id
            },
            sender_action: action
        }

        request.post('https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN, face_message, function (response) {
            console.log("Facebook Response ------------");
            console.log(response);
            console.log("End of Facebook Response ------------");
        });

    }

    function getIntent(messages_received, messages_sent) {
        return "tell_score";
    }

    return service;

}

module.exports = BotService;