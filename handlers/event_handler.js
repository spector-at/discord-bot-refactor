const fs = require('fs');

module.exports = (client) => {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    // If the event file is "messageCreate.js"
    if (file === 'messageCreate.js') {
      client.on('messageCreate', (message) => event(client, message)); // ✅ FIXED
    } else {
      client.on(file.split('.')[0], event.bind(null, client));
    }
  }
};
