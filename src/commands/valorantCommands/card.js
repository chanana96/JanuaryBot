const axios = require("axios");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
  .setName("card")
  .setDescription("SHOWS YOU YOUR PLAYER CARD, MUST SPECIFY CARD SIZE")
  .addStringOption((option) =>
    option
      .setName("username")
      .setRequired(true)
      .setDescription("your valorant username")
  )
  .addStringOption((option) =>
    option.setName("tag").setRequired(true).setDescription("your valorant tag")
  )
  .addStringOption((option) =>
    option
      .setName("card_size")
      .setRequired(true)
      .setDescription("select a card size")
      .addChoices(
        { name: "Large", value: "large" },
        { name: "Small", value: "small" },
        { name: "Wide", value: "wide" }
      )
  );

async function execute(interaction, username, tag) {
  const cardSize = interaction.options.getString("card_size");
  const response = (
    await axios.get(
      "https://api.henrikdev.xyz/valorant/v1/account/" + username + "/" + tag
    )
  ).data.data.card;
  interaction.reply(response[cardSize]);
}

module.exports = { data, execute };
