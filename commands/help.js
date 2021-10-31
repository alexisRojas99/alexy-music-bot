const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "help",
    description: "help for commands of Alexy",
    execute(client, message, args) {
        let embed = new MessageEmbed()
        embed.color = '#20a39e'
        embed.title = 'List of commands'
        embed.description = '**!pl** <name of song or youtube link>\n\n**!next** -> skip to the next song\n\n**!loop** -> loop the current song, loop the queue, loop changed off\n\n**!leave** -> Alexy leave the voice channel\n\n**!info** -> show software version\n\n**!creator** -> show the creator of this bot'

        message.channel.send({
            embeds: [embed]
        })
    }
}