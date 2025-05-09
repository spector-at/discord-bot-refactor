const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate, // Listen for the messageCreate event
  async execute(message, client) {
    if (message.author.bot) return; // Ignore messages from bots
    if (!message.guild) return; // Ignore DMs

    const YOUR_USER_ID = '412011486953865227'; // Replace with your Discord User ID

    // Check if the message contains a link
    const linkRegex = /https?:\/\/[^\s]+/g;
    const links = message.content.match(linkRegex);

    if (links) {
      try {
        // Fetch your user object
        const user = await client.users.fetch(YOUR_USER_ID);

        // Send the links to your DM
        await user.send(`Link sent by ${message.author.tag} in ${message.guild.name}: ${links.join('\n')}`);
      } catch (error) {
        console.error('Failed to send DM:', error);
      }
    }
  },