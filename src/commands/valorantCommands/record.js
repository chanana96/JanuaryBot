const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const {
  startRecordingSession,
} = require("../../api/val/recorderApi/StartRecordingSession");

const data = new SlashCommandSubcommandBuilder()
  .setName("record")
  .setDescription(
    "RECORDS WHEN GAME STARTS, UPLOADS TO YOUTUBE WHEN GAME ENDS, DELETES FILE FROM PC AFTERWARDS!"
  );

async function execute(interaction) {}

module.exports = { data, execute };
