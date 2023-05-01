const { authCheck } = require("../utils/AuthCheck");
const { createRedisClient } = require("../../redisApi/CreateRedisClient");
const { setTokens } = require("./TokenAPI");
const { initPlayerData } = require("./getPlayerInfo");

const check = async (interaction, login, password) => {
  const check = await authCheck(interaction);
  if (check !== false) {
    await interaction.reply({
      content: "You've already connected your riot account!",
      ephemeral: true,
    });
    return;
  }
  const tokens = await setTokens(login, password, interaction);
  return tokens;
};

const registerUser = async (interaction, tokens) => {
  const client = await createRedisClient();
  const userid = interaction.user.id;
  const userData = JSON.stringify(await initPlayerData(tokens));
  await client.set(userid, userData);
};

const getData = async (interaction, login, password) => {
  const tokens = await check(interaction, login, password);
  if (tokens) {
    await registerUser(interaction, tokens);
  }
};

module.exports = { getData };
