const Senders = require("../data/senders");

function BotService() {

    let service = {
        ProcessMessage,
    };

    //Métodos do BOT
    //https://domingoasdez.com/api/games/live
    function ProcessMessage(message) {
        
        console.log("Message Received! Processing...\n");
        Senders.saveMessage(message);
        let received = Senders.getMessages(message.sender_id);
        console.log(received);
        console.log("-----");
        let sent = Senders.getReplies(message.sender_id);
        console.log(sent);

    }

    return service;

}

module.exports = BotService;