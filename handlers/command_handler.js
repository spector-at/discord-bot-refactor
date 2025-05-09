const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  client.commands = new Map(); // Use a Map for better efficiency

  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));

      if (!command.name || typeof command.execute !== 'function') {
        console.warn(`⚠️ Skipping ${file}: Invalid command format.`);
        continue;
      }

      client.commands.set(command.name, command);
      console.log(`✅ Loaded command: ${command.name}`);
    } catch (error) {
      console.error(`❌ Error loading command ${file}:`, error);
    }
  }
};
