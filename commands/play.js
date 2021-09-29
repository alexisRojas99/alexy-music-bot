const { getVoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js')
const play = require('play-dl')

module.exports = {
    name: "play",
    description: "play music in the voice channel",
    cooldown: 4,
    async execute(client, message, args) {


        if (client.cooldown.has(message.member.id)) {
            let embed = new MessageEmbed()
            embed.color = '#DCD66A'
            embed.description = `Searching the song...`

            let DM = message.channel.send({
                embeds: [embed]
            })

            return DM;
        }

        else {
            client.cooldown.set(message.member.id, this.name)
            setTimeout(() => {
                client.cooldown.delete(message.member.id)
            }, this.cooldown * 1000)
        }

        if (!message.member.voice.channel) {
            let embed = new MessageEmbed()
            embed.color = '#ff8427'
            embed.description = `You must be in a channel for the bot!`

            message.channel.send({
                embeds: [embed]
            })
            // message.channel.send("you must be in a channel for the bot!");
            return;
        }
        // console.log(args)
        if (args.length === 0) {
            let embed = new MessageEmbed()
            embed.color = '#db6443'
            embed.title = `Player Status`
            embed.description = `You need to provide a name of song or link`

            message.channel.send({
                embeds: [embed]
            })
            // message.channel.send("you need to provide a name of song");
            return;
        }
        if (!client.queue.has(message.guild.id)) client.queue.set(message.guild.id, { loop: 0, songs: [] })
        let connection = getVoiceConnection(message.guild.id)
        if (!connection) connection = JoinChannel(client, message)

        let queue = client.queue.get(message.guild.id)
        if (queue.songs.length === 0) {
            let info = await PlaySong(message, args, connection)
            queue.songs.push({
                title: info.title,
                duration: info.durationRaw,
                thumbnail: info.thumbnail.url,
                url: info.url
            })

            let embed = new MessageEmbed()
            embed.color = '#0dbf6f'
            embed.title = `Playing Song`
            embed.setThumbnail(info.thumbnail.url)
            embed.description = `[${info.title}](${info.url})`
            embed.addField(`**Duration**`, `${info.durationRaw}`, true)

            let DM = message.channel.send({
                embeds: [embed]
            })
            // return message.channel.send(`**Playing Song**\n${info.title}\n${info.url}\n**Duration**\n${info.durationRaw}`)
            return DM;
        }
        else {
            let info = await VideoDetails(message, args)
            queue.songs.push({
                title: info.title,
                duration: info.durationRaw,
                thumbnail: info.thumbnail.url,
                url: info.url
            })

            let embed = new MessageEmbed()
            embed.color = '#bab700'
            embed.title = `Added to queue`
            embed.setThumbnail(info.thumbnail.url)
            embed.description = `[${info.title}](${info.url})`
            embed.addField(`**Duration**`, `${info.durationRaw}`, true)

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
        if (queue.loop === 0) queue.songs.shift()
        else if (queue.loop === 2) queue.songs.push(queue.songs.shift())
        if (queue.songs.length === 0) {

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
            let source = await play.stream(queue.songs[0].url)
            let resource = createAudioResource(source.stream, {
                inputType: source.type
            })
            player.play(resource)

            let embed = new MessageEmbed()
            embed.color = '#f4f1de'
            embed.title = `Next track`
            embed.setThumbnail(queue.songs[0].thumbnail)
            embed.description = `[${queue.songs[0].title}](${queue.songs[0].url})`
            embed.addField(`**Duration**`, `${queue.songs[0].duration}`, true)

            let DM = message.channel.send({
                embeds: [embed]
            })

            // return message.channel.send(`**Next Track** \n${queue[0].title}\n**Duration** ${queue[0].duration}`)
            return DM;
        }
    })

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        player.removeAllListeners()
        connection.removeAllListeners()
        queue.songs = []
    });

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        console.log (connection.state.status) 
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            // console.log(error)
            connection.destroy();
        }
    });

    player.on(AudioPlayerStatus.Idle, () => {
        let timer = setTimeout(() => { connection.destroy() }, 50000) // Destroys connection in next 50 seconds
        player.once(AudioPlayerStatus.Playing, () => { clearTimeout(timer) })
    });

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