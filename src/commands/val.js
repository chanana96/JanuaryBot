const { SlashCommandBuilder } = require("@discordjs/builders");
const elo = require("./valorantCommands/elo");
const card = require("./valorantCommands/card");
const store = require("./valorantCommands/store");
const fnatic = require("./valorantCommands/fnatic");
const authenticate = require("./valorantCommands/authenticate");
const record = require("./valorantCommands/record");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("val")
    .setDescription("VARIOUS VALORANT RELATED COMMANDS!")
    .addSubcommand(elo.data)
    .addSubcommand(card.data)
    .addSubcommand(store.data)
    .addSubcommand(fnatic.data)
    .addSubcommand(authenticate.data),
  async execute(interaction) {
    let username, tag, matches_to_aggregate;

    if (
      interaction.options.get("username") !== null &&
      interaction.options.get("tag") !== null
    ) {
      username = interaction.options.getString("username");
      tag = interaction.options
        .getString("tag")
        .split("")
        .filter((char) => /[a-zA-Z0-9]/.test(char))
        .join("");
    }

    if (interaction.options.get("matches_to_aggregate") !== null) {
      matches_to_aggregate = interaction.options.getInteger(
        "matches_to_aggregate"
      );
    }

    switch (interaction.options.getSubcommand()) {
      case "elo":
        await elo.execute(interaction, username, tag);
        break;
      case "card":
        await card.execute(interaction, username, tag);
        break;
      case "store":
        await store.execute(interaction);
        break;
      case "fnatic":
        await fnatic.execute(interaction, matches_to_aggregate, username, tag);
        break;
      case "authenticate":
        login = interaction.options.getString("login");
        password = interaction.options.getString("password");
        await authenticate.execute(interaction, login, password);
        break;
      case "record":
        await record.execute(interaction);
        break;
    }
  },
};
