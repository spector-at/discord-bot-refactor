module.exports = async (client, message) => {
  if (message.author.bot) return;

  try {
    const user = await client.users.fetch(YOUR_USER_ID); // Make sure YOUR_USER_ID is defined
    console.log(`Fetched user: ${user.tag}`);
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
  }
};
