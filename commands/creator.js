const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "creator",
    description: "Show the creator",
    execute(client, message, args) {
        let embed = new MessageEmbed()
        embed.color = '#1D3557'
        embed.description = '**Creator** **```Alexis Rojas from El Salvador```**'

        message.channel.send({
            embeds: [embed]
        })
    }
}