const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");
const { getDailyStore } = require("../../api/val/storeApi/StoreAPI");

const data = new SlashCommandSubcommandBuilder()
  .setName("store")
  .setDescription("SHOWS YOU YOUR STORE FOR TODAY");

async function execute(interaction) {
  try {
    await getDailyStore(interaction);
  } catch (error) {
    return error;
  }
}

module.exports = { data, execute };
