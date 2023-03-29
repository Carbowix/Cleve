const client = require('../index');
module.exports = {
    once: false,
    run: async () => {
        const allCommands = await client.slashCommands.map(c => c);
        await client.application.commands.set(allCommands);
        console.log('[CLEVE] Ready to chat!');
    }
};