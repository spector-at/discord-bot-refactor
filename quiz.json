const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'report',
  description: 'Report a URL with a reason.',
  usage: '<URL> <reason>', // Example: >report https://example.com This is spam
  async execute(client, message, args) {
    const USER_IDS = ['', '', ''];

    if (args.length < 2) {
      const botReply = await message.reply('Please provide a URL and a reason. Usage: >report <URL> <reason>');

      setTimeout(async () => { if (message.deletable) await message.delete().catch(console.error); }, 5000);
      setTimeout(async () => { if (botReply.deletable) await botReply.delete().catch(console.error); }, 5000);
      return;
    }

    const url = args[0];
    const reason = args.slice(1).join(' ');

    const urlRegex = /https?:\/\/[^\s]+/g;
    if (!urlRegex.test(url)) {
      const botReply = await message.reply('Please provide a valid URL.');

      setTimeout(async () => { if (message.deletable) await message.delete().catch(console.error); }, 5000);
      setTimeout(async () => { if (botReply.deletable) await botReply.delete().catch(console.error); }, 5000);
      return;
    }

    message.delete()
      .then(() => console.log(`Deleted report message from ${message.author.tag}`))
      .catch(error => console.error('Failed to delete message:', error));

    const reportEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('New Report')
      .addFields(
        { name: 'Reporter', value: `👤 ${message.author.tag} (ID: ${message.author.id})`, inline: true },
        { name: 'URL', value: url, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    try {
      for (const userId of USER_IDS) {
        const user = await client.users.fetch(userId);
        await user.send({ embeds: [reportEmbed] });
      }

      const thanksEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription('✅ Thank you for your report! It has been sent to the admins.')
        .setTimestamp();

      const thanksMessage = await message.channel.send({ embeds: [thanksEmbed] });

      setTimeout(() => { if (thanksMessage.deletable) thanksMessage.delete().catch(console.error); }, 5000);
    } catch (error) {
      console.error('Failed to send DM or thank you message:', error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('❌ An error occurred while processing your report. Please try again later.')
        .setTimestamp();

      const errorMessage = await message.channel.send({ embeds: [errorEmbed] });

      setTimeout(() => { if (errorMessage.deletable) errorMessage.delete().catch(console.error); }, 5000);
    }
  },
};
