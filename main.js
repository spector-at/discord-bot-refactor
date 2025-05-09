const Discord = require('discord.js');
const { Client, GatewayIntentBits, Collection, Partials } = Discord;
const path = require('path');
const fs = require('fs');
require('dotenv-flow').config();
const mysql = require('mysql2');

// ✅ Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'logs',
  password: '1Maxwoof',
  database: 'logs',
   charset: 'utf8mb4' // 👈 important!
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
  } else {
    console.log('✅ Connected to MySQL as id ' + connection.threadId);
  }
});

// ✅ Error logging to MySQL
const logErrorToDatabase = (error) => {
  const message = error?.message || String(error);
  const stack = error?.stack || 'No stack trace';

  connection.query(
    'INSERT INTO bot_errors (error_message, stack_trace) VALUES (?, ?)',
    [message, stack],
    (err) => {
      if (err) console.error('❌ Failed to log error to DB:', err);
      else console.log('📦 Error logged to database.');
    }
  );
};

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  logErrorToDatabase(reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  logErrorToDatabase(error);
});

// ✅ Bot prefix
const prefix = '>';

// ✅ Initialize bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ✅ Bot activity
const activities = [
  "with code.",
  "with the developers console.",
  "with the >help command.",
  "with Music."
];

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const setRandomActivity = () => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity({ name: activity, type: "PLAYING" });
  };

  setRandomActivity();
  setInterval(setRandomActivity, 1000 * 30);
});

// ✅ Load commands dynamically
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  console.error(`❌ ERROR: Commands folder does not exist at: ${commandsPath}`);
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  try {
    console.log(`🔹 Loading command: ${file}`);
    const command = require(path.join(commandsPath, file));
    if (!command.name) {
      console.warn(`⚠️ Skipping ${file}: Missing "name" property.`);
      continue;
    }
    client.commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
  } catch (error) {
    console.error(`❌ Error loading command ${file}:`, error);
    logErrorToDatabase(error);
  }
}

// ✅ Auto role on join
client.on('guildMemberAdd', async (member) => {
  const ROLE_ID = '1351395622653136909';
  const role = member.guild.roles.cache.get(ROLE_ID);
  if (!role) {
    console.error(`❌ Role with ID ${ROLE_ID} not found.`);
    return;
  }
  try {
    await member.roles.add(role);
    console.log(`✅ Assigned role ${role.name} to ${member.user.tag}`);
  } catch (error) {
    console.error(`❌ Failed to assign role:`, error);
    logErrorToDatabase(error);
  }
});

// ✅ Define restricted channels
const TARGET_CHANNELS = ['1351399908254679061', '1351396038610518047'];
const LINK_CHANNEL_ID = '1351397888009437266';
const REPORT_CHANNEL_ID = '1353190164054413322';

// ✅ Message handling
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;

    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    const reportLinksChannelID = '1351396038610518047';
    const reportedLinksChannelID = '1353190164054413322';

    if (message.channel.id === reportLinksChannelID) {
      try {
        const reportedLinksChannel = client.channels.cache.get(reportedLinksChannelID);
        if (!reportedLinksChannel) {
          console.error(`❌ Could not find the reported-links channel (ID: ${reportedLinksChannelID})`);
          return;
        }

        await reportedLinksChannel.send(
          `📢 **New Report!**\n👤 **User:** <@${message.author.id}>\n📌 **Message:** ${message.content}`
        );

        console.log(`✅ Report forwarded to reported-links by ${message.author.tag}`);
      } catch (error) {
        console.error(`❌ Error forwarding report message:`, error);
        logErrorToDatabase(error);
      }
    }

    connection.query('SELECT COUNT(*) AS count FROM messages WHERE message_id = ?', [message.id], (err, results) => {
      if (err) {
        console.error('Error checking for existing message:', err);
        logErrorToDatabase(err);
        return;
      }

      if (results[0].count === 0) {
        const values = [
          message.id, message.author.id, message.author.tag, message.guild ? message.guild.id : null,
          message.guild ? message.guild.name : 'Unknown', message.channel.id, message.channel.name,
          message.content, 'sent',
          message.mentions.users.map(user => user.id).join(', ') || 'None',
          message.mentions.roles.map(role => role.id).join(', ') || 'None',
          message.attachments.size > 0 ? message.attachments.map(a => a.url).join(', ') : null,
          message.guild ? 0 : 1
        ];

        connection.query(
          'INSERT INTO messages (message_id, user_id, user_mention, server_id, server_name, channel_id, channel_name, content, message_type, mentioned_users, mentioned_roles, attachments, is_dm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          values,
          (err) => {
            if (err) {
              console.error('Error inserting message:', err);
              logErrorToDatabase(err);
              return;
            }
            console.log('✅ Message logged successfully.');
          }
        );
      }
    });

    if (message.channel.id === LINK_CHANNEL_ID && linkRegex.test(message.content)) {
      try {
        await message.delete();
        const warningMessage = await message.channel.send(`${message.author}, links are not allowed here. Please post them in <#${reportLinksChannelID}>.`);
        setTimeout(() => warningMessage.delete().catch(console.error), 5000);
      } catch (error) {
        console.error(`❌ Failed to delete or warn link message:`, error);
        logErrorToDatabase(error);
      }
      return;
    }

    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);

      if (command) {
        try {
          await command.execute(client, message, args);
          setTimeout(() => message.delete().catch(console.error), 5000);
        } catch (error) {
          console.error(`❌ Error executing ${commandName}:`, error);
          logErrorToDatabase(error);
          const errorReply = await message.reply('There was an error executing that command.');
          setTimeout(() => errorReply.delete().catch(console.error), 5000);
        }
      }
    }

    if (TARGET_CHANNELS.includes(message.channel.id)) {
      try {
        await message.delete();
        const warningMessage = await message.channel.send(`${message.author}, Report was sent.`);
        setTimeout(() => warningMessage.delete().catch(console.error), 5000);
      } catch (error) {
        console.error(`❌ Failed to delete unauthorized message:`, error);
        logErrorToDatabase(error);
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error in messageCreate:', error);
    logErrorToDatabase(error);
  }
});

// ✅ Track deleted messages
client.on('messageDelete', async (message) => {
  connection.query(
    'UPDATE messages SET deleted_at = NOW() WHERE message_id = ?',
    [message.id],
    (err, results) => {
      if (err) {
        console.error('Error updating deleted message timestamp:', err);
        logErrorToDatabase(err);
        return;
      }
      console.log('✅ Message marked as deleted:', results);
    }
  );
});

// ✅ Error handlers
client.on('error', (error) => {
  console.error('❌ Discord Client Error:', error);
  logErrorToDatabase(error);
});

client.on('warn', (info) => {
  console.warn('⚠️ Discord Client Warning:', info);
  logErrorToDatabase(info);
});

client.on('shardError', (error) => {
  console.error('❌ Shard Error:', error);
  logErrorToDatabase(error);
});

// ✅ Log in to Discord
client.login(process.env.TOKEN)
  .then(() => {
    console.log('✅ Bot is successfully logged in!');
  })
  .catch((err) => {
    console.error("❌ Failed to log in:", err);
    logErrorToDatabase(err);
  });
