const { createRedisClient } = require("../../redisapi/CreateRedisClient");

const authCheck = async (interaction) => {
  const discordUID = interaction.user.id;
  const client = await createRedisClient();
  const userData = await client.get(discordUID);
  if (userData === null) {
    if (interaction.deferred) {
      await interaction.editReply({
        content: "Please connect your riot account!",
        ephemeral: true,
      });
    }
    return false;
  } else {
    return JSON.parse(userData);
  }
};

module.exports = { authCheck };
