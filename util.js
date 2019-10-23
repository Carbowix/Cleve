const request = require('request-promise-native');
const {
    chat
} = require('./misc/config.json');

const handleStatus = (client, status) => {
    client.user.setStatus(status.state);
    client.user.setActivity(status.name, {
        type: status.type
    });
};

const handleTalk = async (msg) => {
    try {
        msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, '');
        if (msg.content.length < 2) return;
        msg.channel.startTyping(true);
        const options = {
            method: 'GET',
            url: chat.url,
            qs: {
                bid: chat.bid,
                key: chat.key,
                uid: chat.uid,
                msg: msg.content
            },
            json: true
        };
        let reply = await request(options);
        msg.channel.stopTyping(true);
        if (reply) {
            await msg.channel.send(reply.cnt);
        }
    } catch (e) {
        msg.channel.stopTyping(true);
        console.log(e);
    }
};

module.exports = {
    handleStatus,
    handleTalk
};