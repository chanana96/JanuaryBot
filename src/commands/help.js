const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("I CAN TELL YOU WHAT I'M CAPABLE OF!"),
  async execute(interaction) {
    let author = {
      name: `BEEP BOOP I AM JANUARY`,
      iconURL: interaction.client.user.avatarURL(),
    };
    const embed = new Discord.MessageEmbed()
      .setAuthor(author)
      .setTitle("WHAT CAN I DO? (only valorant commands for now)")
      .addFields({
        name: "/val fnatic [username] [tag] [number of matches *max 25*]",
        value:
          "Fnatic beat LOUD in a close comeback buying light armor full buys instead of heavy armor. Have you ever wondered just how much money you'd save if you did that? What if you get 140'd by a phantom? This command will figure out how many times you would've **actually** died if you had light armor instead of heavy armor. You'd be surprised! *disclaimer: does not work if you are playing healing agents or if you have healers on your team. limitation on riot's side, unfortunately*",
      })
      .addFields({
        name: "/val store",
        value:
          "Just shows you your daily store. Login required for this, look at the /val authenticate command.",
      })
      .addFields({
        name: "/val authenticate",
        value:
          "Authenticates with your riot login and password. I will **NEVER** save your password, I only remember your cookies so you don't have to reauthenticate!",
      })
      .setTimestamp()
      .setFooter({ text: "i love u guys" });
    await interaction.reply({ embeds: [embed] });
  },
};
