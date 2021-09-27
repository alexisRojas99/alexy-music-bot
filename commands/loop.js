const { getVoiceConnection } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "loop",
    description: "loop of song in the voice channel",
    execute(client, message, args) {
        let queue = client.queue.get(message.guild.id)
        if(!queue) {
            // Queue is not present. That means user has not used play command. So no song is playing.
        }
        else {
            if(queue.loop >= 2) queue.loop = 0 // 0 number tells that queue is off. 1 = Loop current song, 2 = Loop whole queue.
            else queue.loop ++
            
            if(queue.loop === 0) return message.channel.send('Queue Loop is now off')
            else if(queue.loop === 1) return message.channel.send('Queue Loop is now changed to Current Song')
            else if(queue.loop === 2) return message.channel.send('Queue Loop is now changed to Loop queue.')
        }
    }
}