const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "skip",
    description: "skip song in the voice channel",
    execute(client, message, args) {
        let connection = getVoiceConnection(message.guild.id)
        if (client.queue.has(message.guild.id)) {
            let embed = new MessageEmbed()
            embed.color = '#db6443'
            embed.title = `Player status`
            embed.description = `Music has been skipped`

            message.channel.send({
                embeds: [embed]
            })

            let player = connection.state.subscription.player
            // console.log(client.queue.get(message.guild.id))
            player.stop();
        } else {
            message.channel.send('you must add songs to the queue');
        }
    }
}