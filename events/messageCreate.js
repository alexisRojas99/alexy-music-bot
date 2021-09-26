
module.exports = {
    name: "messageCreate",
    once: false,
    execute(client, message) {
        const prefix = '!'
        let args = message.content.slice(prefix.length).trim().split(' ')
        let command = args.shift().toLowerCase()
        if(client.commands.has(command)) client.commands.get(command).execute(client, message, args)
    }
} 