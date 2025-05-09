module.exports = async (client, message) => {
  if (message.author.bot) return; // Ignore bot messages
  if (!message.guild) return; // Ignore DMs

  const prefix = '>'; // Ensure prefix is set
  if (!message.content.startsWith(prefix)) return;

  // Extract command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(`❌ Error executing command ${commandName}:`, error);
    await message.reply('❌ There was an error executing this command.')
      .then(msg => setTimeout(() => msg.delete().catch(console.error), 5000));
  }
};
