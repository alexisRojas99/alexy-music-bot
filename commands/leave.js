const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "leave",
    description: "leave the voice channel",
    execute(client, message, args) {
        let connection = getVoiceConnection(message.guild.id)

        let embed = new MessageEmbed()
        embed.color = '#e3f09b'
        embed.title = `Player Status`
        embed.description = `Leaving the voice channel`

        message.channel.send({
            embeds: [embed]
        })
        connection.destroy();

    }
}