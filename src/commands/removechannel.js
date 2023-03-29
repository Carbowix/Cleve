const {
    ApplicationCommandType,
    PermissionFlagsBits,
} = require("discord.js");
const {updateConfig} = require('../util');
module.exports = {
    name: "removechannel",
    description: `Remove a setted chat channel`,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'channel',
            description: 'Choose a channel',
            type: 7, // channel set
            required: true,
            autocomplete: true
        }
    ],
    userPermissions: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.SendMessages],
    run: async (client, interaction) => {
        const selectedChannel = interaction.options.getChannel('channel')
        if (selectedChannel && client.misc.channels.includes(selectedChannel.id.toString())) {
            const permissions = selectedChannel.permissionsFor(client.user);
            if (permissions.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
                client.misc.channels.splice(client.misc.channels.indexOf(selectedChannel.id.toString()), 1);
                updateConfig(client); // Updates config file with latest configuration update.
                return interaction.reply({
                    content: `:ballot_box_with_check: <#${selectedChannel.id}> has been successfuly removed as a chat channel`, 
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    content: `:x: No permission given to view the channel.`, 
                    ephemeral: true
                })
            }
        } else {
            return interaction.reply({
                content: `:x: This channel is not set as a chatting channel.\nAllowed chat channels: ${client.misc.channels.map(ch => `<#${ch}>`).join(' ')}`, 
                ephemeral: true
            })
        }

    }
}