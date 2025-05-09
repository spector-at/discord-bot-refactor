const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return; // Ignore bot messages and DMs

  const SERVER_LOGS = {
    "1351057511402438656": {
      logChannelId: "1353183281574711448",
      specialLogChannelId: "1353190164054413322",
      restrictedChannelId: "1351396038610518047",
      supportChannelId: "1351397888009437266"
    }
  };

  const serverConfig = SERVER_LOGS[message.guild.id];
  if (!serverConfig) return;

  const { logChannelId, specialLogChannelId, restrictedChannelId, supportChannelId } = serverConfig;
  const userMention = `<@${message.author.id}>`;

  // 🔹 **Detect if the message contains a link**
  const linkRegex = /(https?:\/\/[^\s]+)/gi;
  const foundLinks = message.content.match(linkRegex);
  const linkText = foundLinks ? foundLinks.map(link => `[Click here](${link})`).join("\n") : null;

  // 🔹 **Format the Reason field**
  let reason = message.content;
  if (linkText) {
    reason += `\n\n🔗 **Link(s):**\n${linkText}`;
  }

  // ✅ Create log embed (No "Message Link" field)
  const logEmbed = new EmbedBuilder()
    .setColor("#FFA500")
    .setTitle("📜 Report Logged")
    .addFields(
      { name: "User", value: userMention, inline: true },
      { name: "Reason", value: reason || "No reason provided.", inline: false }
    )
    .setTimestamp();

  // ✅ Create "Go to Support" button
  const supportButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`support_${message.author.id}`)
      .setLabel("Go to Support")
      .setStyle(ButtonStyle.Primary)
  );

  // ✅ Log to the general server log channel
  const logChannel = client.channels.cache.get(logChannelId);
  if (logChannel) await logChannel.send({ embeds: [logEmbed], components: [supportButton] });

  // ✅ If message is from the restricted channel, log it to the special log channel
  if (message.channel.id === restrictedChannelId) {
    const specialLogChannel = client.channels.cache.get(specialLogChannelId);
    if (specialLogChannel) {
      await specialLogChannel.send({ embeds: [logEmbed], components: [supportButton] });
    }
  }
};
