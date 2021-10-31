const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "loop",
    description: "loop of song in the voice channel",
    execute(client, message, args) {
        let queue = client.queue.get(message.guild.id)
        if (!queue) {
            // Queue is not present. That means user has not used play command. So no song is playing.
            let embed = new MessageEmbed()
                embed.color = '#7572AC'
                embed.description = `**You need a song in the queue**`

                let DM = message.channel.send({
                    embeds: [embed]
                })
                return DM;
            // return message.channel.send('you need a song in the queue')
        }
        else {
            if (queue.loop >= 2) queue.loop = 0 // 0 number tells that queue is off. 1 = Loop current song, 2 = Loop whole queue.
            else queue.loop++

            if (queue.loop === 0) {
                let embed = new MessageEmbed()
                embed.color = '#0B090A'
                embed.description = `**Queue loop is off**`

                let DM = message.channel.send({
                    embeds: [embed]
                })
                console.log(queue)
                return DM;
            }
            else if (queue.loop === 1) {
                let embed = new MessageEmbed()
                embed.color = '#349AD5'
                embed.description = `**Loop is for Current Song**`

                let DM = message.channel.send({
                    embeds: [embed]
                })
                console.log(queue)
                return DM;

            } 
            else if (queue.loop === 2) {
                let embed = new MessageEmbed()
                embed.color = '#F42272'
                embed.description = `**Loop is changed for the queue**`

                let DM = message.channel.send({
                    embeds: [embed]
                })
                console.log(queue)
                return DM;
            } 
        }
    }
}