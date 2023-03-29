const {
    ApplicationCommandType,
    PermissionFlagsBits,
    ChannelType
} = require("discord.js");
const {updateConfig} = require('../util');
module.exports = {
    name: "setchannel",
    description: `Set a channel for the bot to chat with others`,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'channel',
            description: 'Choose a channel',
            type: 7, // channel set
            required: true
        }
    ],
    userPermissions: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.SendMessages],
    run: async (client, interaction) => {
        const selectedChannel = interaction.options.getChannel('channel')
        if (selectedChannel && !client.misc.channels.includes(selectedChannel.id.toString())) {
            if (selectedChannel.type != ChannelType.GuildText) return interaction.reply({
                content: `:x: Only text channels are allowed to be set as a chatting channel.`, 
                ephemeral: true
            });
            const permissions = selectedChannel.permissionsFor(client.user);
            if (permissions.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
                client.misc.channels.push(selectedChannel.id.toString());
                updateConfig(client); // Updates config file with latest configuration update.
                return interaction.reply({
                    content: `:ballot_box_with_check: <#${selectedChannel.id}> has been successfuly set as a chat channel`, 
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    content: `:x: No permission given to view the channel.`, 
                    ephemeral: true
                })
            }
            //client.misc.channels.push(selectedChannel.id);
        } else {
            return interaction.reply({
                content: `:x: You already set this channel for chat`, 
                ephemeral: true
            })
        }
    }
}