const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "kick",
    description: "kick users",
    execute(client, message, args) {
        // const member = message.mentions.members.first();
        // console.log(member.user.id)
        // member.kick();
        message.channel.send('We working in this...')
    }
} 