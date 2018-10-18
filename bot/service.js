const Senders = require("../data/senders");
var request = require('request');
const Brain = require('../brain');

function BotService() {

    let service = {
        ProcessMessage,
        SendAction,
        SendMessage
    };

    //https://domingoasdez.com/api/games/live
    function ProcessMessage(message) {

        console.log("Message Received! Processing...");
        Senders.saveMessage(message);
        let sender = Senders.getSender(message.sender_id);
        let intent = Brain.getIntent(sender.messages, sender.replies);
        Brain.processIntent(intent, sender);

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

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            method: 'POST',
            json: true,
            headers: headers,
            body: {
                "messaging_type": message_type,
                "recipient": {
                    "id": sender_id
                },
                "message": {
                    "text": text
                }
            }
        }

        request(options, function (error, response, body) {
            //yolo
        });

    }

    /**
    * @param {string} sender_id
    * @param {string} action <mark_seen|typing_on|typing_off>
    */
    function SendAction(sender_id, action) {

        var headers = {
            'Content-Type': 'application/json'
        }

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            method: 'POST',
            json: true,
            headers: headers,
            body: {
                "recipient":{
                    "id": sender_id
                  },
                  "sender_action": action
            }
        }

        request(options, function (error, response, body) {
            //yolo
        });
    }

    return service;

}


module.exports = BotService;