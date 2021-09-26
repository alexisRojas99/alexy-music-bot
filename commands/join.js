const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');
const play = require('play-dl')
module.exports = {
    name: "join",
    description: "joins the voice channel",
    execute(client, message) {
        const connection = joinVoiceChannel({
            channelId : message.member.voice.channel.id,
            guildId : message.guild.id,
            adapterCreator : message.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer()
        connection.subscribe(player)

        if(!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, [])

        let queue = client.queue.get(message.guild.id)
        player.on(AudioPlayerStatus.Idle, async() => {
            queue.shift()
            if(queue.length === 0){
                return message.channel.send('Queue Ended :(')
            }
            else {
                let source = await play.stream(queue[0].url)
                let resource = createAudioResource(source.stream, {
                    inputType : source.type
                })
                player.play(resource)
                message.channel.send(`Next Track : \nTitle : ${queue[0].title}\nDuration : ${queue[0].duration}`)
            }
        })

        message.channel.send(`Connected to ${message.member.voice.channel.name}`)
    }
} 