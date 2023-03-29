const client = require('../index');
module.exports = {
    once: false,
    run: (client, interaction) => {
        if (interaction.user.bot || !interaction.guild) return;
        const command = client.slashCommands.get(interaction.commandName);
        if (command.userPermissions && command.botPermissions && command.run) {
            if (!interaction.member.permissions.has(command.userPermissions))
                return interaction.reply({
                    content: ':x: You do not have required permissions to run this command', 
                    ephemeral: true
                })
            if (!interaction.guild.members.me.permissions.has(command.botPermissions))
                return interaction.reply({
                    content: ':x: I do not have required permissions to execute this command', 
                    ephemeral: true
                })
            return command.run(client, interaction);
        } else {
            console.error('[ERR] Can not process interaction due to invalid command structure.');
        }
    }
}