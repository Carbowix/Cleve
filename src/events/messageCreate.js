const {
    handleTalk
} = require('../util');
module.exports = {
    once: false,
    run: (client, msg) => {
        if (msg.author.bot) return;
        if (msg.channel.isDMBased() && !client.misc.directMessage) return; // Disallow direct messages if configuration says so.
        const mentionCheck = (msg.content.startsWith(`<@${msg.client.user.id}>`) || msg.content.startsWith(`<@!${msg.client.user.id}>`));
        if (mentionCheck || client.misc.noMention) {
            handleTalk(client, msg);
        }
    }
}