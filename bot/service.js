const Senders = require("../data/senders");
var request = require('request');

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
        let intent = getIntent(sender.messages, sender.replies);
        processIntent(intent, sender);

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

    function processIntent(intent, sender) {

        switch (intent) {
            case "tell_score_live_match":
                console.log("[BOT]: User wants to report a live match score!");
                var options = {
                    url: 'https://domingoasdez.com/api/games/live',
                    method: 'GET',
                    json: true,
                }
        
                request(options, function (error, response, body) {
                    if (body.data.length < 1) {
                        console.log("[BOT]: No live games, doing nothing!");
                        return;
                    } else {
                        tellScoreLiveMatch(sender);
                    }
                });
                break;
    
            case "tell_score_finished_match":
                console.log("[BOT]: User wants to report a finished match score!");
                break;
    
            case "confirm_score":
                console.log("[BOT]: User wants to report a finished match score!");
                break;
    
            case "tell_match_is_over":
                console.log("[BOT]: User wants to report a match is over!");
                break;
    
            default:
                console.log("[BOT]: Don't know what user Wants. Doing nothing!");
                break;
        }
    
    }
    
    //Tenta perceber o que o utilziador quer com a mensagem
    function getIntent(messages, replies) {
    
        /*
        0)- unknown
        1)- tell_score_live_match
        2)- tell_score_finished_match
        3)- confirm_score
        4)- tell_match_is_over
        5)- not_confirm_score
        6)- tell_score_live_match_without_teams
        */
        let intents = [
            'unknown',
            'tell_score_live_match',
            'tell_score_finished_match',
            'confirm_score',
            'tell_match_is_over',
            'not_confirm_score',
            'tell_score_live_match_without_teams',
        ];
    
        let gut = [1, 0, 0, 0, 0];
    
        let latest_msg = messages[0].text;
        console.log(latest_msg);
    
        if (latest_msg.length > 160) {
            messages[0].intent = "unknown";
            return "unknown";
        }
    
        if (latest_msg.length > 80)
            gut[0] += 2;
    
        if (/^[a-z\.\á\ç\ã\õ\é\ó\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\ó\s]+/.test(latest_msg))
            gut[1] += 3;
    
        if (/^([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)/.test(latest_msg))
            gut[6] += 3;
    
        if (/^[a-z\.\á\ç\ã\õ\é\ó\s]+\s[0-9][0-9]?\s?(\,|\-|\;|\—)\s?[a-z\.\á\ç\ã\õ\é\ó\s]+\s[0-9][0-9]?/.test(latest_msg))
            gut[1] += 3;
    
        if (/(final da partida)|(fim da partida)|(fim do jogo)|(terminou)$|(acabou)$|(terminado)$|(acabou o jogo)$/.test(latest_msg))
            gut[4] += 3;
    
        if (/(resultado final)/)
            gut[2]++;
    
        if (/([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)\s(resultado final)|(resultado final)\s([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)/.test(latest_msg))
            gut[2]++;
    
        if (/^[a-z\.\á\ç\ã\õ\é\ó\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\ó\s]+\s(resultado final)|^(resultado final)\s[a-z\.\á\ç\ã\õ\é\ó\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\ó\s]+/.test(latest_msg))
            gut[2]++;
    
        let biggest_score = -1;
        let intent_chosen = 0;
    
        for (let i = 0; i < gut.length; i++) {
            if (gut[i] > biggest_score) {
                biggest_score = gut[i];
                intent_chosen = i;
            }
        }
    
        return intents[intent_chosen];
    
    }

    function tellScoreLiveMatch(sender) {

        let data = {};
        let success = false;

        let last_msg = sender.messages[0].text;

        let result = last_msg.match(/^([a-z\.\á\ç\ã\õ\é\ó\s]+\s?[0-9][0-9]?)\s?[\-\—\.\a]\s?([0-9][0-9]?\s?[a-z\.\á\ç\ã\õ\é\ó\s]+)/);

        //Resultado: EquipaA 1-0 EquipaB
        if (result && result.length === 3) {

            let home_score = result[1].match(/[0-9]+$/g);
            let away_score = result[2].match(/^[0-9]+/g);

            let home_club = result[1].match(/^[a-z\.\á\ç\ã\õ\é\ó\s]+/g);
            let away_club = result[2].match(/[a-z\.\á\ç\ã\õ\é\ó\s]+$/g);

            data = {
                "token": process.env.LARAVEL_WEBHOOK_TOKEN,
                "home_club_name": home_club[0].trim(),
                "home_club_score": home_score[0].trim(),
                "away_club_name": away_club[0].trim(),
                "away_club_score": away_score[0].trim(),
                "match_finished": false,
            }

            success = true;

        }

        result = last_msg.match(/^([a-z\.\á\ç\ã\õ\é\ó\s]+\s[0-9][0-9]?)\s?[\,\-\;\—]\s?([a-z\.\á\ç\ã\õ\é\ó\s]+\s[0-9][0-9]?)/);

        if (result && result.length === 3) {
            
            let home_score = result[1].match(/[0-9]+$/g);
            let away_score = result[2].match(/[0-9]+$/g);

            let home_club = result[1].match(/^[a-z\.\á\ç\ã\õ\é\ó\s]+/g);
            let away_club = result[2].match(/^[a-z\.\á\ç\ã\õ\é\ó\s]+/g);

            data = {
                "token": process.env.LARAVEL_WEBHOOK_TOKEN,
                "home_club_name": home_club[0].trim(),
                "home_club_score": home_score[0].trim(),
                "away_club_name": away_club[0].trim(),
                "away_club_score": away_score[0].trim(),
                "match_finished": false,
            }

            success = true;
        }

        if (success) {

            var headers = {
                'Content-Type': 'application/json'
            }

            var options = {
                url: 'https://domingoasdez.com/api/games/live/update_match',
                method: 'POST',
                json: true,
                headers: headers,
                body: data
            }
    
            request(options, function (error, response, body) {

                if (body.success) {

                    setTimeout(function() {
                        SendAction(sender.sender_id, 'mark_seen');
                    }, 2000);

                    setTimeout(function() {
                        SendAction(sender.sender_id, 'typing_on');
                    }, 3000);

                    setTimeout(function() {
                        SendMessage(sender.sender_id, getRandomMessage('updated_score'));
                    }, 8000);

                } else {

                    setTimeout(function() {
                        SendAction(sender.sender_id, 'mark_seen');
                    }, 2000);

                    setTimeout(function() {
                        SendAction(sender.sender_id, 'typing_on');
                    }, 3000);

                    setTimeout(function() {
                    SendMessage(sender.sender_id, getRandomMessage('score_format_error'));
                    }, 8000);

                }
            });

        } else {
            console.log("[BOT]: Unable to extract score or clubs!");
            setTimeout(function() {
                SendAction(sender.sender_id, 'mark_seen');
            }, 2000);

            setTimeout(function() {
                SendAction(sender.sender_id, 'typing_on');
            }, 3000);

            setTimeout(function() {
            SendMessage(sender.sender_id, getRandomMessage('score_format_error'));
            }, 8000);
        }

    }

    function getRandomMessage(topic = undefined) {

        let messages = {
            dont_understand: [
                'Desculpe, mas não percebi.',
                'Não entendi',
                'Não estou a perceber'
            ],
            thanks: [
                'Obrigado!',
                'Agradecemos a informação!',
                'Ok, obrigado'
            ],
            updated_score : [
                'Ok, obrigado. Vamos atualizar',
                'Obrigado, vamos alterar',
                'Vamos atualizar o resultado, obrigado!',
                'Ok, vamos retificar. Obrigado',
                ''
            ],
            score_format_error : [
                'Não percebi bem qual era o jogo em questão. Será que podia escrever de novo o resultado com o nome das duas equipas?',
                'Não tenho a certeza se entendi. Para evitar confusões escreva de novo as duas equipas e o resultado de cada uma na mesma mensagem!',
                'Qual é o jogo? Não encontro, escreva de novo o resultado por favor para não haver dúvidas em relação ao jogo.'
            ]
        };

        switch (topic) {

            case "updated_score":
                return messages.updated_score[Math.floor(Math.random() * messages.updated_score.length)];
                
            case "score_format_error":
                return messages.score_format_error[Math.floor(Math.random() * messages.score_format_error.length)];

            case "thanks":
                return messages.thanks[Math.floor(Math.random() * messages.thanks.length)];

            default:
                return messages.dont_understand[Math.floor(Math.random() * messages.dont_understand.length)];
                
        }

    }

    return service;

}



module.exports = BotService;