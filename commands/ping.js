const Discord = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'show message ping',
    category:'general',
    permissions: ["SEND_MESSAGES"],
    async execute(client,message, args, cmd, Discord) { 
        let pingmsg = await message.channel.send(`<a:reload:732575989137276998>`);
        let ping = `Message Ping: ${Math.floor(pingmsg.createdTimestamp -  message.createdTimestamp)} ms\nDiscord Latency: ${Math.round(client.ws.ping)} ms`
        pingmsg.edit(`\`\`\`js\n${ping}\`\`\``)
        
    }
}