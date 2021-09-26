require('dotenv').config();
const fs = require('fs');
// Require the necessary discord.js classes
const { Client, Intents, Collection } = require('discord.js');
// const { token } = require('./config.json');

let token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
client.events = new Collection();
client.queue = new Map();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
// we need commmand files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else { 
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
}

// Loading the command files
for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    
}

// Login to Discord with your client's token
client.login(token);