const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "help",
    description: "help for commands of Alexy",
    execute(client, message, args) {
        let embed = new MessageEmbed()
        embed.color = '#20a39e'
        embed.title = 'List of commands'
        embed.description = '**Music commands**\n!play *name of song*\n!skip\n!loop\n!leave\n!info'

        message.channel.send({
            embeds: [embed]
        })
    }
}