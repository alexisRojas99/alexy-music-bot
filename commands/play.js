const { getVoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')
const play = require('play-dl')

module.exports = {
    name: "play",
    description: "play music in the voice channel",
    async execute(client, message, args) {
        if (!message.member.voice.channel) {
            message.channel.send("you must be in a channel for the bot!");
            return;
        }
        // console.log(args)
        if (args.length === 0) {
            message.channel.send("you need to provide a name of song");
            return;
        }
        if (!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, [])
        let connection = getVoiceConnection(message.guild.id)
        if (!connection) connection = JoinChannel(client, message)

        let queue = client.queue.get(message.guild.id)
        if (queue.length === 0) {
            let info = await PlaySong(message, args, connection)
            queue.push({
                title: info.title,
                duration: info.durationRaw,
                url: info.url
            })

            let embed = new MessageEmbed()
            embed.color = '#0dbf6f'
            embed.title = `Playing Song`
            embed.description = `${info.title}\n${info.url}\n\n**Duration**\n${info.durationRaw}`

            // let DM = message.channel.send({
            //     embeds: [embed]
            // })
            return message.channel.send(`**Playing Song**\n${info.title}\n${info.url}\n**Duration**\n${info.durationRaw}`)
            // return DM;
        }
        else {
            let info = await VideoDetails(message, args)
            queue.push({
                title: info.title,
                duration: info.durationRaw,
                url: info.url
            })

            let embed = new MessageEmbed()
            embed.color = '#bab700'
            embed.title = `Added to queue`
            embed.description = `${info.title}\n**Duration**\n${info.durationRaw}`

            let DM = message.channel.send({
                embeds: [embed]
            })

            // return message.channel.send(`**Song**\n${info.title}\n**added to queue**`)
            return DM;
        } 
    }
}


async function VideoDetails(message, args) {
    let info;
    if (args[0].startsWith('https')) {
        info = await play.video_info(args[0])
        info = info.video_details
        return info
    }
    else {
        let search = await play.search(args.join(' '), { limit: 1 })
        info = search[0]
        return info
    }
}

function JoinChannel(client, message) {
    connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer()
    connection.subscribe(player)

    let queue = client.queue.get(message.guild.id)
    player.on(AudioPlayerStatus.Idle, async () => {
        queue.shift()
        if (queue.length === 0) {

            let embed = new MessageEmbed()
            embed.color = '#f42c04'
            embed.title = `Queue`
            embed.description = `queue ended`
 
            let DM = message.channel.send({
                embeds: [embed]
            })
            
            // return message.channel.send('**queue ended :c**')
            return DM;
        }
        else {
            let source = await play.stream(queue[0].url)
            let resource = createAudioResource(source.stream, {
                inputType: source.type
            })
            player.play(resource)

            let embed = new MessageEmbed()
            embed.color = '#f4f1de'
            embed.title = `Next track`
            embed.description = `${queue[0].title}\n${queue[0].url}\n\n**Duration**\n${queue[0].duration}`

            let DM = message.channel.send({
                embeds: [embed]
            })

            // return message.channel.send(`**Next Track** \n${queue[0].title}\n**Duration** ${queue[0].duration}`)
            return DM;
        }
    })
    return connection
}

async function PlaySong(message, args, connection) {
    let source, info;
    if (args[0].startsWith('https')) {
        let vid_info = await play.video_info(args[0])
        info = vid_info.video_details
        source = await play.stream_from_info(vid_info)
    }
    else {
        let search = await play.search(args.join(' '), { limit: 1 })
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