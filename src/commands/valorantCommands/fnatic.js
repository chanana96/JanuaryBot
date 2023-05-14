const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { getData } = require("../../api/val/fnaticApi/FnaticAPI");

const data = new SlashCommandSubcommandBuilder()
  .setName("fnatic")
  .setDescription(
    "HOW MANY TIMES WOULD YOU HAVE DIED IF YOU HAD LIGHT ARMOR? IN A PIE CHART"
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .setRequired(true)
      .setDescription("your valorant username")
  )
  .addStringOption((option) =>
    option.setName("tag").setRequired(true).setDescription("your valorant tag")
  )
  .addIntegerOption((option) =>
    option
      .setName("matches_to_aggregate")
      .setRequired(false)
      .setDescription(
        "How many matches do you want to average the data from? Default: 1"
      )
      .setMinValue(1)
      .setMaxValue(25)
  );

async function execute(interaction, matches_to_aggregate, username, tag) {
  if (matches_to_aggregate === undefined) {
    matches_to_aggregate = 1;
    await getData(interaction, matches_to_aggregate, username, tag);
  } else {
    await getData(interaction, matches_to_aggregate, username, tag);
  }
}

module.exports = { data, execute };
