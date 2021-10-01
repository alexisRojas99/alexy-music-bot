const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "leave",
    description: "leave the voice channel",
    execute(client, message, args) {
        let connection = getVoiceConnection(message.guild.id)
        if (connection) {
            let embed = new MessageEmbed()
            embed.color = '#e3f09b'
            embed.title = `Player Status`
            embed.description = `Leaving the voice channel`

            message.channel.send({
                embeds: [embed]
            })

            client.queue.delete(message.guild.id)

            connection.destroy();
        } else {
            let embed = new MessageEmbed()
            embed.color = '#e3f09b'
            embed.description = `**First play a song!**`

            message.channel.send({
                embeds: [embed]
            })

            client.queue.delete(message.guild.id)
            return;
        }
    }
}