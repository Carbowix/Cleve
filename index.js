const {
    Client,
    GatewayIntentBits 
} = require('discord.js');
const {
    bot_token,
    status
} = require('./misc/config.json');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.util = require('./util');

client.on('warn', err => console.warn('[WARNING]', err));

client.on('error', err => console.error('[ERROR]', err));

client.on('disconnect', () => {
    console.warn('Disconnected!')
    process.exit(0);
});

client.on('uncaughtException', (err) => {
    console.log('Uncaught Exception: ' + err)
    process.exit(1)
});

client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    if (msg.guild) {
        if (msg.content.startsWith(`<@${msg.client.user.id}>`) || msg.content.startsWith(`<@!${msg.client.user.id}>`)) {
            client.util.handleTalk(msg);
        }
    }
});

client.on('ready', () => {
    client.util.handleStatus(client, status);
    console.log('[CLEVE] Started and ready to chat!');
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('[FATAL] Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});

client.login(bot_token);