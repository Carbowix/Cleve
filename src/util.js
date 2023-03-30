const {
    get
} = require('http');
const {
    promises,
    readFileSync,
    writeFile
} = require('fs');
const path = require('path');
const {
    URL,
    URLSearchParams
} = require('url');
const {
    chat
} = require('./misc/config.json');
const mainURL = new URL(chat.url);
const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};
const urlOptions = {
    bid: chat.brainID,
    key: chat.key,
    uid: null,
    msg: null
};

const loadModules = async (client) => {
    try {
        for (let dir of ['events', 'commands']) {
            const files = await promises.readdir(path.resolve(dir));
            for (const file of files) {
                if (path.extname(file) === '.js') {
                    const filePath = path.resolve(path.join(dir, file));
                    const cmdOrEvent = await require(filePath);
                    if (dir == 'events') {
                        const eventName = file.substring(0,file.length - 3)
                        cmdOrEvent.once ? client.once(eventName, (...args) => cmdOrEvent.run(client, ...args)) : client.on(eventName, (...args) => cmdOrEvent.run(client, ...args));
                    } else {
                        client.slashCommands.set(cmdOrEvent.name, cmdOrEvent)
                    }
                }
            }
        }
        console.log(`[CLEVE] Loaded ${Array.from(client.slashCommands).length} commands`);
        return true;
    } catch (e) {
        console.log(`[ERROR] Loading modules: \n${e.stack}`);;
    }
};

const handleTalk = async (client, msg) => {
    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, ''); // Remove any mentions in the message
    if (msg.content.length < 2 || (!msg.channel.isDMBased() && client.misc.channels.length > 0 && !client.misc.channels.includes(msg.channel.id))) return;
    msg.channel.sendTyping();
    urlOptions.uid = msg.author.id;
    urlOptions.msg = msg.content;
    mainURL.search = new URLSearchParams(urlOptions).toString();
    const message = await new Promise((resolve, reject) => {
        const req = get(mainURL, requestOptions, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error(`[${res.statusCode}] Unable to process request: \nReason: ${res.statusMessage}`));
            }
            res.setEncoding('utf8');
            let responseBody = "";
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseBody));
            });

            req.on('error', (err) => {
                reject(new Error(err));
            });

            req.end();
        });
    }).catch(e => {
        console.log('Unable to connect to API: ' + e.stack);
    });

    if (message && message.cnt) {
        msg.reply({
            content: message.cnt,
            allowedMentions: {
                repliedUser: false
            }
        });
    }
};

const updateConfig = (client) => {
    const configFile = readFileSync('./misc/config.json');
    if (configFile) {
        const configFileData = JSON.parse(configFile);
        configFileData['misc'] = client.misc;
        writeFile('./misc/config.json', JSON.stringify(configFileData, null, 2), (err) => {
            if (err) return console.log('[ERR] Updating configuration: \n' + err);
            console.log('[CLEVE] Updated configuration file');
        });
    }
};

module.exports = {
    handleTalk,
    loadModules,
    updateConfig
};