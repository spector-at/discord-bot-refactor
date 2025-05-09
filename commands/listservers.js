const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listservers', // Command name
  description: 'Lists all running Minecraft servers.', // Command description
  execute(client, message, args) {
    // Execute the list script
    exec('/opt/minecraft/vanilla/list_minecraft_servers.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error listing Minecraft servers: ${error.message}`);
        console.error(`Full error: ${error}`);
        return message.reply('There was an error listing Minecraft servers. Check the bot logs for details.');
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return message.reply('There was an error listing Minecraft servers. Check the bot logs for details.');
      }

      // Create an embed for the server list
      const serverListEmbed = new EmbedBuilder()
        .setColor(0x00FF00) // Green color
        .setTitle('🔄 Running Minecraft Servers')
        .setDescription(`\`\`\`${stdout || 'No servers are currently running.'}\`\`\``)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      message.reply({ embeds: [serverListEmbed] });
    });
  },
};