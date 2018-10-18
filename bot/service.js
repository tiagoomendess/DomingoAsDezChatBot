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
        console.log(message.sender_id);

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

        var headers = {
            'Content-Type': 'application/json'
        }

        console.log('https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN);

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: headers,
            data: {
                messaging_type : message_type,
                recipient:{
                    id: sender_id
                },
                message:{
                    text: text
                }
            }
        }

        request(options, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        });

    }

    /**
    * @param {string} sender_id
    * @param {string} action <mark_seen|typing_on|typing_off>
    */
    function SendAction(sender_id, action) {

    }

    function getIntent(messages_received, messages_sent) {
        return "tell_score";
    }

    return service;

}

module.exports = BotService;