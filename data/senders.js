const MAX_LINES_PER_SENDER = 4;

let senders = [
    {
        sender_id: 0,
        messages: [
            {
                timestamp: 111111112,
                text: "Mensagem"
            },
            {
                timestamp: 11111111,
                text: "Mensagem"
            },

        ],
        replies: [
            {
                timestamp: 111112222,
                text: "resposta"
            }
        ]
    },
]

function saveMessage({sender_id, timestamp, text}) {
    
    let sender = getSender(sender_id);

    if (!sender) {
        if(addSender({sender_id, timestamp, text}))
            sender = getSender(sender_id);
        else
            return false;
    }

    if (sender.messages.length >= MAX_LINES_PER_SENDER) {
        return replaceOldestMessage(sender, {timestamp, text});
    } else {

        sender.messages.push({
            timestamp: timestamp,
            text: text
        });

        sender.messages.sort(function(a,b) {
            return b.timestamp - a.timestamp;
        });

        return true;
    }

}

function saveReply({sender_id, timestamp, text}) {

    let sender = getSender(sender_id);

    if (sender.replies.length >= MAX_LINES_PER_SENDER) {
        return replaceOldestReply(sender, {timestamp, text});
    } else {

        sender.replies.push({
            timestamp: timestamp,
            text: text
        });

        sender.replies.sort(function(a,b) {
            return b.timestamp - a.timestamp;
        });

        return true;
    }

}

function getMessages(sender_id) {

    let sender = getSender(sender_id);

    if (!sender)
        return undefined;
    else
        return sender.messages;

}

function getReplies(sender_id) {

    let sender = getSender(sender_id);

    if (!sender)
        return undefined;
    else
        return sender.replies;

}

function getSender(sender_id) {
    
    for(let i = 0; i < senders.length; i++) {

        if(senders[i].sender_id === sender_id)
            return senders[i];
    }

    return undefined;
}

function addSender({sender_id, timestamp, text}) {

    let sender = getSender(sender_id);

    if(!sender) {
        senders.push({
            sender_id : sender_id,
            messages : [],
            replies : []
        });

        return true;
    }

    return false;
}

function replaceOldestMessage(sender, {timestamp, text}) {

    sender.messages.sort(function(a,b) {
        return b.timestamp - a.timestamp;
    });

    sender.messages[MAX_LINES_PER_SENDER - 1] = {
        timestamp: timestamp,
        text: text
    }

    sender.messages.sort(function(a,b) {
        return b.timestamp - a.timestamp;
    });

    return true;

}

function replaceOldestReply(sender, {timestamp, text}) {

    sender.replies.sort(function(a,b) {
        return b.timestamp - a.timestamp;
    });

    sender.replies[MAX_LINES_PER_SENDER - 1] = {
        timestamp: timestamp,
        text: text
    }

    sender.replies.sort(function(a,b) {
        return b.timestamp - a.timestamp;
    });

    return true;

}

module.exports = { saveMessage, saveReply, getMessages, getReplies, MAX_LINES_PER_SENDER }