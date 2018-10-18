var actions = require('./intent-actions');

function processIntent(intent, sender) {

    switch (intent) {
        case "tell_score_live_match":
            console.log("\t[BRAIN]: User wants to report a live match score!");
            actions.tellScoreLiveMatch(sender);
            break;

        case "tell_score_finished_match":
            console.log("\t[BRAIN]: User wants to report a finished match score!");
            break;

        case "confirm_score":
            console.log("\t[BRAIN]: User wants to report a finished match score!");
            break;

        case "tell_match_is_over":
            console.log("\t[BRAIN]: User wants to report a match is over!");
            break;

        default:
            console.log("\t[BRAIN]: Don't know what user Wants. Doing nothing!");
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

    if (/^[a-z\.\á\ç\ã\õ\é\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\s]+/.test(latest_msg))
        gut[1] += 3;

    if (/^([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)/.test(latest_msg))
        gut[6] += 3;

    if (/^[a-z\.\á\ç\ã\õ\é\s]+\s[0-9][0-9]?\s?(\,|\-|\;|\—)\s?[a-z\.\á\ç\ã\õ\é\s]+\s[0-9][0-9]?/.test(latest_msg))
        gut[1] += 3;

    if (/(final da partida)|(fim da partida)|(fim do jogo)|(terminou)$|(acabou)$|(terminado)$|(acabou o jogo)$/.test(latest_msg))
        gut[4] += 3;

    if (/(resultado final)/)
        gut[2]++;

    if (/([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)\s(resultado final)|(resultado final)\s([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)/.test(latest_msg))
        gut[2]++;

    if (/^[a-z\.\á\ç\ã\õ\é\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\s]+\s(resultado final)|^(resultado final)\s[a-z\.\á\ç\ã\õ\é\s]+(\s)?([0-9][0-9]?(\s)?(\-|\—|\.|\a)(\s)?[0-9][0-9]?)(\s)?[a-z\.\á\ç\ã\õ\é\s]+/.test(latest_msg))
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

module.exports = { processIntent, getIntent };
