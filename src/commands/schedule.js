const add = require("./scheduleCommands/add");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("MODIFY/VIEW THE TEAM SCHEDULE")
    .addSubcommand(add.data),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "add":
        await add.execute(interaction);
        break;
    }
  },
};
