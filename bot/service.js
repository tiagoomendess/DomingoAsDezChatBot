function BotService() {

    let service = {
        ProcessMessage,
    };

    //Métodos do BOT
    //https://domingoasdez.com/api/games/live
    function ProcessMessage(message) {
        
        console.log("Message Received! Processing...");
        console.log(message);

    }

    return service;

}

module.exports = BotService;