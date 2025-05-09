const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rules',
  description: 'Rules for the server.',
  permissions: ['MANAGE_MESSAGES'], // Restrict to users with MANAGE_MESSAGES permission
  async execute(client, message, args, cmd, Discord) {
    const newEmbed = new EmbedBuilder()
      .setColor('#304281') // Set the embed color
      .setTitle('Server Rules')
      .setAuthor({
        name: 'Tino Bot',
        iconURL: 'https://pbs.twimg.com/media/EcVoipsXQAUiP_N?format=jpg&name=medium', // Set the bot's icon
      })
      .addFields(
        {
          name: 'Rule 1: Follow Discord ToS and Community Guidelines',
          value: 'All users must abide by Discord\'s [Terms of Service](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines).',
        },
        {
          name: 'Rule 2: Site Links in the Link Reporting Channel',
          value: 'Do not share site links outside of the designated **link reporting channel**. Use the bot to report links.',
        },
      )
      .setFooter({ text: 'Make sure to follow the rules.' });

    // Send the embed
    message.channel.send({ embeds: [newEmbed] });
  },
};