const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { getData } = require("../../API/val/valAuthApi/AuthenticateAPI");

const data = new SlashCommandSubcommandBuilder()
  .setName("authenticate")
  .setDescription(
    "YOUR USERNAME/PASSWORD IS **NOT STORED**!! ONLY YOUR COOKIE WILL BE SAVED!!"
  )
  .addStringOption((option) =>
    option
      .setName("login")
      .setRequired(true)
      .setDescription("your riot username")
  )
  .addStringOption((option) =>
    option
      .setName("password")
      .setRequired(true)
      .setDescription("your riot password")
  );

async function execute(interaction, login, password) {
  try {
    await getData(interaction, login, password);
  } catch (error) {
    interaction.reply({
      content:
        "There was an error! Please make sure your login details are correct",
      ephemeral: true,
    });
    return;
  }
}

module.exports = { data, execute };
