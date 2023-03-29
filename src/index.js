require('dotenv').config()
const {
    Client,
    Partials,
    Collection,
    GatewayIntentBits,
} = require('discord.js');
const {
    bot_token,
    activity,
    misc
} = require('./misc/config.json');
const {loadModules} = require('./util');
const clientIntents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping];
if (misc.noMention) clientIntents.push(GatewayIntentBits.MessageContent);
const client = new Client({
    intents: clientIntents,
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
    presence: activity,
    shards: "auto",
    failIfNotExists: false,
    allowedMentions: {
      parse: ["everyone", "roles", "users"],
      users: [],
      roles: [],
      repliedUser: false,
    }
});
client.event = new Collection();
client.slashCommands = new Collection();
client.misc = misc;

(async () => {
    await loadModules(client);
    client.login(process.env.BOT_TOKEN || bot_token).catch(err => {
        console.log('[CLEVE] Unable to connect: \n' + err);
        return process.exit(1)
    });
})();

process.on('unhandledRejection', (reason, promise) => {
    console.log('[FATAL] Possibly Unhandled Rejection at: Promise: ', promise, ' reason: ', reason.message);
});

module.exports = client;