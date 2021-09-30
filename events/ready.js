
module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        client.user.setStatus('online');
        client.user.setActivity('!help', { type: 'LISTENING' });
        console.log('ping ' + client.ws.ping + 'ms');
        console.log("Logged in as " +  client.user.tag);
    }
}