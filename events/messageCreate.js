module.exports = {
    name: "messageCreate",
    once: false,
    execute(client, message) {
        let args;
        const prefix = '!'
        let args1 = message.content.substr(0, 1);
        // console.log(args1)
        if (args1 == prefix) {
            args = message.content.slice(prefix.length).trim().split(' ')
            let command = args.shift().toLowerCase()
            if (client.commands.has(command)) client.commands.get(command).execute(client, message, args)
        } else {
            return;
        }

    }
}