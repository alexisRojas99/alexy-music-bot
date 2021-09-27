
module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        client.user.setActivity('!play', { type: 'LISTENING' });
        console.log('ping ' + client.ws.ping + 'ms');
        console.log("Logged in as " +  client.user.tag);
    }
}