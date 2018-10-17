function BotService() {

    let service = {
        ProcessMessage,
    };

    //Métodos do BOT
    function ProcessMessage(message) {
        
        console.log("Message Received! Processing...");
        console.log(message);
        
    }

    return service;

}

module.exports = BotService;