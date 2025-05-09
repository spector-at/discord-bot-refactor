module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const ROLE_ID = '1351395622653136909'; // Replace with your actual role ID
        const role = member.guild.roles.cache.get(ROLE_ID);

        // Check if role exists
        if (!role) {
            console.error(`❌ Role with ID ${ROLE_ID} not found in ${member.guild.name}.`);
            return;
        }

        // Check if the bot has permission to manage roles
        if (!member.guild.me.permissions.has('MANAGE_ROLES')) {
            console.error(`❌ Bot lacks permission to assign roles in ${member.guild.name}.`);
            return;
        }

        try {
            await member.roles.add(role);
            console.log(`✅ Assigned role "${role.name}" to ${member.user.tag}.`);
        } catch (error) {
            console.error(`❌ Failed to assign role to ${member.user.tag}:`, error);
        }
    });
};
