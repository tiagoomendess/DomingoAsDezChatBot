const Senders = require("../data/senders");

function BotService() {

    let service = {
        ProcessMessage,
    };

    //Métodos do BOT
    //https://domingoasdez.com/api/games/live
    function ProcessMessage(message) {
        
        console.log("Message Received! Processing...");
        Senders.saveMessage(message);
        let context = Senders.getMessages(message.sender_id);
        console.log(JSON.parse(context));

    }

    return service;

}

module.exports = BotService;