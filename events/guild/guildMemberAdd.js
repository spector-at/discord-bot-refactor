const profileModel = require("../../models/profileSchema");

module.exports = async (client, message, args, cmd, Discord,profileData) => {
  let profile = await profileModel.create({
    userID: member.id,
    serverID: member.guild.id,
    coins: 300,
    bank: 0,
  });
  profile.save();
};