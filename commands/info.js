const version = require('../package.json');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "info",
    description: "info of Alexy",
    execute(client, message, args) {
        let embed = new MessageEmbed()
        embed.color = '#20a39e'
        embed.description = `**v${version.version}**`

        message.channel.send({
            embeds: [embed]
        })
    }
}