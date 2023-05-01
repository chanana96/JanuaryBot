const axios = require("axios");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
  .setName("elo")
  .setDescription(
    "TELLS YOU WHAT ELO THE SPECIFIED USER IS AT, ALONG WITH HOW MUCH THEY NEED FOR THEIR NEXT RANKUP!"
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .setRequired(true)
      .setDescription("your valorant username")
  )
  .addStringOption((option) =>
    option.setName("tag").setRequired(true).setDescription("your valorant tag")
  );

async function execute(interaction, username, tag) {
  const response = (
    await axios.get(
      "https://api.henrikdev.xyz/valorant/v1/mmr/ap/" + username + "/" + tag
    )
  ).data.data;
  const elo = response.elo;
  const currentTier = response.currenttierpatched;

  interaction.reply(`the user's elo is ${elo} at ${currentTier}`);
}

module.exports = { data, execute };
