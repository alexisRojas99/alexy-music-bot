const { getVoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
const play = require('play-dl')

module.exports = {
    name: "play",
    description: "play music in the voice channel",
    async execute(client, message, args) {
        if(!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, [])
        let connection = getVoiceConnection(message.guild.id)
        if(!connection) connection = JoinChannel(client, message)

        let queue = client.queue.get(message.guild.id)
        if(queue.length === 0){
            let info = await PlaySong(message, args, connection)
            queue.push({
                title : info.title,
                duration : info.durationInSec,
                url : info.url
            })
            return message.channel.send(`Playing Song : ${info.title}\nDuration: ${info.durationInSec}`)
        }
        else { 
            let info = await VideoDetails(message, args)
            queue.push({
                title : info.title,
                duration : info.durationInSec,
                url : info.url
            })
            return message.channel.send(`Song : ${info.title}\nis added to Queue.`)
        }
    }
} 


async function VideoDetails(message, args){
    let info;
    if(args[0].startsWith('https')){
        info = await play.video_info(args[0])
        info = info.video_details
        return info
    }
    else {
        let search = await play.search(args.join(' '), { limit : 1 })
        info = search[0]
        return info
    }
}

function JoinChannel (client ,message){
    connection = joinVoiceChannel({
        channelId : message.member.voice.channel.id,
        guildId : message.guild.id,
        adapterCreator : message.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer()
    connection.subscribe(player)

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
    return connection
}

async function PlaySong(message, args, connection){
    let source, info;
    if(args[0].startsWith('https')){
        let vid_info = await play.video_info(args[0])
        info = vid_info.video_details
        source = await play.stream_from_info(vid_info)
    }
    else {
        let search = await play.search(args.join(' '), { limit : 1 })
        info = search[0]
        source = await play.stream(search[0].url)
    }

    let resource = createAudioResource(source.stream, {
        inputType: source.type
    })
    let player = connection.state.subscription.player
    player.play(resource)
    return info
}