const {
    ApplicationCommandType,
    PermissionFlagsBits
} = require("discord.js");
module.exports = {
    name: "ping",
    description: `Ping Dong the bot`,
    type: ApplicationCommandType.ChatInput,
    options: [],
    userPermissions: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages],
    run: async (client, interaction) => {
        return interaction.reply({
            content: `🏓 Dong \`${client.ws.ping}ms\``
        })
    }
}