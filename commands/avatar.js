const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: 'avatar',
    aliases: ["av"],
    category: 'general',
    description: 'To get avatar',
    permissions: ["SEND_MESSAGES"],
    usage: '[user]',
    async execute(client, message, args, cmd, Discord, profileData) {
        var member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        if(!member.user){
            member = message.member
        }
        
        const embed = new EmbedBuilder().setImage(member.user.displayAvatarURL({dynamic: true}))

        message.channel.send({ embeds: [embed] });

    }
}